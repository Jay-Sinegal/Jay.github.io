import { ArrowUpRight } from "lucide-react";
import { FEATURED_TITLES, articleBySlug } from "@/lib/articles";

export function ThoughtFeed() {
  return (
    <section id="blog" className="py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.16em] text-cobalt uppercase">
              Thought leadership
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Published long-form thinking.
            </h2>
          </div>
          <a
            href="/blog/"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            All articles
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURED_TITLES.map((featured) => {
            const article = articleBySlug(featured.slug);
            if (!article) return null;
            return (
              <a
                key={featured.slug}
                href={`/blog/${featured.slug}.html`}
                className="group flex flex-col rounded-xl border border-white/10 bg-steel-900/60 p-7 transition hover:border-white/30"
              >
                <p className="text-[11px] font-bold tracking-[0.18em] text-gold uppercase">
                  {article.pillar}
                </p>
                <h3 className="mt-4 flex-1 text-lg font-bold leading-snug text-white group-hover:text-white">
                  {featured.title}
                </h3>
                <p className="mt-4 flex items-center justify-between text-sm text-white/45">
                  <span>{article.dateLabel}</span>
                  <span className="inline-flex items-center gap-1 text-cobalt transition group-hover:gap-2">
                    Read
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}