"""Security assessment models for the Defender Agent."""

from enum import Enum
from pydantic import BaseModel, Field


class Decision(str, Enum):
    """Security decision enum."""

    ALLOW = "ALLOW"
    SANITIZE = "SANITIZE"
    BLOCK = "BLOCK"


class AttackType(str, Enum):
    """Attack type enum."""

    NONE = "NONE"
    PROMPT_INJECTION = "PROMPT_INJECTION"
    OTHER = "OTHER"


class SecurityAssessment(BaseModel):
    """Structured security assessment output from the Defender Agent."""

    decision: Decision = Field(
        ...,
        description="Security decision: ALLOW, SANITIZE, or BLOCK",
    )
    risk_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="Risk score from 0 (safe) to 100 (critical)",
    )
    attack_type: AttackType = Field(
        ...,
        description="Type of attack detected",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence in the assessment from 0.0 to 1.0",
    )
    reason: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Short explanation for the assessment",
    )