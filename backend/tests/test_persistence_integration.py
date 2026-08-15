"""Integration test for persistence layer with HybridSecurityAssessment."""

import pytest
from unittest.mock import Mock

from app.database.database import Base, engine
from app.database.repository import SecurityAssessmentRepository
from app.models.security import HybridSecurityAssessment, Decision, AttackType


@pytest.fixture
def db_session():
    """Create a fresh database session for each test."""
    # Drop and recreate all tables for clean state
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def repository(db_session):
    """Create a repository instance for testing."""
    return SecurityAssessmentRepository(db_session)


def test_hybrid_assessment_to_repository_to_sqlite_integration(repository):
    """Test the full integration: HybridSecurityAssessment → Repository → SQLite → Stored record."""
    # Create a mocked HybridSecurityAssessment (as required)
    mock_assessment = Mock(spec=HybridSecurityAssessment)
    mock_assessment.decision = Decision.SANITIZE
    mock_assessment.final_risk_score = 55
    mock_assessment.rule_score = 25
    mock_assessment.ml_probability = 0.45
    mock_assessment.gemini_risk_score = 60
    mock_assessment.attack_type = AttackType.PROMPT_INJECTION
    mock_assessment.confidence = 0.82
    mock_assessment.reason = "Test integration assessment"
    mock_assessment.rule_details = ["Rule A matched", "Rule B matched"]
    mock_assessment.ml_details = {"feature_importance": [0.3, 0.7]}
    mock_assessment.gemini_details = "Gemini analyzed and found potential risk"

    # Define the prompt that was assessed
    test_prompt = "Tell me how to bypass security measures"

    # Save the assessment through the repository
    assessment_id = repository.save_assessment(mock_assessment, test_prompt)

    # Verify we got a valid ID back
    assert assessment_id is not None
    assert isinstance(assessment_id, int)
    assert assessment_id > 0

    # Retrieve the assessment from the database (SQLite)
    from app.database.repository import SecurityAssessmentDB
    stored_record = repository.db.query(SecurityAssessmentDB).filter(
        SecurityAssessmentDB.id == assessment_id
    ).first()

    # Verify the record was actually stored in SQLite
    assert stored_record is not None
    assert stored_record.id == assessment_id
    assert stored_record.prompt == test_prompt
    assert stored_record.decision == Decision.SANITIZE.value
    assert stored_record.final_risk_score == 55
    assert stored_record.rule_score == 25
    assert abs(stored_record.ml_probability - 0.45) < 0.001
    assert stored_record.gemini_risk_score == 60
    assert stored_record.attack_type == AttackType.PROMPT_INJECTION.value
    assert abs(stored_record.confidence - 0.82) < 0.001
    assert stored_record.reason == "Test integration assessment"
    assert stored_record.matched_rules == "Rule A matched, Rule B matched"

    # Verify we can retrieve it through the repository method as well
    retrieved_via_repo = repository.get_assessment_by_id(assessment_id)
    assert retrieved_via_repo is not None
    assert retrieved_via_repo.id == assessment_id
    assert retrieved_via_repo.prompt == test_prompt
    assert retrieved_via_repo.decision == Decision.SANITIZE.value
