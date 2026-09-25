"use client";

import { useEffect } from "react";
import { Send, ShieldCheck } from "lucide-react";

const OBJECTIVES = [
  {
    value: "brand-architecture",
    label: "Executive Brand Architecture (1-on-1 Consultation)",
  },
  {
    value: "clinic-school",
    label: "School / Organization NIL and Music Licensing Clinic",
  },
  {
    value: "audit",
    label: "Media Copyright and Facility Audit",
  },
  {
    value: "flighttime",
    label: "FlightTime Athletics Combine and Training Inquiry",
  },
];

const OBJECTIVE_MAP: Record<string, string> = {
  "#contact-brand": "brand-architecture",
  "#contact-clinic": "clinic-school",
  "#contact-audit": "audit",
  "#contact-flighttime": "flighttime",
};

export function LeadEngine() {
  useEffect(() => {
    const apply = () => {
      const objective = OBJECTIVE_MAP[window.location.hash];
      if (!objective) return;
      const select = document.getElementById("lead-objective") as HTMLSelectElement | null;
      if (select) select.value = objective;
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return (
    <section id="contact" className="border-t border-white/5 bg-white/[0.02] py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-steel-900/70 p-8 sm:p-12">
          <p className="text-sm font-semibold tracking-[0.16em] text-cobalt uppercase">
            Lead engine
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Submit a strategic inquiry.
          </h2>
          <p className="mt-3 text-white/60">
            Tell me what you are building. I reply personally, within one business day, from a
            Louisiana area code.
          </p>

          <form
            className="mt-8 flex flex-col gap-5"
            action="https://formspree.io/f/xeaqkdgv"
            method="POST"
          >
            <input type="hidden" name="_subject" value="New strategic inquiry · jaylensinegal.com" />
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label htmlFor="lead-name" className="mb-2 block text-sm font-semibold text-white/80">
                Name
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
                className="w-full rounded-md border border-white/10 bg-midnight px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cobalt"
              />
            </div>

            <div>
              <label htmlFor="lead-email" className="mb-2 block text-sm font-semibold text-white/80">
                Email address
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-white/10 bg-midnight px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cobalt"
              />
            </div>

            <div>
              <label htmlFor="lead-objective" className="mb-2 block text-sm font-semibold text-white/80">
                Objective
              </label>
              <select
                id="lead-objective"
                name="objective"
                required
                defaultValue=""
                className="w-full rounded-md border border-white/10 bg-midnight px-4 py-3 text-sm text-white outline-none transition focus:border-cobalt"
              >
                <option value="" disabled>
                  Select your objective
                </option>
                {OBJECTIVES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cobalt px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cobalt/25 transition hover:bg-blue-600"
            >
              Submit Strategic Inquiry
              <Send className="h-4 w-4" aria-hidden />
            </button>

            <p className="flex items-center gap-2 text-xs text-white/45">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
              Brand strategy, media education, and IP consulting only. Not a licensed sports
              agent.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}