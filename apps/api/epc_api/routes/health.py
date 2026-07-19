from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health/live")
async def health_live():
    return {"status": "ok"}


@router.get("/health/ready")
async def health_ready():
    return {"status": "ok", "mode": "seeded"}
