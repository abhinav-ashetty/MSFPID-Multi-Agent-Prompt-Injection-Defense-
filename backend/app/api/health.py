"""Health check API endpoint."""

from fastapi import APIRouter
from app.models.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns:
        HealthResponse: Status of the application.
    """
    return HealthResponse(status="ok")