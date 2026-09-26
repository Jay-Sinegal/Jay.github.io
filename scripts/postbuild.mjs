import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist");
const DOCS = join(ROOT, "docs");

// 1. Merge the Astro static build into docs/ (overwrite matching files,
//    keep everything else: legacy articles, images, tracker csv, etc).
function copyTree(src, dest) {
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    if (statSync(from).isDirectory()) {
      copyTree(from, to);
    } else {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
    }
  }
}

if (!existsSync(OUT)) {
  console.error("No dist/ directory found. Did `astro build` run?");
  process.exit(1);
}
copyTree(OUT, DOCS);
console.log("Merged Astro build into docs/.");

// 1b. Prune stale hashed assets in docs/_astro that the previous build left
//     behind and the current build no longer references. Only this hashed
//     asset directory is safe to prune; all other docs/ content is preserved.
function pruneStaleAssets(src, dest) {
  if (!existsSync(dest)) return;
  const fresh = new Set(readdirSync(src));
  for (const entry of readdirSync(dest)) {
    const to = join(dest, entry);
    if (!fresh.has(entry)) {
      rmSync(to, { recursive: true, force: true });
      console.log(`Pruned stale asset: ${relative(ROOT, to)}`);
    }
  }
}
const freshAssets = join(OUT, "_astro");
if (existsSync(freshAssets)) {
  pruneStaleAssets(freshAssets, join(DOCS, "_astro"));
} else {
  // No fresh hashed assets were emitted this build (e.g. styles inlined),
  // so every leftover hashed asset in docs is stale by definition.
  const stale = join(DOCS, "_astro");
  if (existsSync(stale)) {
    rmSync(stale, { recursive: true, force: true });
    console.log(`Pruned stale asset dir: ${relative(ROOT, stale)}`);
  }
}

// 1c. Several Astro pages must keep legacy canonical URLs ending in .html
//     (/faq.html, /privacy.html, /find-a-producer.html, /blog/<slug>.html)
//     while Astro emits them under directories (dist/faq/index.html). Flatten
//     each back to the .html file that replaces the old hand-maintained page.
for (const name of ["faq", "privacy", "find-a-producer"]) {
  const dirHtml = join(DOCS, name, "index.html");
  const flatHtml = join(DOCS, `${name}.html`);
  if (existsSync(dirHtml)) {
    rmSync(flatHtml, { force: true });
    copyFileSync(dirHtml, flatHtml);
    rmSync(join(DOCS, name), { recursive: true, force: true });
    console.log(`Flattened docs/${name}/index.html -> docs/${name}.html`);
  }
}

// Blog articles render at /blog/<slug>/index.html in dist; flatten each to
// the established /blog/<slug>.html URL.
const blogDist = join(OUT, "blog");
if (existsSync(blogDist) && statSync(blogDist).isDirectory()) {
  for (const entry of readdirSync(blogDist)) {
    if (entry === "index.html") continue;
    const dirHtml = join(blogDist, entry, "index.html");
    if (!existsSync(dirHtml)) continue;
    const flatHtml = join(DOCS, "blog", `${entry}.html`);
    rmSync(flatHtml, { force: true });
    copyFileSync(dirHtml, flatHtml);
    rmSync(join(DOCS, "blog", entry), { recursive: true, force: true });
    console.log(`Flattened docs/blog/${entry}/index.html -> docs/blog/${entry}.html`);
  }
}

// 2. Patch the generated 404.html with proper 404 SEO metadata so it satisfies
//    the repository's SEO validator while staying honest for search engines.
//    Canonical points at the homepage root (a soft-404 pattern) so the 404 page
//    never needs its own sitemap entry.
const notFound = join(DOCS, "404.html");
if (existsSync(notFound)) {
  let html = readFileSync(notFound, "utf8");
  const title = "Page Not Found | Jaylen Sinegal";
  const description =
    "This page could not be found on jaylensinegal.com. Head back to the homepage to explore Jaylen Sinegal's brand strategy work and blog.";
  const openGraph = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="This page could not be found on jaylensinegal.com." />
    <meta property="og:url" content="https://jaylensinegal.com/404.html" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://jaylensinegal.com/louisiana-storyteller.jpg" />
    <meta property="og:image:alt" content="Jaylen Sinegal, Louisiana brand strategist and storyteller" />
    <meta name="twitter:card" content="summary_large_image" />`;

  html = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
    .replace(/<meta name="robots" content="[^"]*"/, '<meta name="robots" content="noindex, follow"')
    .replace(/<link rel="canonical" href="[^"]*"/, '<link rel="canonical" href="https://jaylensinegal.com/"')
    .replace(/(<\/head>)/, `${openGraph}\n$1`);
  if (!html.includes('property="og:url"')) {
    html = html.replace(/(<\/head>)/, `\n${openGraph}\n$1`);
  }
  writeFileSync(notFound, html);
  console.log("Patched docs/404.html SEO metadata.");
} else {
  console.warn("docs/404.html not found after merge; skipping 404 patch.");
}

// 3. Keep sitemap canonical parity: every exported canonical must exist as <loc>.
//    Resource slugs come from resources.json, the single source of truth.
const RESOURCE_SLUGS = JSON.parse(
  readFileSync(join(ROOT, "src", "data", "resources.json"), "utf8"),
).map((resource) => resource.slug);
const sitemapPath = join(DOCS, "sitemap.xml");
if (existsSync(sitemapPath)) {
  let sitemap = readFileSync(sitemapPath, "utf8");
  const locales = [
    "https://jaylensinegal.com/blog/",
    "https://jaylensinegal.com/blog/escaping-platform-lock-in-hudl-student-athlete-ip.html",
    "https://jaylensinegal.com/blog/hbcu-college-athletics-louisiana-scholarships.html",
  ];
  // 404.html is intentionally NOT a sitemap <loc>: it canonicalizes to the
  // homepage so bots consolidate soft-404s instead of indexing an error page.
  locales.push("https://jaylensinegal.com/resources/");
  for (const slug of RESOURCE_SLUGS) {
    locales.push(`https://jaylensinegal.com/resources/${slug}/`);
  }
  let changed = false;
  for (const loc of locales) {
    if (!sitemap.includes(`<loc>${loc}</loc>`)) {
      sitemap = sitemap.replace("</urlset>", `  <url>\n    <loc>${loc}</loc>\n  </url>\n</urlset>`);
      changed = true;
    }
  }
  // A lingering /404.html entry is treated as stale and stripped.
  const stale404 = `<url>\n    <loc>https://jaylensinegal.com/404.html</loc>\n  </url>\n`;
  const stale404Inline = `<url><loc>https://jaylensinegal.com/404.html</loc></url>`;
  if (sitemap.includes(stale404)) {
    sitemap = sitemap.replace(stale404, "");
    changed = true;
  }
  if (sitemap.includes(stale404Inline)) {
    sitemap = sitemap.replace(stale404Inline, "");
    changed = true;
  }
  if (changed) {
    writeFileSync(sitemapPath, sitemap);
    console.log("Updated docs/sitemap.xml with new URLs.");
  }
} else {
  console.warn("docs/sitemap.xml missing; skipping sitemap update.");
}

console.log("Postbuild complete.");