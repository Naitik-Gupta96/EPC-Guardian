from packages.domain.enums import Severity


def classify_severity(delta: float, required_value: float, is_safety_critical: bool = False) -> tuple[Severity, str]:
    if required_value == 0:
        return Severity.MAJOR, "SEV-MAJ-001"

    shortfall_pct = abs(delta) / abs(required_value) * 100

    if is_safety_critical and shortfall_pct >= 20:
        return Severity.CRITICAL, "SEV-CRIT-001"
    if shortfall_pct >= 20:
        return Severity.CRITICAL, "SEV-CRIT-002"
    if shortfall_pct >= 5:
        return Severity.MAJOR, "SEV-MAJ-002"
    return Severity.MINOR, "SEV-MIN-001"
