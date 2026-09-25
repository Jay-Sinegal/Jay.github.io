import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Long-form brand strategy, media IP, and sports entertainment thinking from Jaylen Sinegal: athletes, families, schools, events, and Louisiana brands.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog | Jaylen Sinegal",
    description:
      "Long-form brand strategy, media IP, and sports entertainment thinking from Jaylen Sinegal.",
    url: "https://jaylensinegal.com/blog/",
    images: [
      {
        url: "https://jaylensinegal.com/louisiana-storyteller.jpg",
        width: 2000,
        height: 2000,
        alt: "Jaylen Sinegal, executive brand strategist and Louisiana storyteller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Jaylen Sinegal",
    description:
      "Long-form brand strategy, media IP, and sports entertainment thinking from Jaylen Sinegal.",
    images: ["https://jaylensinegal.com/louisiana-storyteller.jpg"],
  },
};

const pillars = [
  "Brand Strategy",
  "Business & Market Strategy",
  "Sports & Entertainment",
  "Community & Louisiana",
  "Personal Development & Identity",
];

export default function BlogIndexPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24">
        <div className="container-page">
          <p className="text-sm font-semibold tracking-[0.16em] text-cobalt uppercase">
            The Blog
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ideas worth branding.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            Original thinking on family, ambition, character, and building a name with substance.
          </p>

          <div className="mt-10 rounded-xl border border-white/10 bg-steel-900/60 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">
              I don&apos;t just build the thing. I build the system around it.
            </h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-white/65">
              A fight is more than a fight: fighters, gyms, sponsors, fans, and stories. An event
              is more than an event: operations, licensing, sponsorship, content, and audience. A
              student-athlete is more than a recruit: academics, performance data, recruiting,
              financial aid, and identity. A brand is more than a logo: memory, consistency, and
              experience. The opportunity lives in the system around the thing, so that is where I
              look first.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {pillars.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {ARTICLES.map((article) => (
              <a
                key={article.slug}
                href={`/blog/${article.slug}.html`}
                className="group flex flex-col rounded-xl border border-white/10 bg-steel-900/50 p-7 transition hover:border-white/30"
              >
                <p className="text-[11px] font-bold tracking-[0.16em] text-gold uppercase">
                  {article.pillar}
                </p>
                <h2 className="mt-3 flex-1 text-lg font-bold leading-snug text-white">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">
                  {article.dek}
                </p>
                <p className="mt-5 flex items-center justify-between text-sm text-white/40">
                  <span>
                    {article.dateLabel} · {article.read}
                  </span>
                  <span className="inline-flex items-center gap-1 text-cobalt transition group-hover:gap-2">
                    Read
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}