# agents/planner — Intake Planner Agent

Second stage of the intake agent. Takes the routed intent, pulls the relevant
SOP from `sop_kb/` (derived from `consulting-hub/`), and produces an ordered,
human-reviewable step plan for the engagement. It plans; it does not execute,
book, or commit the business.

This learns from the same general agentic-AI ideas as the router but is an
original implementation over your own operating documents.

## How it works

1. **Intent** — same taxonomy as `agents/router/` (shared prompt contract).
2. **Retrieval** — deterministic selection from `sop_kb/`:
   - `00-boundary.md` is always included (the legal boundary is never optional).
   - the SOP for the routed intent is always included.
   - an optional embedding check flags when a different SOP matches the message
     better than the routed intent (drift canary).
3. **Plan** — a step plan built only from that intent's allowed step catalog,
   ordered top to bottom, each step with an action and a reason. Risky intents
   (`out_of_scope`, `scheduling`, `pricing`) are flagged `needs_human: true`.
   `out_of_scope` plans are only decline + stop, never a service path.

## Intent to SOP map

| Intent | SOP |
|---|---|
| `brand_architecture` | `01-brand-architecture.md` |
| `clinic_school` | `02-clinic-school.md` |
| `media_audit` | `03-media-audit.md` (created below) |
| `flighttime` | `04-flighttime.md` (created below) |
| `scheduling` / `pricing` | `05-scheduling-pricing.md` (created below) |
| `about` | `00-boundary.md` |
| `out_of_scope` | `00-boundary.md` |

## Files

- `sop_kb/` — the retrieval corpus, written from `consulting-hub/` and the
  site's live contact form.
- `test_cases.csv` — labeled cases with expected intent, expected step ids,
  and expected SOP, for the plan-quality eval.
- `planner.py` — the agent + eval (intent accuracy, plan-step coverage,
  SOP selection, needs_human flags).
- `calibration_loop.md` — how to read plan failures and tighten step catalogs.

## Run

```
OPENAI_API_KEY=sk-... python agents/planner/planner.py
```

Writes `eval_output_planner.csv` with every plan for review.