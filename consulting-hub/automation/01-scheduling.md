# AUTOMATION — 01: Scheduling (Google Calendar Appointment Schedules)

One combined event serves both gates: a single 30-minute **Brand Strategy Call
(Path A / Path B) - Jaylen Sinegal**. Every automation rule below must be
enforced before you ever take money.

---

## The appointment schedule

- **Title:** Brand Strategy Call (Path A / Path B) — Jaylen Sinegal
- **Duration / availability:** 30 minutes, America/Chicago, 15-minute buffer
  between appointments, minimum 24 hours notice.
- **Booking form custom questions (capture on the booking page):**
  1. Student-Athlete Name & Current Grade
  2. Sport & Primary Position
  3. Target level (NCAA D1, D2, D3, NAIA, JUCO, Undecided)
  4. Hudl / Social Profile Link
  5. Parent / Guardian Mobile Phone
- **Confirmation / disclaimer (mandatory):**
  > "Jaylen Sinegal is an Executive Brand Strategist and Media IP Consultant.
  > He is not an attorney and does not provide legal advice. He is not a
  > licensed sports agent under Louisiana SB 389 (Act 895) and does not
  > solicit or negotiate athletic contracts."

## The two gates (enforced manually per booking)

Google Calendar does not auto-email custom form links, so on every booking:

- **Path A (athletes / families):** email the Intake and Legal Boundary Form
  link. **You do not join the call until the form is signed.** Signed form row
  -> a Drive subfolder is auto-created (automation/02-drive-structure.md).
  Nothing signed, one hour before the call -> reminder "Call requires the
  signed form — link inside." No exception; this is your SB 389 insulation.
- **Path B (schools / ADs):** email the Athletic Department Risk Audit form
  link. The call becomes a B2B Executive Proposal only AFTER the audit is
  submitted (path-b/01-athletic-dept-risk-audit.md). On audit submission you
  receive the prep note before the call.

The booking questions above also tell you which gate each booking belongs to.

---

## Waitlist / no-show policy (write into every procedural doc)

- Path A no-show: offer one reschedule within 30 days; second no-show — cancel
  the slot (state this in the confirmation email up front).
- Path B no-show: no penalty; reschedule.
- Late >10 minutes for Path B: prefer reschedule.

## Which tool

**Google Calendar Appointment Schedules** — free, lives in the account that
already owns the hub, two-way sync with your real calendar, and the embed URL
pastes straight into the site CTAs (`/#contact-brand`, `/#contact-clinic`) and
into `SCHEDULING.pathA / pathB` in `src/data/site.ts`. If you later want
payment captured at booking or automated intake-form emails, add an external
tool (Calendly Payments / Acuity) in front of the same schedule and keep the
gates identical.