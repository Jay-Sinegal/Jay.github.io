# agents/router — Calibration Loop

The baseline eval reports where routing is wrong. This loop converts failures
into deliberate improvements. Run it every time you add real leads to
`test_cases.csv`.

## Loop

1. Run the eval. Open `eval_output.csv`.
2. For each failure row, classify WHY:
   - Bad label: your ground truth disagrees with the message. Fix the CSV.
   - Ambiguity: the message is genuinely two intents ("how much and can I
     book"). Pick one ground truth, put the tie-breaker in the prompt.
   - Instruction miss: model ignored an explicit rule (e.g., "negotiate a
     deal" routed to a service lane). Strengthen the boundary at the top of
     the prompt and add seed examples.
3. Batch the fixes into one prompt/set change. Do not tweak per-case.
4. Re-run, compare accuracy. A change that fixes 2 cases and breaks 4 is a
   regression - revert it.

## Expected error patterns

| Pattern | Fix |
|---|---|
| Agent-seeking routed to a service lane | Move boundary rule to first line; add seed cases |
| Pricing vs scheduling confused | Add a disambiguation line ("cost = pricing, booking intent = scheduling") |
| Clinic vs audit confused | Tighten definitions with concrete examples |
| Under-sampled intent | Add cases until every intent has >= 3 rows |
| Model returns a name not in taxonomy | It echoes only what the prompt lists; check spelling |

## Approval gate before adding autonomy

Promote to the planner agent only when:
1. Routing accuracy on a growing test set is stable (>= ~90%, no regression).
2. Every failure is explained by one of the rows above.
3. A human double-checks the risky intents (`out_of_scope`, `scheduling`,
   `pricing`) before relying on the router.

Until then the router routes and stops. That is deliberate: scope is expanded
after it is proven, one stage at a time.