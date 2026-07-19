from typing import Protocol
from pydantic import BaseModel


class BlockClassification(BaseModel):
    block_id: str
    contains_requirement: bool
    contains_submittal_value: bool
    confidence: float


class RequirementCandidate(BaseModel):
    asset_type: str
    equipment_tag: str | None = None
    parameter: str
    operator: str
    value: float
    unit: str
    scope: str
    source_sentence: str
    confidence: float


class SubmittalValueCandidate(BaseModel):
    equipment_tag: str
    parameter: str
    submitted_value: float
    unit: str
    vendor: str
    submittal_ref: str
    source_sentence: str
    confidence: float


class StructuredExtractor(Protocol):
    async def classify_block(self, block: "DocumentBlock") -> BlockClassification:
        ...

    async def extract_requirements(self, block: "DocumentBlock") -> list[RequirementCandidate]:
        ...

    async def extract_submittal_values(self, block: "DocumentBlock") -> list[SubmittalValueCandidate]:
        ...
