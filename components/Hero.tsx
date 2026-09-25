import { ArrowRight, Grid3x3 } from "lucide-react";

const PROOF = [
  "Official Louisiana Storyteller · Louisiana Economic Development",
  "Member, The National Society of Collegiate Scholars",
  "Chief Brand Officer, FlightTime Athletics LLC",
  "M.S. Entertainment Business Candidate · Full Sail University, 2027",
  "B.S. Music Business · Full Sail University",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-cobalt/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[400px] rounded-full bg-gold/10 blur-[110px]"
      />

      <div className="container-page relative">
        <span className="badge uppercase tracking-[0.18em]">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          Executive Strategist · Louisiana Storyteller · M.S. Entertainment Business Candidate
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          Initiate Your Athletic or Brand Evolution.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
          Architecting modern athlete IP, copyright compliance, and athletic performance
          ecosystems across the Gulf Coast.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#advisory"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-cobalt px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cobalt/25 transition hover:bg-blue-600"
          >
            Explore Advisory and Clinics
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="#ventures"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          >
            <Grid3x3 className="h-4 w-4 text-gold" aria-hidden />
            View Ventures
          </a>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/40 uppercase">
            Recognized by
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {PROOF.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-white/55"
              >
                <span className="h-1 w-1 rounded-full bg-cobalt" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}