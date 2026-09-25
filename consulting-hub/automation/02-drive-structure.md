# AUTOMATION — 02: Google Drive Structure (CLIENTS_2026)

The single source of truth for every client file. One shared master folder,
two path buckets, one subfolder per client. All parties get shared, revocable
links from their client subfolder only - never the master.

---

## Top-level

```
CLIENTS_2026/                         (root - OWNER ONLY, do not share)
├── PATH_A_ATHLETES/
│   ├── _TEMPLATES/                   (master forms, doc, deck - never edit per client)
│   │   ├── Intake_LegalBoundary (form)
│   │   ├── PrepBrandIPAudit (doc)
│   │   └── TheArchitecture_DECK (slides)
│   └── 2026-09-01_SmithFamily/
│       ├── 01_Intake_Signed (copy of form response)
│       ├── 02_BrandIPAudit.pdf
│       ├── 03_ConsultationNotes (doc)
│       └── 04_Deliverables/
├── PATH_B_SCHOOLS/
│   ├── _TEMPLATES/                   (B2B master assets)
│   │   ├── AthleticDeptRiskAudit (form)
│   │   ├── B2B_ExecutiveProposal (doc)
│   │   └── SafeHarbor_CLINIC_DECK (slides)
│   └── 2026-09-15_<SchoolName>/
│       ├── 01_RiskAudit.pdf
│       ├── 02_B2B_Proposal.pdf
│       ├── 03_DiscoveryCall_Notes
│       └── 04_Clinic_Assets/
└── _OPERATIONS/
    ├── 01_LeadLog (sheet: every inquiry, source, status)
    ├── 02_PainPoints_WinningLanguage  (doc: what closes deals, from real calls)
    ├── 03_PricingSheet (you only - do not share)
    └── 04_Yearly_Calendar (clinic availability + key dates)
```

---

## Naming convention (consistency = findability)

`YYYY-MM-DD_<LastName or SchoolName>`

- 01_ files are the signed/legal artifacts (intake, consent).
- 02_ files are the delivered premium assets (audit PDF, proposal PDF).
- 03_ internal working docs.
- 04_ raw or bundled deliverables folder.

## Sharing model

- Master folder: Owner only. Never share.
- Client subfolder: Share with the client (Viewer) and, for schools, the AD
  plus any approved staff (Editor on clinic assets only if needed).
- Every shared link is revocable - no link-forwarding from the master.
- When an engagement closes, either archive the subfolder inside
  `_OPERATIONS/_ARCHIVE` (keep for records) or revoke client access.

## Auto-creation (from automation/build_hub.js)

1. A submitted Path A intake → fires a DriveApp.createFolder for
   `PATH_A_ATHLETES/<today>_<Last>`, copies the audit doc template in, and
   drops the form response PDF into `01_Intake_Signed`.
2. A submitted Path B audit → creates `PATH_B_SCHOOLS/<today>_<School>`,
   copies the proposal template, drops the audit PDF in `01_RiskAudit`.
3. Everything below `_TEMPLATES` is copy-on-create; originals never edited.

## Security notes

- Never store real payment card or bank data in Drive; keep payments in the
  scheduling tool. Drive holds signed consents, audits, and deliverables only.
- Signed intake = proof of the SB 389 boundary. Store it forever (even after
  the engagement ends, archive rather than delete).