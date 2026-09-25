# CC — Continuous Calibration, Continuous Development (the loop)

The eval you just ran is the **Calibration** (CC) side of the course's CCCD loop.
Development (CD) is what you wrote: department taxonomy, system prompt, test set,
routing-accuracy metric. CC is what closes the loop after a real run.

## The loop, made concrete for YOUR router

```
CD (develop)                         CC (calibrate)
--------------                       ----------------
1. Define departments                4. Run eval_output.csv
2. Write the system prompt          5. Read the failure rows + reasoning
3. Curate test_cases.csv            6. Group failures into error patterns
                                     7. Fix the prompt or taxonomy
                                     8. Re-run -> compare accuracy
```

Repeat until accuracy plateaus and every failure is *understood* (you can explain
why it failed, not just that it did).

## How to read failures (step 5)

Open `eval_output.csv` or the "Failures (candidates for CC)" block. For each row
ask:

- **Was the ground truth right?** The message "Free iPhone claim your prize" is
  scanned as spam only if you WROTE it as spam. Your dataset must represent real
  inbound. If the label is wrong, fix the CSV, not the prompt.
- **Was it an ambiguity, not an error?** "How much is a consultation" could be
  `pricing` or `scheduling`. Pick ONE ground truth per column of ambiguity and
  put the tie-breaker in the system prompt (e.g. "cost questions are pricing;
  booking intent is scheduling").
- **Did the model ignore an explicit instruction?** E.g. "negotiate a deal" went
  to `brand_architecture`. That means the boundary rule needs strengthening at
  the TOP of the prompt, and you add 2-3 more `out_of_scope` seed examples.

## Error patterns to expect (and their fixes)

| Pattern | Fix |
|---|---|
| Agent-seeking -> service line | Move boundary rule to first line; add seed cases |
| Cost vs booking confused | Add a one-line disambiguation rule in the prompt |
| Clinic vs audit confused | Tighten category definitions with concrete examples |
| Rare department under-sampled | Add test cases until every department has >= 3 rows |
| Model keeps returning a bad dept name | Check your taxonomy spelling; model returns what prompt lists |

## When to increase autonomy (with guard)

V2 (planning autonomy) is only justified when:

1. Routing accuracy on a GROWING test set is steady (>= ~90% and not regressing
   across re-runs).
2. Every failure is understood and explained above.
3. A human logs/double-checks the risky classes (`out_of_scope`, `scheduling`,
   `pricing`) before you trust the router.

Until those hold, the router routes and stops. That is by design, not a limit.
Agency is earned per the loop, never granted on day one.