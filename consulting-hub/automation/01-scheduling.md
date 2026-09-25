# AUTOMATION — 01: Scheduling (Calendly or Acuity)

Two event types only. One paid (Path A), one free (Path B). Every automation
rule below must be enforced before you ever take money.

---

## Event Type 1 — Path A (paid)

- **Name:** 1-on-1 Brand Architecture Consultation (Path A)
- **Price:** [your rate] collected at booking
- **Length:** 60 minutes
- **Location:** Zoom (preferred) or in-person (with address buffer)
- **Buffer:** 15 minutes before and after, no overlap
- **Scheduling window:** bookable up to 2 hours before start; max 1 booking/day
  while solo; raise later

### Booking-time automation (MANDATORY, Path A gate)

Rule: **You do not join the Zoom call until the Intake and Legal Boundary Form
is signed.**

1. Payment captured at booking (Stripe/Square via Calendly Payments /
   Acuity payments).
2. On confirmation, Calendly/Acuity automatically emails the client the Path A
   Intake and Legal Boundary Form link.
3. Form response lands in `PathA_Intake_<MONTH-YEAR>` sheet (Append only).
4. Check box at 1 hour before the call (manual or automated):
   - Signed: call proceeds.
   - NOT signed: auto-email reminder "Call requires the signed form — link
     inside." Call does not start until signed. Never make an exception; this
     is your SB 389 insulation.
5. On signed form, a Drive subfolder is auto-created (see
   automation/02-drive-structure.md).

### Custom questions at booking (capture checkout value)

- Athlete name
- Sport and graduation year (for deck copy naming)
- "Ready to complete the Intake and Legal Boundary form before the call?"

## Event Type 2 — Path B (free)

- **Name:** B2B Clinic Discovery Call (Path B)
- **Price:** Free
- **Length:** 20 minutes
- **Location:** Zoom or phone
- **Scheduling window:** bookable up to 24 hours ahead; max 3/day while solo

### Booking-time automation (Path B gate)

1. On booking, AD receives the Athletic Department Risk Audit form link.
2. Discovery call only becomes a B2B Executive Proposal after the audit is
   submitted (see path-b/01-athletic-dept-risk-audit.md).
3. On audit submission, you receive the "Your school has N gap(s)" prep note
   before the call.

---

## Waitlist / no-show policy (write into every procedural doc)

- Path A no-show after payment: offer one reschedule within 30 days; second
  no-show forfeits the fee (state in the confirmation email up front).
- Path B no-show: no penalty; reschedule.
- Late >10 minutes for Path B: prefer reschedule.

## Which tool

**Calendly** if you want Payments built in (Stripe/Square) and Google
Calendar two-way sync out of the box. **Acuity** if you want more custom
intake questions and deeper form logic. Either enforces the same two gates;
pick the one whose confirmation-email flow is simplest for you. Both paste
directly into the site's CTAs (`/#contact-brand`, `/#contact-clinic`,
`/#contact-flighttime` on jaylensinegal.com).