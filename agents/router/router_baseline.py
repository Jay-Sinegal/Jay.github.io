"""
V1 Action Autonomy Router for Jaylen Sinegal - The Executive Consulting Hub.

Given an input message, predict which department the inquiry belongs to and
why. Mirrors the course's "action autonomy" baseline, but with YOUR taxonomy.

Run:
    OPENAI_API_KEY=sk-... python router_baseline.py

Optional observability: pip install openinference-instrumentation-openai
arize-phoenix-otel and set USE_PHOENIX=1.
"""

import json
import os
import re

import pandas as pd
from openai import OpenAI

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_SET = os.path.join(BASE_DIR, "test_cases.csv")
MODEL = os.getenv("MODEL", "gpt-4o-mini")
USE_PHOENIX = os.getenv("USE_PHOENIX", "0") == "1"

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DEPARTMENTS = [
    "brand_architecture",
    "clinic_school",
    "media_audit",
    "flighttime",
    "scheduling",
    "pricing",
    "about",
    "out_of_scope",
]

SYSTEM_PROMPT = f"""You are the front door intake router for Jaylen Sinegal, an executive
brand strategist, media IP consultant, and official Louisiana Storyteller. He provides
EDUCATION in brand architecture and media IP. He is NOT a licensed sports agent and does
NOT negotiate athletic or endorsement contracts.

Classify the incoming customer message into exactly one department from this taxonomy:
- brand_architecture: 1-on-1 athlete/family brand building and media IP education (Path A)
- clinic_school: NIL and music licensing clinics for schools, districts, or youth orgs (Path B)
- media_audit: media copyright / facility media-use audits
- flighttime: FlightTime combine/training/metrics or membership questions
- scheduling: booking, rescheduling, or meeting logistics
- pricing: consultation cost, packages, or payment questions
- about: who Jaylen is, credentials, or the agent boundary question
- out_of_scope: athlete agent-seeking, contract negotiation, agency-adjacent services,
  spam, or anything outside his service lines

Rules:
- NEVER misroute an athlete agency or contract negotiation request to a service line.
  It goes to out_of_scope.
- The legal boundary is fixed: education, not representation.

Respond ONLY with JSON of the form:
{{"department": "<one of the above>", "category": "<short 2-4 word subcategory>",
"reasoning": "<one sentence>"}}"""


def classify(message: str) -> dict:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0.0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
    )
    text = resp.choices[0].message.content
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        data = json.loads(match.group(0)) if match else {"department": None, "category": "", "reasoning": text}
    return {
        "department": data.get("department"),
        "category": data.get("category", ""),
        "reasoning": data.get("reasoning", ""),
    }


def run_eval():
    df = pd.read_csv(TEST_SET)
    rows = []
    for row in df.itertuples(index=False):
        pred = classify(row.message)
        rows.append(
            {
                "test_id": row.test_id,
                "expected": row.expected_department,
                "predicted": pred["department"],
                "category": pred["category"],
                "reasoning": pred["reasoning"],
            }
        )
    out = pd.DataFrame(rows)
    out["correct"] = out["expected"] == out["predicted"]

    accuracy = out["correct"].mean()
    print(f"\nRouting accuracy (all departments): {accuracy:.2%}\n")

    print("Per-department accuracy:")
    for dept in DEPARTMENTS:
        sub = out[out["expected"] == dept]
        if len(sub):
            print(f"  {dept:<20} {sub['correct'].mean():.0%} ({len(sub)} cases)")

    print("\nFailures (candidates for CC):")
    bad = out[~out["correct"]]
    if bad.empty:
        print("  none - all shipped.")
    else:
        for r in bad.itertuples(index=False):
            print(f"  [{r.test_id}] expected={r.expected} predicted={r.predicted}")
            print(f"           msg: {r.test_id} -> see test_cases.csv row")
            print(f"           reasoning: {r.reasoning}")

    out.to_csv(os.path.join(BASE_DIR, "eval_output.csv"), index=False)
    print("\nFull predictions written to eval_output.csv")


def enable_phoenix():
    try:
        from openinference.instrumentation.openai import OpenAIInstrumentor
        from phoenix.otel import register

        tracer_provider = register(project_name="v1-router")
        OpenAIInstrumentor().instrument(tracer_provider=tracer_provider)
        print("Arize Phoenix tracing enabled. Open its dashboard for traces.")
    except ImportError as exc:
        print(f"Phoenix not available, skipping observability ({exc}).")


if __name__ == "__main__":
    if USE_PHOENIX:
        enable_phoenix()
    run_eval()