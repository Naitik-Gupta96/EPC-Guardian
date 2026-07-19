from fastapi import APIRouter, HTTPException

from apps.api.epc_api.store import get_store
from packages.domain.models import CorrectiveAction
from packages.domain.enums import CorrectiveActionKind
from datetime import datetime, timezone

router = APIRouter(prefix="/api/deviations", tags=["workflows"])


@router.post("/{deviation_id}/workflow")
async def generate_workflow(deviation_id: str):
    store = get_store()
    dev = store.deviations.get(deviation_id)
    if dev is None:
        raise HTTPException(status_code=404, detail="Devation not found")

    rfi = CorrectiveAction(
        id=f"RFI-{deviation_id}",
        project_id=dev.project_id,
        deviation_id=deviation_id,
        kind=CorrectiveActionKind.RFI,
        draft_content=(
            f"RFI: UPS-A autonomy below specified requirement\n\n"
            f"Requirement: {dev.required_value_normalized} {dev.normalized_unit} "
            f"({dev.operator}) per client specification (p.47)\n"
            f"Submitted: {dev.submitted_value_normalized} {dev.normalized_unit} "
            f"per submittal VS-019 (p.8)\n"
            f"Calculation: {dev.calculation}\n"
            f"Delta: {dev.delta} {dev.normalized_unit}\n"
            f"Question: Please confirm whether the submitted UPS-A autonomy "
            f"of {dev.submitted_value_normalized} {dev.normalized_unit} meets "
            f"the project's operational requirements, or if a revised submittal "
            f"is required."
        ),
        schedule_delta_days=0,
    )

    ncr = CorrectiveAction(
        id=f"NCR-{deviation_id}",
        project_id=dev.project_id,
        deviation_id=deviation_id,
        kind=CorrectiveActionKind.NCR,
        draft_content=(
            f"NCR: UPS-A autonomy non-conformance\n\n"
            f"Criterion: TIA-942-C / Uptime Tier III\n"
            f"Specified: >= {dev.required_value_normalized} {dev.normalized_unit}\n"
            f"As-delivered (submittal): {dev.submitted_value_normalized} {dev.normalized_unit}\n"
            f"Shortfall: {abs(dev.delta)} {dev.normalized_unit} "
            f"({abs(dev.delta)/dev.required_value_normalized*100:.1f}%)\n"
            f"Acceptance criterion violated: UPS autonomy >= 15 minutes at rated load"
        ),
        schedule_delta_days=0,
    )

    risk_entry = CorrectiveAction(
        id=f"RISK-{deviation_id}",
        project_id=dev.project_id,
        deviation_id=deviation_id,
        kind=CorrectiveActionKind.RISK_REGISTER,
        draft_content=(
            f"Risk Register Entry: UPS-A autonomy shortfall\n\n"
            f"Risk: UPS-A battery autonomy of {dev.submitted_value_normalized} "
            f"{dev.normalized_unit} does not meet the specified "
            f"{dev.required_value_normalized} {dev.normalized_unit} minimum.\n"
            f"Impact: Failure of Integrated Systems Test (TEST-IST-UPS-A)\n"
            f"Schedule risk: Activities affected - {', '.join(dev.affected_activity_ids)}\n"
            f"Severity: {dev.severity.value.upper()}"
        ),
        schedule_delta_days=0,
    )

    return {
        "deviation_id": deviation_id,
        "rfi": rfi.model_dump(),
        "ncr": ncr.model_dump(),
        "risk_entry": risk_entry.model_dump(),
    }
