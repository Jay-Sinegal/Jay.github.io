# GO LIVE - Turn On the Gated Intake Flow

What "submissions hit your inbox only" means today, and the 30 minutes that
fixes it. Everything here is manual because these live inside YOUR Google
account. Repo-side wiring is already done and deployed.

Est. time: 30 minutes. Do in this order.

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

## Step 3. Create the booking schedule (10 min)

In Google Calendar: Create (+) > **Appointment schedule**. Make ONE event that
serves both gates (split into two events later if booking volume justifies it):

- **Title:** Brand Strategy Call (Path A / Path B) - Jaylen Sinegal
- **Duration / availability:** 30 minutes, America/Chicago, 15-minute buffer
  between appointments, minimum 24 hours notice.
- **Booking form custom questions:**
  1. Student-Athlete Name & Current Grade
  2. Sport & Primary Position
  3. Target level (NCAA D1, D2, D3, NAIA, JUCO, Undecided)
  4. Hudl / Social Profile Link
  5. Parent / Guardian Mobile Phone
- **Confirmation / disclaimer** (mandatory in the booking confirmation):
  > "Jaylen Sinegal is an Executive Brand Strategist and Media IP Consultant.
  > He is not an attorney and does not provide legal advice. He is not a
  > licensed sports agent under Louisiana SB 389 (Act 895) and does not
  > solicit or negotiate athletic contracts."

Copy the appointment schedule URL (Share link). It looks like
`https://calendar.google.com/calendar/appointments/schedules/...`.

Note: Google Calendar does not auto-send the intake form link. Set a reminder
in your calendar: on each booking, email the correct gate link yourself (Path A
intake form for families, Path B risk-audit form for ADs) and do not start a
call before the gate is met.

## Step 4. Wire the site CTAs (5 min)

Edit `src/data/site.ts` and paste the schedule URL:

```ts
export const RESOURCE_CAPTURE_URL = "https://script.google.com/macros/s/AKfycbwh3ITqEDFVHBJRtQ5zztduM04DncUL6XzaCKNkiMtbwiRswYdG252oC6pz63OsY2TM/exec"; // live

export const SCHEDULING = {
  pathA: "https://calendar.google.com/calendar/appointments/schedules/YOUR_ID",
  pathB: "https://calendar.google.com/calendar/appointments/schedules/YOUR_ID",
};
```

Both cards open the same Brand Strategy Call; your booking questions route each
person to the right gate. While empty, cards keep the default scroll-to-form
behavior and no calendar embeds render - nothing breaks if you ship early.

## Step 5. Deploy (already automated)

```bash
npm run build        # merges Astro output into docs/ (incl. resource PDFs)
python3 scripts/validate_seo.py
git add -A && git commit -m "Wire scheduler + capture" && git push
```

GitHub Actions deploys `docs/` automatically.

## Step 6. Prove the flow (fake client)

End to end before you take money:

1. Submit the Path A intake form. -> expect a `CLIENTS_2026/PATH_A_ATHLETES/
   <date>_<Last>` subfolder and a lead log row.
2. Confirm the gate holds: the booking confirmation collects the intake link;
   do NOT join any Path A call before a signed intake row exists.
3. Submit the Path B audit -> expect the PATH_B_SCHOOLS subfolder + log row,
   and only THEN send the one-page proposal.

## Step 7. Turn on the download email list (10 min)

The resource library already POSTs to `RESOURCE_CAPTURE_URL` when it is set
(and falls straight through to a direct download when it is not). To finish:

1. In the same Apps Script project, Deploy > New deployment > **Web app**.
2. Execute as: **Me**. Who has access: **Anyone**. Deploy.
3. Copy the `.../exec` URL. Paste it into `src/data/site.ts`:
   `export const RESOURCE_CAPTURE_URL = "https://script.google.com/macros/s/.../exec";`
4. Rebuild and push (Step 5).
5. Test: download any PDF on `/resources/` -> a row appears in
   `DOWNLOAD_LEADS > ResourceDownloads`. Until you paste the URL, downloads
   stay direct with no gate, so nothing breaks if you skip this step.

### Use an existing spreadsheet instead (optional)

Rows default to a new `DOWNLOAD_LEADS` sheet created by `createHub`. To land
them in a spreadsheet you already created (e.g. the
`1Goy1jtWqivYsb9E8NvkMa9UxS0z3Oo1Yo8jTSWKoGx8` one you identified), run once in
the Apps Script editor:

```js
setDownloadsSpreadsheetId("1Goy1jtWqivYsb9E8NvkMa9UxS0z3Oo1Yo8jTSWKoGx8");
```

It points the web app at that sheet (a `ResourceDownloads` tab is created on
first POST). Verify after a test download that a row lands there.

## Guardrails to keep

- The subfolder is created automatically; the GATE is your decision. Never take
  a Path A call before the signed intake; never send a Path B proposal before
  the audit.
- `_OPERATIONS/03_PricingSheet` stays private; real numbers belong there only.
- `DOWNLOAD_LEADS` stays private; it is your email list, not a public sheet.
- If a submission route ever needs changing, edit the handler functions in
  `build_hub.js`, then re-run `installTriggers()`.