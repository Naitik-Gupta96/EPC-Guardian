from enum import Enum


class WorkflowStatus(str, Enum):
    DRAFT_REQUESTED = "draft_requested"
    EVIDENCE_VALIDATED = "evidence_validated"
    RFI_DRAFTED = "rfi_drafted"
    NCR_DRAFTED = "ncr_drafted"
    RISK_DRAFTED = "risk_entry_drafted"
    AWAITING_APPROVAL = "awaiting_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    QUEUED_IN_OUTBOX = "queued_in_outbox"
    REVISION_REQUESTED = "revision_requested"


class WorkflowState:
    def __init__(self, deviation_id: str, project_id: str):
        self.deviation_id = deviation_id
        self.project_id = project_id
        self.status = WorkflowStatus.DRAFT_REQUESTED
        self.rfi_draft: str | None = None
        self.ncr_draft: str | None = None
        self.risk_entry: str | None = None
        self.approved: bool = False
        self.approved_by: str | None = None
        self.approved_at: str | None = None
        self.version: int = 1

    def to_dict(self) -> dict:
        return {
            "deviation_id": self.deviation_id,
            "project_id": self.project_id,
            "status": self.status.value,
            "rfi_draft": self.rfi_draft,
            "ncr_draft": self.ncr_draft,
            "risk_entry": self.risk_entry,
            "approved": self.approved,
            "approved_by": self.approved_by,
            "approved_at": self.approved_at,
            "version": self.version,
        }
