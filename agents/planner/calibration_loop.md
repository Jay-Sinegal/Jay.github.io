# agents/planner — Calibration Loop

`planner.py` reports three signals: intent accuracy, SOP selection hits, and
plan-step coverage. This doc converts plan failures into deliberate fixes.

## Signals and what they mean

| Signal | Tells you |
|---|---|
| Intent accuracy low | The router stage is misreading; fix the frontier routing contract first |
| SOP selection miss | The intent-to-SOP map is wrong, or the classifier and the map disagree |
| Coverage < 100% | The planner omitted expected steps from the catalog |
| `needs_human` missing on risky intents | Prompt rule for support/triage intents regressed |

## Reading a coverage gap

Open `eval_output_planner.csv`, look at the `steps_missed` column, then ask:

- Did the model drop the GATE step (intake form / risk audit)? Gates protect the
  practice. If a gate step is missing, the catalog rule or the prompt ordering
  instruction regressed. Fix the system prompt, then add an eval case that
  specifically demands the gate.
- Did it drop a boundary step? Any plan that omits boundary/education framing
  is a safety problem, not a style problem. Treat it as highest priority.
- Was the expected step ambiguous in the catalog? Tighten the catalog names so
  one concept maps to one step id.
- Is the model inventing steps? `unexpected_steps` column shows out-of-catalog
  ids. Add a prompt rule: never emit a step id not in the allowed list, and
  re-check against the ground truth - sometimes YOUR expected set was wrong.

## Boundary failure = stop, not "calibrate"

If any `out_of_scope` inquiry ever produced a service-path step (agent-related,
negotiation, account management), the eval must fail the gate hard: the catalog
for `out_of_scope` contains only decline + close, and the plan prompt forbids
service paths. Fix the prompt before any further runs. This is a legal
boundary, not a score.

## Promotion gate (add autonomy later, one stage at a time)

Before the planner is allowed to DO anything (call Calendly, send forms, create
Drive folders) instead of just plan:

1. Intent accuracy stable on a growing set, no regressions.
2. Coverage at 100% on the eval set for 3 consecutive runs.
3. `needs_human` true on 100% of risky intents with no service-path leakage.
4. A human has reviewed every `eval_output_planner.csv` in the last run.

Until then the agent plans and stops. Scope is earned, not declared.