from packages.ingestion.extractors import RequirementCandidate, SubmittalValueCandidate
from packages.domain.models import Requirement, VendorSubmittal, EvidenceCitation
from packages.compliance.units import normalize_unit
from packages.compliance.matching import canonical_parameter
from packages.domain.enums import Comparator, Provenance


def normalize_requirement(candidate: RequirementCandidate, document_id: str, project_id: str) -> Requirement | None:
    param = canonical_parameter(candidate.parameter)
    if param == "unmapped":
        return None

    op_map = {">=": Comparator.GTE, "<=": Comparator.LTE, "==": Comparator.EQ,
              "!=": Comparator.NEQ, ">": Comparator.GT, "<": Comparator.LT}
    operator = op_map.get(candidate.operator)
    if operator is None:
        return None

    return Requirement(
        id=f"REQ-{project_id}-{candidate.equipment_tag or 'ANY'}-{param}",
        project_id=project_id,
        asset_type=candidate.asset_type,
        equipment_tag=candidate.equipment_tag,
        parameter=param,
        operator=operator,
        value=candidate.value,
        unit=normalize_unit(candidate.unit),
        scope=candidate.scope,
        evidence=EvidenceCitation(
            source_document=document_id,
            source_page=1,
            extracted_text=candidate.source_sentence,
        ),
        extraction_confidence=candidate.confidence,
        provenance=Provenance.LLM,
    )


def normalize_submittal(candidate: SubmittalValueCandidate, document_id: str, project_id: str) -> VendorSubmittal | None:
    param = canonical_parameter(candidate.parameter)
    if param == "unmapped":
        return None

    return VendorSubmittal(
        id=f"SUB-{candidate.submittal_ref}-{param}",
        project_id=project_id,
        equipment_tag=candidate.equipment_tag,
        parameter=param,
        submitted_value=candidate.submitted_value,
        unit=normalize_unit(candidate.unit),
        vendor=candidate.vendor,
        submittal_ref=candidate.submittal_ref,
        evidence=EvidenceCitation(
            source_document=document_id,
            source_page=1,
            extracted_text=candidate.source_sentence,
        ),
        extraction_confidence=candidate.confidence,
        provenance=Provenance.LLM,
    )
