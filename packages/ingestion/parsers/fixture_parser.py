from packages.ingestion.parsers import DocumentParser, StoredDocument, DocumentBlock


class FixtureParser:
    async def parse(self, document: StoredDocument) -> list[DocumentBlock]:
        return [
            DocumentBlock(
                block_id=f"BLK-{document.id}-001",
                document_id=document.id,
                project_id=document.project_id,
                page_number=1,
                block_type="fixture",
                text=f"Fixture data for {document.filename}",
                parser_confidence=1.0,
                parser_name="fixture",
            )
        ]
