export const SITE = {
  name: "Jaylen Sinegal",
  position: "Executive Brand Strategist / Media IP Consultant",
  homeUrl: "https://jaylensinegal.com/",
};

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Athlete Advisory", href: "/#advisory" },
  { label: "Institutional Ed.", href: "/#clinics" },
  { label: "Speaking & Strategy", href: "/#speaking" },
  { label: "Performance", href: "/#ventures" },
  { label: "Resources", href: "/resources/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/#contact" },
];

export const FLIGHTTIME_URL = "https://www.flighttimeathleticsllc.com";

// Pricing rule: FlightTime membership pricing is unpublished and unverified.
// Never publish a FlightTime price on jaylensinegal.com. Point price questions
// to the FlightTime site directly (see agents/planner/sop_kb/04-flighttime.md).

// Public business email used for institutional inquiries and gated one-sheet
// requests (until the capture web app is live).
export const CONTACT_EMAIL = "jjsinegal@alumni.fullsail.edu";

// Resource downloads: where the site POSTs an email capture on each PDF
// download (steps in consulting-hub/GO_LIVE.md Step 7). Deployed web app URL;
// when set, every PDF download requires an email and rows land in the
// DOWNLOAD_LEADS / configured spreadsheet (ResourceDownloads tab).
export const RESOURCE_CAPTURE_URL = "https://script.google.com/macros/s/AKfycbwh3ITqEDFVHBJRtQ5zztduM04DncUL6XzaCKNkiMtbwiRswYdG252oC6pz63OsY2TM/exec";

// Paste your real Google Calendar appointment-schedule links here after
// creating them (steps in consulting-hub/GO_LIVE.md). Format:
//   https://calendar.google.com/calendar/appointments/schedules/<SCHEDULE_ID>
// Empty values keep the default behavior: CTAs scroll to the lead form
// instead of opening a scheduler, and no calendar embeds render. A mailto:
// value renders as an email-inquiry card instead of a calendar embed.
export const SCHEDULING = {
  pathA: "https://calendar.google.com/appointments/schedules/AcZssZ0UTaAwsF8Z1DyxAQ0CfkU-4ehkSu9I6pH6pL4dIkRMLFKunw17Qn4jMuJ_JiTszLBM0F8k-mWm", // Athlete Advisory call (paid)
  pathB: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Institutional Education Discovery Call")}&body=${encodeURIComponent(
    "Hello Jaylen,\n\nI would like to discuss a clinic or keynote for our school / organization.\n\nYour name:\nSchool / Organization:\nYour role:\nPreferred month:",
  )}`, // Institutional Education discovery call (via email)
};