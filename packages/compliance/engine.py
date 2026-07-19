from datetime import datetime, timezone

from packages.domain.models import Requirement, VendorSubmittal, Deviation
from packages.domain.enums import Severity, DecisionPath, Comparator
from packages.compliance.units import convert
from packages.compliance.comparators import compare
from packages.compliance.severity import classify_severity


def check_compliance(requirement: Requirement, submittal: VendorSubmittal) -> Deviation | None:
    if requirement.operator in (Comparator.EQ, Comparator.NEQ):
        return _check_exact_match(requirement, submittal)

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


def check_missing_evidence(requirement: Requirement, submittal: VendorSubmittal | None) -> Deviation | None:
    if submittal is not None:
        return None
    return Deviation(
        id=f"DEV-MISSING-{requirement.id}",
        project_id=requirement.project_id,
        requirement_id=requirement.id,
        submittal_id="",
        status="open",
        delta=0,
        severity=Severity.MAJOR,
        generated_at=datetime.now(timezone.utc).isoformat(),
        decision_path=DecisionPath.MISSING_EVIDENCE,
        required_value_normalized=requirement.value,
        submitted_value_normalized=0,
        normalized_unit=requirement.unit,
        operator=requirement.operator.value,
        calculation="Required evidence not found",
        confidence=0.8,
        review_required=True,
        severity_rule_id="SEV-MAJ-003",
    )


def _check_exact_match(requirement: Requirement, submittal: VendorSubmittal) -> Deviation | None:
    delta = submittal.submitted_value - requirement.value
    if requirement.operator == Comparator.EQ and abs(delta) < 1e-9:
        return None
    if requirement.operator == Comparator.NEQ and abs(delta) >= 1e-9:
        return None

    return Deviation(
        id=f"DEV-{requirement.id}-{submittal.id}",
        project_id=requirement.project_id,
        requirement_id=requirement.id,
        submittal_id=submittal.id,
        status="open",
        delta=delta,
        severity=Severity.MAJOR,
        generated_at=datetime.now(timezone.utc).isoformat(),
        decision_path=DecisionPath.DETERMINISTIC_NUMERIC,
        required_value_normalized=requirement.value,
        submitted_value_normalized=submittal.submitted_value,
        normalized_unit=requirement.unit,
        operator=requirement.operator.value,
        calculation=f"{submittal.submitted_value} {requirement.operator.value} {requirement.value} => false",
        confidence=0.95,
        review_required=False,
        severity_rule_id="SEV-MAJ-004",
    )
