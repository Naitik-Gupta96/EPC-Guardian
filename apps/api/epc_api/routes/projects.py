from fastapi import APIRouter, HTTPException

from apps.api.epc_api.store import get_store

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("/{project_id}")
async def get_project(project_id: str):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.project


@router.get("/{project_id}/deviations")
async def list_deviations(
    project_id: str,
    status: str | None = None,
    severity: str | None = None,
):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    devs = []
    for d in store.deviations.values():
        if status and d.status.value != status:
            continue
        if severity and d.severity.value != severity:
            continue
        devs.append(d.model_dump())
    return {"deviations": devs, "total": len(devs)}


@router.get("/{project_id}/requirements")
async def list_requirements(project_id: str):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"requirements": [r.model_dump() for r in store.requirements.values()]}
