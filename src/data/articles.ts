export type Article = {
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  read: string;
  pillar: string;
  dek: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "escaping-platform-lock-in-hudl-student-athlete-ip",
    title: "Escaping Platform Lock-In: What Hudl's Terms Mean for Student-Athlete IP",
    date: "2026-09-25",
    dateLabel: "September 25, 2026",
    read: "10 min read",
    pillar: "Sports & Entertainment · Media IP",
    dek: "Student-athletes upload highlight film to Hudl every day without reading the terms. Here is what those terms actually allow, where the lock-in lives, and how families can protect their own IP.",
  },
  {
    slug: "how-to-get-started-as-a-college-student-athlete",
    title: "How to Get Started as a College Student-Athlete: A Step-by-Step Scholarship and Recruiting Checklist",
    date: "2026-09-24",
    dateLabel: "September 24, 2026",
    read: "11 min read",
    pillar: "Sports & Entertainment · Student-Athletes · Execution Guide",
    dek: "The ten-step operating system: pick your path, register with the NCAA Eligibility Center, build your academic and athletic file, build your college list, contact coaches, search for money separately, complete FAFSA and TOPS, and track everything.",
  },
  {
    slug: "the-scholarship-is-not-the-strategy",
    title: "The Scholarship Is Not the Strategy: A Louisiana Student-Athlete's Guide to Finding College Opportunities",
    date: "2026-09-24",
    dateLabel: "September 24, 2026",
    read: "25 min read",
    pillar: "Sports & Entertainment · Student-Athletes",
    dek: "Understanding D1, D2, D3 and JUCO opportunities, NCAA eligibility, Louisiana resources like TOPS and FAFSA, and why a complete athletic profile matters more than a highlight reel.",
  },
  {
    slug: "hbcu-college-athletics-louisiana-scholarships",
    title: "HBCU College Athletics in Louisiana: Recruiting, Scholarships, and the SWAC Advantage",
    date: "2026-09-24",
    dateLabel: "September 24, 2026",
    read: "11 min read",
    pillar: "Sports & Entertainment · HBCU Recruiting",
    dek: "Why an HBCU can be a strategy, not a fallback: Grambling, Southern, Dillard, Xavier, and SUNO, the athletic money that exists, the aid stack on top of TOPS and FAFSA, the honest NIL picture, and how recruiting works in the SWAC.",
  },
  {
    slug: "ragin-fc-louisiana-sports-brand",
    title: "Ragin FC Is More Than a Fight Night. It's a Louisiana Sports Brand.",
    date: "2026-09-22",
    dateLabel: "September 22, 2026",
    read: "9 min read",
    pillar: "Sports & Entertainment · Louisiana Sports",
    dek: "A strategic perspective on Ragin Fighting Championship: building fighter stories, gym rivalries, community audiences, sponsor value, and content before, during, and after the event.",
  },
  {
    slug: "event-strategy-brand-experience",
    title: "I Don't Just Plan Events. I Build the System Behind Them.",
    date: "2026-09-07",
    dateLabel: "September 7, 2026",
    read: "19 min read",
    pillar: "Sports & Entertainment · Event Strategy",
    dek: "What building events taught me about brand strategy, operations, sponsorship, marketing, music licensing, copyright, and creating experiences that actually matter.",
  },
  {
    slug: "being-seen-isnt-being-remembered",
    title: "Being Seen Isn't the Same as Being Remembered",
    date: "2026-09-07",
    dateLabel: "September 7, 2026",
    read: "18 min read",
    pillar: "Brand Strategy",
    dek: "How entrepreneurs and established businesses can build the memory structures that make a brand easier to recognize, trust, and choose.",
  },
  {
    slug: "trump-executive-order-college-sports-nil",
    title: "Act 810, SB 389, and Trump's Executive Order: Louisiana High School NIL Compliance",
    date: "2026-09-07",
    dateLabel: "September 7, 2026",
    read: "10 min read",
    pillar: "Sports & Entertainment · NIL",
    dek: "The federal executive order opened a nationwide NIL conversation. Louisiana answered with Act 810 for high school athletes and SB 389 for athlete agents. Here is what families, schools, and athletic departments across Acadiana need to understand.",
  },
  {
    slug: "who-is-jaylen-sinegal-part-1",
    title: "Who Is Jaylen Sinegal? Part One",
    date: "2026-09-05",
    dateLabel: "September 5, 2026",
    read: "13 min read",
    pillar: "Personal Development & Identity",
    dek: "Before the degrees, businesses, and professional titles, Jaylen Sinegal was a Lafayette child learning to adapt through 11 schools, family changes, sports, faith, loss, and new perspectives on leadership and identity.",
  },
  {
    slug: "should-families-brand-kids-early",
    title: "Should Families Brand Their Kids Early? Hell Yes.",
    date: "2026-09-04",
    dateLabel: "September 4, 2026",
    read: "12 min read",
    pillar: "Brand Strategy · Families",
    dek: "NIL isn't just for star athletes. Here's the research on goals, failure, and character, and why every kid can start building a brand before college.",
  },
];

export const FEATURED_TITLES = [
  {
    slug: "trump-executive-order-college-sports-nil",
    title: "Act 810, SB 389, and Trump's Executive Order: Louisiana High School NIL Compliance",
  },
  {
    slug: "should-families-brand-kids-early",
    title: "Should Families Brand Kids Early? Hell Yes.",
  },
  {
    slug: "escaping-platform-lock-in-hudl-student-athlete-ip",
    title: "Escaping Platform Lock-In: What Hudl's Terms Mean for Student-Athlete IP",
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}