from fastapi import APIRouter, HTTPException
from apps.api.epc_api.store import get_store

router = APIRouter(prefix="/api/projects/{project_id}/documents", tags=["documents"])


@router.get("")
async def list_documents(project_id: str):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"documents": store.documents}
