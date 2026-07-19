from packages.shared.audit import AuditEvent, AuditLedger


def test_audit_event():
    event = AuditEvent("deviation.created", "system", "P1", "DEV-001", {"delta": -5.0})
    data = event.to_dict()
    assert data["action"] == "deviation.created"
    assert data["project_id"] == "P1"


def test_audit_ledger():
    ledger = AuditLedger()
    ledger.record(AuditEvent("project.created", "system", "P1"))
    ledger.record(AuditEvent("deviation.created", "system", "P1", "DEV-001"))
    assert len(ledger.list()) == 2
    assert len(ledger.list(project_id="P1")) == 2
    assert len(ledger.list(project_id="P2")) == 0
