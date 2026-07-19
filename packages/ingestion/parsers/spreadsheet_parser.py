import pandas as pd
from pathlib import Path
from packages.ingestion.parsers import DocumentParser, StoredDocument, DocumentBlock


class SpreadsheetParser:
    async def parse(self, document: StoredDocument) -> list[DocumentBlock]:
        path = Path(document.file_path)
        if not path.exists():
            return []
        blocks = []
        try:
            xls = pd.ExcelFile(path)
            for sheet_idx, sheet_name in enumerate(xls.sheet_names):
                df = pd.read_excel(path, sheet_name=sheet_name, header=None)
                for row_idx, row in df.iterrows():
                    cells = [str(c) if pd.notna(c) else "" for c in row]
                    block_id = f"BLK-{document.id}-S{sheet_idx}-R{row_idx}"
                    blocks.append(
                        DocumentBlock(
                            block_id=block_id,
                            document_id=document.id,
                            project_id=document.project_id,
                            page_number=sheet_idx + 1,
                            sheet_ref=sheet_name,
                            block_type="row",
                            text=" | ".join(cells),
                            table_cells=[cells],
                            parser_confidence=0.95,
                            parser_name="spreadsheet",
                        )
                    )
        except Exception:
            pass
        return blocks
