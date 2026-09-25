# Run the agents on Google Gemini

Both agents (`agents/router/` and `agents/planner/`) now run against OpenAI or
Google Gemini with no code changes - Gemini is reached through its
OpenAI-compatible endpoint.

## What you need

1. A Google account.
2. A Gemini API key from Google AI Studio (free tier available):
   https://aistudio.google.com/apikey  ->  "Create API key".
   Copy the key value. Keep it secret; never commit it.
3. Python 3.9+ and the `openai` SDK. Gemini's OpenAI-compatible endpoint is
   called through the same `openai` library, so that is the only dependency:
   ```
   pip install -U openai pandas
   ```

## Run the router

```
export LLM_PROVIDER=gemini
export GEMINI_API_KEY=your_key_here
python agents/router/router_baseline.py
```

## Run the planner

```
export LLM_PROVIDER=gemini
export GEMINI_API_KEY=your_key_here
python agents/planner/planner.py
```

## Choosing the model

Default Gemini model is `gemini-3.7-flash` (a fast, capable text model).
To change it, set your own model ID from AI Studio's model dropdown:

```
export MODEL=gemini-3.7-flash        # or the ID you see in AI Studio
```

About "Gemini Spark": there is no model published as "Gemini Spark" in the
Gemini API. The current text models are named like `gemini-3.x-flash` /
`gemini-3.x-pro`. If "Spark" is a display name you see in AI Studio, use the
exact model ID from that dropdown as `MODEL`. Always pick a MODEL from your
AI Studio console so the name is valid.

## Switching back to OpenAI

```
unset LLM_PROVIDER GEMINI_API_KEY
export OPENAI_API_KEY=sk-...
python agents/planner/planner.py
```

## How the code decides

`agents/_client.py` reads `LLM_PROVIDER` (`openai` default, `gemini` for
Google). It picks the API key and base URL, and sets the default model. Both
agents call it through `get_client()` and `default_model()`.

## Provider behaviors to expect

- Gemini's OpenAI-compatible endpoint honors
  `response_format={"type": "json_object"}` for these models. Both agents also
  have a JSON-extraction fallback if a response is not strictly JSON, so scores
  stay readable.
- Evaluate the same `test_cases.csv` on both providers and compare
  `eval_output*.csv`. Routing accuracy may differ model to model; that is the
  calibration loop's job (see each agent's `calibration_loop.md`).
- Cheap round-trips first: run the planner eval, read `eval_output_planner.csv`,
  then decide whether the step catalog or prompts need tightening per provider.