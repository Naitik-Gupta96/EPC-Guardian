import asyncio
from fastapi import APIRouter, HTTPException

from apps.api.epc_api.store import get_store

router = APIRouter(prefix="/api/deviations", tags=["deviations"])


@router.get("/{deviation_id}")
async def get_deviation(deviation_id: str):
    store = get_store()
    dev = store.deviations.get(deviation_id)
    if dev is None:
        raise HTTPException(status_code=404, detail="Devation not found")
    return dev.model_dump()


@router.get("/{deviation_id}/impact-graph")
async def get_impact_graph(deviation_id: str):
    store = get_store()
    dev = store.deviations.get(deviation_id)
    if dev is None:
        raise HTTPException(status_code=404, detail="Devation not found")
    graph = await store.graph.get_blast_radius(deviation_id)
    return {
        "deviation_id": graph.deviation_id,
        "nodes": [
            {"id": n.id, "type": n.type, "label": n.label, "status": n.status, "evidence_id": n.evidence_id}
            for n in graph.nodes
        ],
        "edges": [
            {"id": e.id, "source": e.source, "target": e.target, "type": e.type, "label": e.label}
            for e in graph.edges
        ],
        "summary": graph.summary,
    }


from pydantic import BaseModel


class SimulateRequest(BaseModel):
    extra_delay_days: int = 0
    option: str = ""


@router.post("/{deviation_id}/simulate")
async def simulate(deviation_id: str, body: SimulateRequest):
    store = get_store()
    dev = store.deviations.get(deviation_id)
    if dev is None:
        raise HTTPException(status_code=404, detail="Devation not found")
    from packages.scheduling.scenarios import simulate_deviation_impact
    activities = list(store.activities.values())
    result = simulate_deviation_impact(dev, activities, body.extra_delay_days)
    data = result.model_dump()
    data["scenario_inputs"]["extra_delay_days"] = body.extra_delay_days
    data["scenario_inputs"]["option"] = body.option
    return data
