import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  FileBadge2,
  Scale,
  Sprout,
} from "lucide-react";
import { FLIGHTTIME_URL } from "@/lib/links";

const PATHS = [
  {
    id: "advisory",
    accent: "text-cobalt",
    ring: "hover:border-cobalt/60",
    chip: "bg-cobalt/10 text-cobalt",
    icon: Sprout,
    step: "PATH A",
    title: "Executive Advisory and Brand Architecture",
    audience: "For athletes and families",
    bullets: [
      "Digital profile audits across platforms and recruiting systems",
      "Recruitment highlight and brand story strategy",
      "Platform lock-in analysis, including Hudl terms",
      "Unified, family-controlled personal IP",
      "Positioning that outlasts one season or one platform",
    ],
    cta: { label: "Schedule Brand Strategy Call", href: "#contact-brand" },
  },
  {
    id: "clinics",
    accent: "text-gold",
    ring: "hover:border-gold/60",
    chip: "bg-gold/10 text-gold",
    icon: Scale,
    step: "PATH B",
    title: "Sports Music Licensing and NIL Clinics",
    audience: "For high schools, athletic directors, and clubs",
    bullets: [
      "Louisiana Act 810 and LHSAA bylaw compliance",
      "DMCA safe-harbor workflows for highlight content",
      "Master rights versus sync rights in highlight reels",
      "Athletic department media and copyright risk audits",
    ],
    cta: { label: "Inquire for Clinic or Speaking", href: "#contact-clinic" },
  },
  {
    id: "ventures",
    accent: "text-white",
    ring: "hover:border-white/40",
    chip: "bg-white/10 text-white",
    icon: Building2,
    step: "PATH C",
    title: "Ventures and Incubated Platforms",
    audience: "Case study · FlightTime Athletics LLC",
    bullets: [
      "Youth physiological speed and agility training, ages 8 to 17",
      "Standardized combine testing: 40-yard dash, 5-10-5 agility, vertical jump",
      "AI metric leaderboards for measurable progress",
      'Invitational "Flight Night" walkout showcases',
    ],
    cta: { label: "Visit FlightTime Athletics", href: FLIGHTTIME_URL },
  },
];

export function TrackMatrix() {
  return (
    <section id="paths" className="py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-cobalt uppercase">
            Three paths, one system
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choose the entry point that matches your stage.
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Every engagement is strategy plus evidence, compliance, and execution. No generic
            logos. No cookie-cutter playbooks.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.id}
                id={path.id}
                className={`flex flex-col rounded-xl border border-white/10 bg-steel-900/60 p-7 transition ${path.ring}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] ${path.chip}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {path.step}
                  </span>
                </div>
                <h3 className={`mt-5 text-xl font-bold text-white ${path.accent}`}>
                  {path.title}
                </h3>
                <p className="mt-1 text-sm font-semibold tracking-wide text-white/45 uppercase">
                  {path.audience}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {path.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${path.accent}`} aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <a
                  href={path.cta.href}
                  className={`mt-8 inline-flex items-center gap-2 justify-self-start rounded-md border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 ${
                    path.cta.label.includes("FlightTime") ? "text-gold hover:border-gold/50" : ""
                  }`}
                >
                  {path.cta.label}
                  {path.cta.label.includes("FlightTime") ? (
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  )}
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-white/55">
            <FileBadge2 className="h-4 w-4 text-gold" aria-hidden />
            Consulting, education, and media IP work only. Jaylen Sinegal is not a licensed sports
            agent.
          </p>
          <a href="#contact" className="shrink-0 text-sm font-semibold text-cobalt hover:text-blue-400">
            Start the conversation
          </a>
        </div>
      </div>
    </section>
  );
}