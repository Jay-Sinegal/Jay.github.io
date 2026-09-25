# agents/v1-router — Baseline Action Autonomy Agent

Your brand's V1 customer-support front desk, built on the exact pattern from the
LinkedIn Learning course *Agentic AI: Build Your First Agentic AI System*.

The course example comes with e-commerce SOPs (returns, billing, warranties...).
This repo replaces them with **your** service lines, so every artifact mirrors the
course but is owned by you.

## What this is

A **router agent with Action Autonomy (V1)**: given an incoming message, classify
which department it belongs to and why. It does NOT act, book, or escalate yet.
That discipline is the point — narrow scope, validate, THEN expand (V2 planner).

It maps to your consulting hub (`consulting-hub/`) departments:

| Department | Meaning | Maps to |
|---|---|---|
| `brand_architecture` | 1-on-1 athlete/family brand + media IP education (Path A) | `path-a/` |
| `clinic_school` | NIL + music licensing clinic for schools/orgs (Path B) | `path-b/03-safe-harbor-clinic-deck.md` |
| `media_audit` | Media copyright / facility audit | `path-b/01-athletic-dept-risk-audit.md` |
| `flighttime` | FlightTime combine/training / metrics questions | site FlightTime section |
| `scheduling` | Bookings, reschedules, call logistics | `automation/01-scheduling.md` |
| `pricing` | Consultation cost / packages / payment | `_OPERATIONS/03_PricingSheet` |
| `about` | "Who is Jaylen"? credentials, boundary questions | hero + about sections |
| `out_of_scope` | Agent-seeking, contract negotiation, spam, non-business | DO NOT touch |

Boundary rule inherited from the hub: **education, not representation. Not a
licensed sports agent. Never negotiate contracts.** The router routes, it never
promises service.

## Files

- `test_cases.csv` — your labeled dataset (ground truth department + category).
  Build from real inquiries; add more as calls happen.
- `router_baseline.py` — V1 router + routing-accuracy eval + optional Arize
  Phoenix tracing.
- `CC_calibration.md` — the Continuous Calibration loop: read failures, fix,
  re-run, compare.

## Run it

1. Open a Python environment (Colab is easiest — the course uses it).
2. Set `OPENAI_API_KEY`.
3. Run `router_baseline.py`. It prints a per-case table and routing accuracy.

Optional: keep the `.csv` in Drive/Colab and edit it as real leads arrive, so the
eval dataset grows with your business.