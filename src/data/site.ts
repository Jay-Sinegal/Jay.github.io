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

// Resource downloads: where the site POSTs an email capture on each PDF
// download (steps in consulting-hub/GO_LIVE.md Step 7). Empty string keeps
// downloads direct (no gate) until the Google Apps Script web app is live.
export const RESOURCE_CAPTURE_URL = "";

// Paste your real Google Calendar appointment-schedule links here after
// creating them (steps in consulting-hub/GO_LIVE.md). Format:
//   https://calendar.google.com/calendar/appointments/schedules/<SCHEDULE_ID>
// Empty values keep the default behavior: CTAs scroll to the lead form
// instead of opening a scheduler, and no calendar embeds render.
export const SCHEDULING = {
  pathA: "https://calendar.google.com/appointments/schedules/AcZssZ0UTaAwsF8Z1DyxAQ0CfkU-4ehkSu9I6pH6pL4dIkRMLFKunw17Qn4jMuJ_JiTszLBM0F8k-mWm", // Athlete Advisory call (paid)
  pathB: "", // Institutional Education discovery call (free)
};