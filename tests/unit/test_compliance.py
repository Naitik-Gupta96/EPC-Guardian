import pytest
from packages.domain.models import Requirement, VendorSubmittal, EvidenceCitation
from packages.domain.enums import Comparator
from packages.compliance.engine import check_compliance


def make_req(value=15.0, unit="minute", op=Comparator.GTE) -> Requirement:
    return Requirement(
        id="REQ-TEST",
        project_id="P1",
        asset_type="UPS",
        equipment_tag="UPS-A",
        parameter="autonomy",
        operator=op,
        value=value,
        unit=unit,
        scope="test",
        evidence=EvidenceCitation(source_document="spec.pdf", source_page=1, extracted_text="test"),
        extraction_confidence=0.95,
    )


def make_sub(value=10.0, unit="minute") -> VendorSubmittal:
    return VendorSubmittal(
        id="SUB-TEST",
        project_id="P1",
        equipment_tag="UPS-A",
        parameter="autonomy",
        submitted_value=value,
        unit=unit,
        vendor="Test Vendor",
        submittal_ref="VS-001",
        evidence=EvidenceCitation(source_document="sub.pdf", source_page=1, extracted_text="test"),
        extraction_confidence=0.95,
    )


def test_compliant_pass():
    dev = check_compliance(make_req(15), make_sub(15))
    assert dev is None


def test_non_compliant_creates_deviation():
    dev = check_compliance(make_req(15), make_sub(10))
    assert dev is not None
    assert dev.delta == -5.0
    assert dev.severity.value == "critical"
    assert "false" in dev.calculation


def test_unit_conversion_hours_to_minutes():
    dev = check_compliance(make_req(15, "minute"), make_sub(0.2, "hour"))
    assert dev is not None
    assert dev.delta == -3.0


def test_unit_conversion_minutes_to_hours():
    dev = check_compliance(make_req(1, "hour"), make_sub(30, "minute"))
    assert dev is not None
    assert dev.delta == -0.5


def test_less_than_operator():
    req = make_req(100, "kW", Comparator.LT)
    sub = make_sub(80, "kW")
    dev = check_compliance(req, sub)
    assert dev is None


def test_less_than_operator_violation():
    req = make_req(100, "kW", Comparator.LT)
    sub = make_sub(120, "kW")
    dev = check_compliance(req, sub)
    assert dev is not None


def test_greater_than_operator():
    req = make_req(10, "percent", Comparator.GT)
    sub = make_sub(15, "percent")
    dev = check_compliance(req, sub)
    assert dev is None


def test_not_equal_violation():
    req = make_req(480, "V", Comparator.NEQ)
    sub = make_sub(480, "V")
    dev = check_compliance(req, sub)
    assert dev is not None
