from fastapi import APIRouter, HTTPException
from apps.api.epc_api.store import get_store

router = APIRouter(prefix="/api/projects/{project_id}/audit", tags=["audit"])


@router.get("")
async def get_audit_log(project_id: str):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"events": [{"timestamp": "2026-07-17T09:00:00Z", "action": "project.seeded", "actor": "system"}], "total": 1}
