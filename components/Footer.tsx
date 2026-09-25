import { ArrowUpRight, Linkedin } from "lucide-react";
import { SITE } from "@/lib/links";

const SOCIAL_ICONS = [
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/jaylen-sinegal" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <a href="/" className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-[0.14em] text-white">
                {SITE.name}
              </span>
              <span className="text-[10px] font-medium tracking-[0.22em] text-gold uppercase">
                Executive Brand Strategist
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Brand strategy, talent representation alternatives, media IP, and performance
              ecosystems across the Gulf Coast.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              Legal safeguards
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Jaylen Sinegal provides brand strategy, media education, and IP consulting. He is
              not a licensed sports agent and does not solicit, negotiate, or procure athletic
              contracts or employment.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              Connect
            </h3>
            <div className="mt-4 flex gap-3">
              {SOCIAL_ICONS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={`${social.label} profile`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </a>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-white/35">
              Lafayette · Youngsville · Louisiana
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-xs text-white/40">
            <ArrowUpRight className="h-3.5 w-3.5 text-gold" aria-hidden />
            Governance · Compliance · Brand evidence
          </p>
        </div>
      </div>
    </footer>
  );
}