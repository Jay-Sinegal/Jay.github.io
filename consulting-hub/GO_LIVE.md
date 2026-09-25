# GO LIVE - Turn On the Gated Intake Flow

What "submissions hit your inbox only" means today, and the 20 minutes that
fixes it. Everything here is manual because these live inside YOUR Google and
Calendly/Acuity accounts. Repo-side wiring is already done and deployed.

Est. time: 20-30 minutes. Do in this order.

---

## Step 1. Create the Google Workspace hub (5 min)

1. Login to the Google account that owns your business materials.
2. Drive > New > More > Google Apps Script. Delete the default `code.gs`.
3. Paste the ENTIRE contents of `consulting-hub/automation/build_hub.js`.
4. Run `createHub`. Authorize Drive, Forms, Sheets, Apps Script triggers, Mail.
   It creates: `CLIENTS_2026/` tree, the Path A Intake form, the Path B Risk
   Audit form, and the `HUB_LEADS_LOG` spreadsheet. The log prints your
   form links - copy them.
5. Run `installTriggers`. (Re-authorize.) This wires the on-submit automation:
   every intake/audit submission now CREATES a client subfolder and LOGS a row.
   This is the fix for "submissions are just emails".
6. Optional: run `setNotifyEmail("you@example.com")` to get a one-line email
   per new lead.

## Step 2. Polish the forms (10 min)

Open each form in the Forms editor and make it yours:

- Path A intake  - your voice from `path-a/01-intake-legal-boundary.md`,
  set the confirmation message, link responses to a Sheet
  `PathA_Intake_<MONTH-YEAR>`.
- Path B audit   - your voice from `path-b/01-athletic-dept-risk-audit.md`,
  confirmation message, link to `PathB_RiskAudits_<MONTH-YEAR>`.
- Do NOT touch the Legal Boundary wording (Section 5 / set text). It is your
  SB 389 insulation.

## Step 3. Create the two scheduler events (10 min)

In Calendly (or Acuity), make EXACTLY two events per
`automation/01-scheduling.md`:

1. **1-on-1 Brand Architecture Consultation (Path A)** - paid, 60 min, payment
   captured at booking, auto-emails the PAGE A INTAKE FORM link on booking.
   Booking question: "Ready to complete the Intake and Legal Boundary form
   before the call?"
2. **B2B Clinic Discovery Call (Path B)** - free, 20 min, auto-emails the RISK
   AUDIT link on booking.

Copy the two booking page URLs.

## Step 4. Wire the site CTAs (5 min)

Edit `src/data/site.ts` and paste the two URLs:

```ts
export const SCHEDULING = {
  pathA: "https://calendly.com/you/path-a-brand-architecture",
  pathB: "https://calendly.com/you/path-b-discovery-call",
};
```

Path A card buttons now open your paid booking page and Path B cards open your
discovery call in a new tab. Until these are filled in, cards keep the default
scroll-to-form behavior, so nothing breaks if you ship before the URLs exist.

## Step 5. Deploy (already automated)

```bash
npm run build        # merges Astro output into docs/
python3 scripts/validate_seo.py
git add -A && git commit -m "Wire scheduler CTAs" && git push
```

GitHub Actions deploys `docs/` automatically.

## Step 6. Prove the flow (fake client)

End to end before you take money:

1. Submit the Path A intake form. -> expect a `CLIENTS_2026/PATH_A_ATHLETES/
   <date>_<Last>` subfolder and a lead log row.
2. Confirm the gate holds: the booking page collects the form link; do NOT
   join any Path A call before a signed intake row exists.
3. Submit the Path B audit -> expect the PATH_B_SCHOOLS subfolder + log row,
   and only THEN send the one-page proposal.

## Guardrails to keep

- The subfolder is created automatically; the GATE is your decision. Never take
  a Path A call before the signed intake; never send a Path B proposal before
  the audit.
- `_OPERATIONS/03_PricingSheet` stays private; real numbers belong there only.
- If a submission route ever needs changing, edit the handler functions in
  `build_hub.js`, then re-run `installTriggers()`.