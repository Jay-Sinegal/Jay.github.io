const CREDENTIALS = [
  "Official Louisiana Storyteller · Louisiana Economic Development",
  "Member, The National Society of Collegiate Scholars (NSCS)",
  "Chief Brand Officer, FlightTime Athletics LLC",
  "M.S. Entertainment Business Candidate · Full Sail University, 2027",
  "B.S. Music Business · Full Sail University",
];

export function About() {
  return (
    <section id="about" className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-cobalt uppercase">
            About
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Louisiana is not a market to me. It is a proving ground.
          </h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-white/75">
            I am Jaylen Sinegal, an executive brand strategist and media IP consultant from
            Lafayette, Louisiana. I have worked in local publishing, built live entertainment
            events, run youth performance programming, and studied music business and
            entertainment law. I look at the system around the thing: the athlete, the school,
            the event, the sponsor, the story, and the rights attached to all of it.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            My work helps athletes, families, schools, and businesses protect their intellectual
            property, stay ahead of compliance, and build brands that survive on their own terms.
            If you need an agent to negotiate contracts or secure employment, that is not my lane.
            If you want to understand your rights, your content, and your brand, that is exactly
            where I work.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {CREDENTIALS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm font-medium text-white/70"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}