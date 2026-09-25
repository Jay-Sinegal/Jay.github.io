"""
agents/planner - intake planner agent.

Pipeline: intent classification -> SOP retrieval (your own SOP library) ->
step-plan generation -> evaluation against a labeled test set.

Original implementation. The step catalog and all prompts are owned by the
practice; only general agentic-AI concepts are used (see PROVENANCE.md).

Run:
    OPENAI_API_KEY=sk-... python agents/planner/planner.py
"""

import json
import os

import pandas as pd
from openai import OpenAI

BASE = os.path.dirname(os.path.abspath(__file__))
KB_DIR = os.path.join(BASE, "sop_kb")
TEST_SET = os.path.join(BASE, "test_cases.csv")
MODEL = os.getenv("MODEL", "gpt-4o-mini")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

INTENTS = [
    "brand_architecture",
    "clinic_school",
    "media_audit",
    "flighttime",
    "scheduling",
    "pricing",
    "about",
    "out_of_scope",
]

CONTACT_OBJECTIVES = {
    "brand_architecture": "Executive Brand Architecture (1-on-1 Consultation)",
    "clinic_school": "School / Organization NIL and Music Licensing Clinic",
    "media_audit": "Media Copyright and Facility Audit",
    "flighttime": "FlightTime Athletics Combine and Training Inquiry",
}

SOP_MAP = {
    "brand_architecture": "01-brand-architecture.md",
    "clinic_school": "02-clinic-school.md",
    "media_audit": "03-media-audit.md",
    "flighttime": "04-flighttime.md",
    "scheduling": "05-scheduling-pricing.md",
    "pricing": "05-scheduling-pricing.md",
    "about": "00-boundary.md",
    "out_of_scope": "00-boundary.md",
}

STEP_CATALOG = {
    "brand_architecture": [
        "step_verify_boundary",
        "step_send_intake",
        "step_review_signature",
        "step_brand_ip_audit",
        "step_architecture_deck",
        "step_90day_roadmap",
    ],
    "clinic_school": [
        "step_send_risk_audit",
        "step_review_gaps",
        "step_discovery_call",
        "step_exec_proposal",
        "step_book_clinic",
        "step_deliver_modules",
        "step_season_retainer",
    ],
    "media_audit": [
        "step_scope_review",
        "step_dmca_checklist",
        "step_master_sync_reference",
        "step_audit_report",
        "step_recommend_clinic",
    ],
    "flighttime": [
        "step_combine_baseline",
        "step_metric_assets",
        "step_retest_8wk",
    ],
    "scheduling": [
        "step_confirm_booking",
        "step_gate_reminder",
        "step_calendar_link",
    ],
    "pricing": [
        "step_quote_path_a",
        "step_quote_path_b",
        "step_payment_booking",
    ],
    "about": [
        "step_bio_credentials",
        "step_boundary_statement",
    ],
    "out_of_scope": [
        "step_decline_agency",
        "step_close",
    ],
}

RISKY_INTENTS = ["out_of_scope", "scheduling", "pricing"]


# ---------------------------------------------------------------- intent ---
def classify_intent(message: str) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0.0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": _intent_system_prompt(),
            },
            {"role": "user", "content": message},
        ],
    )
    data = json.loads(resp.choices[0].message.content)
    intent = data.get("intent")
    if intent not in INTENTS:
        raise ValueError(f"classifier returned unknown intent: {intent}")
    return intent


def _intent_system_prompt() -> str:
    return (
        "You are the front-door intake classifier for Jaylen Sinegal, an executive\n"
        "brand strategist, media IP consultant, and official Louisiana Storyteller.\n"
        "He provides EDUCATION in brand architecture and media IP. He is not a licensed\n"
        "sports agent and does not negotiate athletic or endorsement contracts.\n"
        "Classify the message into exactly one intent:\n"
        "- brand_architecture: 1-on-1 athlete/family brand building and media IP education\n"
        "- clinic_school: NIL and music licensing clinics for schools, districts, or clubs\n"
        "- media_audit: copyright exposure, DMCA, or media-use review\n"
        "- flighttime: FlightTime combine/training/metrics or membership questions\n"
        "- scheduling: booking, rescheduling, or call logistics\n"
        "- pricing: cost, packages, or payment questions\n"
        "- about: who he is, credentials, or the agent-boundary question\n"
        "- out_of_scope: agent-seeking, contract negotiation, agency-adjacent service,\n"
        "  spam, or anything outside the service lines\n"
        "Rules: agent-seeking or contract-negotiation messages are ALWAYS out_of_scope.\n"
        '"How much" questions are pricing; "can I book" questions are scheduling.\n'
        'Respond ONLY with JSON: {"intent": "<one intent>"}'
    )


# ------------------------------------------------------------------ SOPs ---
def load_sops():
    sops = {}
    for name in os.listdir(KB_DIR):
        path = os.path.join(KB_DIR, name)
        if name.endswith(".md") and os.path.isfile(path):
            with open(path, "r", encoding="utf-8") as fh:
                sops[name] = fh.read()
    return sops


