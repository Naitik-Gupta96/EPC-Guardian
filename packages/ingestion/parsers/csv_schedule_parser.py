import csv
from pathlib import Path
from packages.ingestion.parsers import DocumentParser, StoredDocument, DocumentBlock


class ScheduleCsvParser:
    async def parse(self, document: StoredDocument) -> list[DocumentBlock]:
        path = Path(document.file_path)
        if not path.exists():
            return []
        blocks = []
        try:
            with open(path, newline="") as f:
                reader = csv.reader(f)
                headers = next(reader, [])
                for row_idx, row in enumerate(reader):
                    block_id = f"BLK-{document.id}-R{row_idx}"
                    blocks.append(
                        DocumentBlock(
                            block_id=block_id,
                            document_id=document.id,
                            project_id=document.project_id,
                            page_number=1,
                            block_type="row",
                            text=" | ".join(row),
                            table_cells=[row],
                            parser_confidence=0.95,
                            parser_name="csv_schedule",
                        )
                    )
        except Exception:
            pass
        return blocks
