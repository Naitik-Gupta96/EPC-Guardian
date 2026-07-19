from packages.workflow.state import WorkflowState, WorkflowStatus
from packages.workflow.drafting import draft_rfi, draft_ncr, draft_risk_entry
from packages.workflow.approval import ApprovalGate
from packages.workflow.outbox import Outbox, OutboxEntry
from packages.domain.models import Deviation


class WorkflowGraph:
    def __init__(self, approval: ApprovalGate, outbox: Outbox):
        self.approval = approval
        self.outbox = outbox

    def run(self, deviation: Deviation, approved_by: str | None = None) -> WorkflowState:
        state = WorkflowState(deviation_id=deviation.id, project_id=deviation.project_id)

        state.status = WorkflowStatus.EVIDENCE_VALIDATED
        state.rfi_draft = draft_rfi(deviation)
        state.status = WorkflowStatus.RFI_DRAFTED
        state.ncr_draft = draft_ncr(deviation)
        state.status = WorkflowStatus.NCR_DRAFTED
        state.risk_entry = draft_risk_entry(deviation)
        state.status = WorkflowStatus.RISK_DRAFTED
        state.status = WorkflowStatus.AWAITING_APPROVAL

        if approved_by:
            ok = self.approval.approve(deviation.id, approved_by, state.version - 1)
            if ok:
                state.approved = True
                state.approved_by = approved_by
                state.status = WorkflowStatus.APPROVED
                for kind, content in [
                    ("RFI", state.rfi_draft),
                    ("NCR", state.ncr_draft),
                    ("RISK", state.risk_entry),
                ]:
                    entry = OutboxEntry(deviation.id, kind, content or "", approved_by)
                    self.outbox.add(entry)
                state.status = WorkflowStatus.QUEUED_IN_OUTBOX
                state.version += 1

        return state
