# The Executive Consulting Hub

Private operational kit for running Path A (Executive Advisory and Brand
Architecture) and Path B (Sports IP and NIL Clinics) inside Google Workspace.
This folder is NOT deployed to the public site. It exists so you can build,
copy, and audit the actual Google Forms, Docs, Slides, and automation flows
used to run the business.

## What is in here

```
consulting-hub/
├── README.md                       This file
├── path-a/
│   ├── 01-intake-legal-boundary.md # Google Form: Intake and Legal Boundary Form
│   ├── 02-prep-brand-ip-audit.md   # Google Doc: Prep Brand IP Audit template
│   └── 03-the-architecture-deck.md # Google Slides: "The Architecture" deck
├── path-b/
│   ├── 01-athletic-dept-risk-audit.md # Google Form: AD Risk Audit
│   ├── 02-b2b-executive-proposal.md   # Google Doc/PDF: B2B Executive Proposal
│   └── 03-safe-harbor-clinic-deck.md  # Google Slides: "Safe-Harbor" Clinic deck
└── automation/
    ├── 01-scheduling.md            # Calendly/Acuity event types and rules
    ├── 02-drive-structure.md       # CLIENTS_2026 folder architecture
    └── build_hub.js                # Google Apps Script: one-click builder
```

## Live tech stack (as-built, keep this accurate)

- **Site**: Astro 7 static build → GitHub Pages (`docs/`).
- **Consultation form**: Formspree (`src/components/LeadEngine.astro` → `https://formspree.io/f/xeaqkdgv`), owned by `jaylensinegal@yahoo.com`. No persistent CRM.
- **Resource capture**: Google Apps Script web app (`automation/build_hub.js` -
  `doPost(e)`), wired in `src/layouts/Base.astro` via `RESOURCE_CAPTURE_URL` to
  `https://script.google.com/macros/s/AKfycbwh3ITqEDFVHBJRtQ5zztduM04DncUL6XzaCKNkiMtbwiRswYdG252oC6pz63OsY2TM/exec`.
  LIVE. Every PDF download now collects an email and appends a row to the
  configured sheet (`ResourceDownloads` tab; target set with
  `setDownloadsSpreadsheetId(...)`).
- **Invoicing / payments**: Square Invoices (deposits, milestones, retainers).
- **Analytics**: Google Analytics only.
- **Inquiries / gated one-sheet**: `mailto:` handoffs superseded by the capture
  gate once enabled; form remains the consultation intake.
- **CRM**: NONE. Future pipeline tooling (Gap 2 build-out) starts from a clean
  slate - do not assume HubSpot or any vendor.

## Roles

- **Path A**: 1-on-1 counseling for athletes and families. Education and media
  IP architecture only. NOT athlete agency. Never negotiates athletic or
  endorsement contracts. Louisiana SB 389 boundary form is the gate.
- **Path B**: B2B clinics with schools and athletic departments. Compliance
  education for Act 810 and SB 389. Music licensing education (master vs sync).

## Build order (do not skip)

1. Run `build_hub.js` once in Google Apps Script (or create the files manually
   from the content markdown). It creates folders, forms, docs, and decks.
2. Wire the scheduling automation (see `automation/01-scheduling.md`).
3. Test the entire flow with a fake client end to end before taking money.

## Invariants (never break these)

- No client communication ever implies athlete agency. Every form, deck, and
  proposal carries the SB 389 boundary statement.
- Never negotiate contracts. Educate on media IP, brand architecture, licensing.
- Scheduling rule: no Zoom call on Path A until the Intake and Legal Boundary
  form is signed. Enforce it.
- Every client file lives in its own Drive subfolder under CLIENTS_2026.
- Louisiana disclaimer is required in all materials: "Education, not
  representation. Not a licensed sports agent."