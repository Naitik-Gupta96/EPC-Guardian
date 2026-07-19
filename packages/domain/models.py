from pydantic import BaseModel
from datetime import date
from packages.domain.enums import Comparator, DeviationStatus, Severity, CorrectiveActionKind, Provenance, DecisionPath


class EvidenceCitation(BaseModel):
    source_document: str
    source_page: int
    source_cell: str | None = None
    bbox: tuple[float, float, float, float] | None = None
    extracted_text: str


class Requirement(BaseModel):
    id: str
    project_id: str
    asset_type: str
    equipment_tag: str | None = None
    parameter: str
    operator: Comparator
    value: float
    unit: str
    scope: str
    evidence: EvidenceCitation
    extraction_confidence: float
    provenance: Provenance = Provenance.FIXTURE


class VendorSubmittal(BaseModel):
    id: str
    project_id: str
    equipment_tag: str
    parameter: str
    submitted_value: float
    unit: str
    vendor: str
    submittal_ref: str
    evidence: EvidenceCitation
    extraction_confidence: float
    provenance: Provenance = Provenance.FIXTURE


class PurchaseOrder(BaseModel):
    id: str
    project_id: str
    equipment_tag: str
    submittal_ref: str
    release_date: date
    status: str


class ScheduleActivity(BaseModel):
    id: str
    project_id: str
    description: str
    predecessors: list[str] = []
    duration_days: int
    total_float_days: float | None = None
    linked_equipment_tags: list[str] = []


class CommissioningTest(BaseModel):
    id: str
    project_id: str
    name: str
    standard_ref: str
    depends_on_activities: list[str] = []
    acceptance_criteria: list[str] = []


class Milestone(BaseModel):
    id: str
    project_id: str
    name: str
    activity_id: str | None = None


class Equipment(BaseModel):
    tag: str
    project_id: str
    asset_type: str
    spec_reference: str = ""


class Deviation(BaseModel):
    id: str
    project_id: str
    requirement_id: str
    submittal_id: str
    status: DeviationStatus = DeviationStatus.OPEN
    delta: float
    severity: Severity
    affected_activity_ids: list[str] = []
    affected_test_ids: list[str] = []
    generated_at: str
    decision_path: DecisionPath = DecisionPath.DETERMINISTIC_NUMERIC
    required_value_normalized: float = 0
    submitted_value_normalized: float = 0
    normalized_unit: str = ""
    operator: str = ""
    calculation: str = ""
    confidence: float = 0
    review_required: bool = False
    severity_rule_id: str = ""


class CorrectiveAction(BaseModel):
    id: str
    project_id: str
    deviation_id: str
    kind: CorrectiveActionKind
    draft_content: str
    schedule_delta_days: float
    cost_delta_estimate: float | None = None
    approved_by: str | None = None
    approved_at: str | None = None


class ScenarioInput(BaseModel):
    deviation_id: str
    extra_delay_days: int
    option: str = ""


class ScenarioResult(BaseModel):
    baseline_duration_days: int
    impacted_duration_days: int
    project_delta_days: int
    baseline_critical_path: list[str]
    impacted_critical_path: list[str]
    newly_critical_activities: list[str]
    float_by_activity: dict[str, float]
    scenario_inputs: ScenarioInput
    calculation_version: str = "cpm-v1"
