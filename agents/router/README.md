# agents/router — Lead-Intent Router (Baseline)

First step of the intake agent for Jaylen Sinegal's consulting practice. It
takes an inbound message and classifies it into one of eight intents, plus a
short reason, so human follow-up starts in the right place.

Design intent: narrow scope, one decision, inspectable output. It routes; it
does not act or promise anything. The planner agent (`agents/planner/`) is the
next stage that builds a step plan from the intent.

## Intents (taxonomy)

| Intent | Meaning | Maps to |
|---|---|---|
| `brand_architecture` | 1-on-1 athlete/family brand + media IP education | Path A (site: Executive Brand Architecture) |
| `clinic_school` | NIL + music licensing clinic for schools/orgs | Path B (site: Sports IP and NIL Clinics) |
| `media_audit` | Media copyright / facility media-use review | Path B audit work |
| `flighttime` | FlightTime combine/training / metrics questions | Ventures |
| `scheduling` | Booking, rescheduling, call logistics | Calendly/Acuity |
| `pricing` | Consultation cost / packages / payment | Pricing sheet |
| `about` | Who Jaylen is, credentials, agent-boundary question | About / credentials |
| `out_of_scope` | Agent-seeking, contract negotiation, agency-adjacent, spam | Decline, never serve |

Boundary rule baked into routing: agent-seeking and contract-negotiation
requests must land in `out_of_scope`, never in a service line. Education, not
representation.

## Files

- `test_cases.csv` — labeled ground-truth set built from real inquiry types
  (parent LHSAA questions, AD clinic asks, DMCA strikes, combine requests,
  spam, boundary questions). Add real leads as they arrive.
- `router_baseline.py` — classifier call, routing-accuracy eval, per-intent
  accuracy, failure output, optional OpenTelemetry tracing.
- `calibration_loop.md` — how to read failures and tighten the system.

## Run

```
OPENAI_API_KEY=sk-... python agents/router/router_baseline.py
```

Output: routing accuracy, per-intent accuracy, failure rows, and
`eval_output.csv` with every prediction for review.