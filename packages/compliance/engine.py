from datetime import datetime, timezone

from packages.domain.models import Requirement, VendorSubmittal, Deviation
from packages.domain.enums import Severity, DecisionPath
from packages.compliance.units import convert
from packages.compliance.comparators import compare
from packages.compliance.severity import classify_severity


def check_compliance(requirement: Requirement, submittal: VendorSubmittal) -> Deviation | None:
    req_value = requirement.value
    sub_in_req_units = convert(submittal.submitted_value, submittal.unit, requirement.unit)

    if compare(sub_in_req_units, requirement.operator, req_value):
        return None

    delta = round(sub_in_req_units - req_value, 4)
    severity, rule_id = classify_severity(delta, req_value)

    return Deviation(
        id=f"DEV-{requirement.id}-{submittal.id}",
        project_id=requirement.project_id,
        requirement_id=requirement.id,
        submittal_id=submittal.id,
        status="open",
        delta=delta,
        severity=severity,
        generated_at=datetime.now(timezone.utc).isoformat(),
        decision_path=DecisionPath.DETERMINISTIC_NUMERIC,
        required_value_normalized=req_value,
        submitted_value_normalized=sub_in_req_units,
        normalized_unit=requirement.unit,
        operator=requirement.operator.value,
        calculation=f"{sub_in_req_units} {requirement.operator.value} {req_value} => false",
        confidence=0.97,
        review_required=False,
        severity_rule_id=rule_id,
    )
