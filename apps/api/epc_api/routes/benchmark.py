from fastapi import APIRouter, HTTPException
from pathlib import Path
from apps.api.epc_api.store import get_store
from packages.benchmark.evaluator import evaluate, load_ground_truth

router = APIRouter(prefix="/api/projects/{project_id}/benchmark", tags=["benchmark"])


@router.get("")
async def get_benchmark(project_id: str):
    store = get_store()
    if store.project.get("id") != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    gt_path = Path(__file__).resolve().parent.parent.parent.parent.parent / "data" / "demo" / "ground_truth.jsonl"
    cases = load_ground_truth(gt_path)

    detected_deviations = set()
    detected_parameters = {}
    detected_sources = {}

    for dev_id, dev in store.deviations.items():
        for case in cases:
            if case["requirement_id"] == dev.requirement_id:
                cid = case["case_id"]
                detected_deviations.add(cid)
                detected_parameters[cid] = case["expected_parameter"]
                detected_sources[cid] = (case["expected_source"]["requirement_document"], case["expected_source"]["requirement_page"])

    metrics = evaluate(gt_path, detected_deviations, detected_parameters, detected_sources)
    return metrics.model_dump()
