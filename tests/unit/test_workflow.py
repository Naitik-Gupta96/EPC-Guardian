import pytest
from packages.workflow.state import WorkflowState, WorkflowStatus
from packages.workflow.drafting import draft_rfi, draft_ncr, draft_risk_entry
from packages.workflow.approval import ApprovalGate
from packages.workflow.outbox import Outbox, OutboxEntry
from packages.workflow.graph import WorkflowGraph
from packages.domain.models import Deviation
from packages.domain.enums import Severity


def make_deviation() -> Deviation:
    return Deviation(
        id="DEV-UPS-001",
        project_id="P1",
        requirement_id="REQ-UPS-001",
        submittal_id="SUB-VS-019",
        status="open",
        delta=-5.0,
        severity=Severity.CRITICAL,
        affected_activity_ids=["A-2210"],
        affected_test_ids=["TEST-IST"],
        generated_at="now",
        required_value_normalized=15.0,
        submitted_value_normalized=10.0,
        normalized_unit="minute",
        operator=">=",
        calculation="10 >= 15 => false",
        confidence=0.97,
        severity_rule_id="SEV-CRIT-001",
    )


def test_workflow_state_transitions():
    state = WorkflowState("DEV-001", "P1")
    assert state.status == WorkflowStatus.DRAFT_REQUESTED
    state.status = WorkflowStatus.AWAITING_APPROVAL
    assert state.status == WorkflowStatus.AWAITING_APPROVAL


def test_draft_rfi():
    dev = make_deviation()
    rfi = draft_rfi(dev)
    assert "RFI" in rfi
    assert "15.0" in rfi
    assert "10.0" in rfi


def test_draft_ncr():
    dev = make_deviation()
    ncr = draft_ncr(dev)
    assert "NCR" in ncr
    assert "33.3%" in ncr


def test_draft_risk_entry():
    dev = make_deviation()
    risk = draft_risk_entry(dev)
    assert "RISK" in risk or "Risk" in risk
    assert "TEST-IST" in risk


def test_approval_gate():
    gate = ApprovalGate()
    assert gate.approve("DEV-001", "engineer", 0) is True
    assert gate.approve("DEV-001", "engineer", 0) is False  # stale version


def test_outbox():
    outbox = Outbox()
    entry = OutboxEntry("DEV-001", "RFI", "test content", "engineer")
    outbox.add(entry)
    entries = outbox.list()
    assert len(entries) == 1
    assert entries[0]["kind"] == "RFI"


def test_workflow_graph():
    dev = make_deviation()
    approval = ApprovalGate()
    outbox = Outbox()
    graph = WorkflowGraph(approval, outbox)

    state = graph.run(dev, approved_by="engineer")
    assert state.status == WorkflowStatus.QUEUED_IN_OUTBOX
    assert state.approved is True
    assert len(outbox.list()) == 3