def select_context(intent: str, sops: dict):
    boundary = sops["00-boundary.md"]
    domain = sops[SOP_MAP[intent]]
    if SOP_MAP[intent] == "00-boundary.md":
        return boundary, ["00-boundary.md"]
    return "\n\n---\n\n".join([boundary, domain]), ["00-boundary.md", SOP_MAP[intent]]


# --------------------------------------------------------------- plan -------
def build_plan(message: str, intent: str, context: str) -> dict:
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=0.0,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": _plan_system_prompt(intent),
            },
            {
                "role": "system",
                "content": (
                    "Standard operating knowledge, retrieve ONLY from this:\n\n" + context
                ),
            },
            {"role": "user", "content": message},
        ],
    )
    return json.loads(resp.choices[0].message.content)


def _plan_system_prompt(intent: str) -> str:
    catalog = ", ".join(STEP_CATALOG[intent])
    required = (
        "Center the plan on the exact steps the dep execution sequence follows, "
        "and on the gates that protect the practice."
    )
    if intent == "out_of_scope":
        required = (
            "The plan MUST use only step_decline_agency and step_close. Do NOT invent a "
            "service path. Mark needs_human true."
        )
    needs_human_rule = (
        "Set needs_human true (this is a support/triage intent and a person must confirm)."
        if intent in RISKY_INTENTS
        else "Set needs_human false only if the plan is fully deterministic guardrails; "
        "otherwise true."
    )
    objective = CONTACT_OBJECTIVES.get(intent, "")
    objective_line = (
        f'For the site lead form, set contact_objective to "{objective}".'
        if objective
        else 'Set contact_objective to null (no site lead form objective for this intent).'
    )
    return (
        "You turn a routed inquiry into an ordered step plan for the intake agent of\n"
        "Jaylen Sinegal's consulting practice. Education, not representation.\n"
        f"Allowed step ids for intent {intent}: {catalog}.\n"
        f"{required}\n"
        f"{needs_human_rule}\n"
        f"{objective_line}\n"
        "Rules: only use allowed step ids; keep their real order (gate before deliverable);\n"
        "one short action and one reason per step; never add legal advice or agency work.\n"
        'Respond ONLY with JSON:\n'
        '{"intent": "<intent>", "contact_objective": "<value or null>",\n'
        ' "steps": [{"id": "<step id>", "action": "...", "reason": "..."}],\n'
        ' "needs_human": true|false, "notes": "<one sentence>"}'
    )


# ------------------------------------------------------------------ eval ----
def run_eval():
    df = pd.read_csv(TEST_SET)
    sops = load_sops()

    rows = []
    for row in df.itertuples(index=False):
        intent = classify_intent(row.message)
        expected_steps = {s for s in row.expected_steps.split("|") if s}
        context, selected = select_context(intent, sops)
        plan = build_plan(row.message, intent, context)
        got_steps = {s["id"] for s in plan.get("steps", []) if isinstance(s, dict)}
        expected_sop = row.expected_sop

        rows.append(
            {
                "test_id": row.test_id,
                "expected_intent": row.expected_intent,
                "predicted_intent": intent,
                "intent_ok": intent == row.expected_intent,
                "expected_sop": expected_sop,
                "sop_selected": expected_sop in [p for p in selected] if expected_sop else True,
                "expected_steps": row.expected_steps,
                "steps_hit": "|".join(sorted(expected_steps & got_steps)),
                "steps_missed": "|".join(sorted(expected_steps - got_steps)),
                "unexpected_steps": "|".join(sorted(got_steps - expected_steps)),
                "needs_human": plan.get("needs_human"),
                "notes": plan.get("notes", ""),
            }
        )

    out = pd.DataFrame(rows)
    out["sop_ok"] = out["sop_selected"]
    out["coverage"] = (
        out["expected_steps"].str.count(r"\|") + 1
    )
    out["steps_missed"] = out["steps_missed"].astype(str)

    print(f"\nIntent accuracy:      {out['intent_ok'].mean():.0%}")
    print(f"SOP selection hit:    {out['sop_ok'].mean():.0%}")
    print(f"Needs-human flagged for risky intents:")
    risky = out[out["expected_intent"].isin(RISKY_INTENTS)]
    for r in risky.itertuples(index=False):
        print(f"  [{r.test_id}] {r.expected_intent}: {r.needs_human}")

    missed = out[out["steps_missed"].map(len) > 0] if not out.empty else out
    if not missed.empty:
        print("\nPlan coverage gaps (candidates for calibration):")
        for r in missed.itertuples(index=False):
            print(f"  [{r.test_id}] intent={r.expected_intent} missed={r.steps_missed}")

    out.to_csv(os.path.join(BASE, "eval_output_planner.csv"), index=False)
    print("\nFull plans written to eval_output_planner.csv")


if __name__ == "__main__":
    run_eval()