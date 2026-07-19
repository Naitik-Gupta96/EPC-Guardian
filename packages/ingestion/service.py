from packages.ingestion.parsers import DocumentParser, StoredDocument
from packages.ingestion.extractors import StructuredExtractor
from packages.ingestion.cache import ExtractionCache


class IngestionService:
    def __init__(
        self,
        parser: DocumentParser,
        extractor: StructuredExtractor,
        cache: ExtractionCache | None = None,
    ):
        self.parser = parser
        self.extractor = extractor
        self.cache = cache

    async def process_document(self, document: StoredDocument) -> dict:
        blocks = await self.parser.parse(document)
        requirements = []
        submittal_values = []
        for block in blocks:
            classification = await self.extractor.classify_block(block)
            if classification.contains_requirement:
                candidates = await self.extractor.extract_requirements(block)
                for c in candidates:
                    from packages.ingestion.normalization import normalize_requirement
                    normalized = normalize_requirement(c, document.id, document.project_id)
                    if normalized:
                        requirements.append(normalized.model_dump())
            if classification.contains_submittal_value:
                candidates = await self.extractor.extract_submittal_values(block)
                for c in candidates:
                    from packages.ingestion.normalization import normalize_submittal
                    normalized = normalize_submittal(c, document.id, document.project_id)
                    if normalized:
                        submittal_values.append(normalized.model_dump())
        return {
            "document_id": document.id,
            "blocks": len(blocks),
            "requirements": requirements,
            "submittal_values": submittal_values,
        }
