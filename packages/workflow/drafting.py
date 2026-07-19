from packages.domain.models import Deviation


def draft_rfi(deviation: Deviation) -> str:
    return (
        f"RFI: {deviation.requirement_id} deviation\n\n"
        f"Requirement: {deviation.required_value_normalized} {deviation.normalized_unit} "
        f"({deviation.operator})\n"
        f"Submitted: {deviation.submitted_value_normalized} {deviation.normalized_unit}\n"
        f"Calculation: {deviation.calculation}\n"
        f"Delta: {deviation.delta} {deviation.normalized_unit}\n"
        f"Question: Please confirm whether the submitted value meets project requirements."
    )


def draft_ncr(deviation: Deviation) -> str:
    return (
        f"NCR: {deviation.requirement_id} non-conformance\n\n"
        f"Specified: {deviation.required_value_normalized} {deviation.normalized_unit}\n"
        f"As-delivered: {deviation.submitted_value_normalized} {deviation.normalized_unit}\n"
        f"Shortfall: {abs(deviation.delta)} {deviation.normalized_unit} "
        f"({abs(deviation.delta)/max(deviation.required_value_normalized, 0.001)*100:.1f}%)\n"
        f"Affected tests: {', '.join(deviation.affected_test_ids)}"
    )


def draft_risk_entry(deviation: Deviation) -> str:
    return (
        f"Risk Register Entry: {deviation.id}\n\n"
        f"Risk: Value of {deviation.submitted_value_normalized} {deviation.normalized_unit} "
        f"does not meet {deviation.required_value_normalized} {deviation.normalized_unit}\n"
        f"Impact: Failure of {', '.join(deviation.affected_test_ids)}\n"
        f"Schedule: {', '.join(deviation.affected_activity_ids)}\n"
        f"Severity: {deviation.severity.value.upper()}"
    )
