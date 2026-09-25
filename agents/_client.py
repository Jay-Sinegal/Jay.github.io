"""
Agent client factory. Both agents run against OpenAI by default, or Google
Gemini through its OpenAI-compatible endpoint by setting LLM_PROVIDER=gemini.

Providers:
- openai (default): needs OPENAI_API_KEY
- gemini: needs GEMINI_API_KEY (from https://aistudio.google.com/apikey);
  model defaults to a Gemini text model and can be overridden with MODEL=...,
  or provider-specific MODEL override via GEMINI_MODEL / OPENAI_MODEL.
"""

import os

from openai import OpenAI

PROVIDER = os.getenv("LLM_PROVIDER", "openai").strip().lower()

GEMINI_COMPAT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"

GEMINI_MODELS = ("gemini", "google", "google-ai", "aistudio")
OPENAI_MODELS = ("openai", "azure")


def provider_is_gemini() -> bool:
    return PROVIDER in GEMINI_MODELS


def default_model() -> str:
    if provider_is_gemini():
        return os.getenv("GEMINI_MODEL") or os.getenv("MODEL") or "gemini-3.7-flash"
    return os.getenv("OPENAI_MODEL") or os.getenv("MODEL") or "gpt-4o-mini"


def get_client() -> OpenAI:
    if provider_is_gemini():
        key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not key:
            raise SystemExit(
                "Gemini mode selected (LLM_PROVIDER=gemini) but no key found. "
                "Set GEMINI_API_KEY from https://aistudio.google.com/apikey"
            )
        return OpenAI(api_key=key, base_url=GEMINI_COMPAT_BASE_URL)
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise SystemExit("Set OPENAI_API_KEY, or LLM_PROVIDER=gemini with GEMINI_API_KEY.")
    return OpenAI(api_key=key)