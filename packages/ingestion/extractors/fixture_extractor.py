from packages.ingestion.extractors import (
    StructuredExtractor, BlockClassification, RequirementCandidate, SubmittalValueCandidate,
)
from packages.ingestion.parsers import DocumentBlock


class FixtureExtractor:
    async def classify_block(self, block: DocumentBlock) -> BlockClassification:
        return BlockClassification(
            block_id=block.block_id,
            contains_requirement=False,
            contains_submittal_value=False,
            confidence=1.0,
        )

    async def extract_requirements(self, block: DocumentBlock) -> list[RequirementCandidate]:
        return []

    async def extract_submittal_values(self, block: DocumentBlock) -> list[SubmittalValueCandidate]:
        return []
