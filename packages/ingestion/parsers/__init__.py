from typing import Protocol
from pydantic import BaseModel
from datetime import datetime


class DocumentBlock(BaseModel):
    block_id: str
    document_id: str
    project_id: str
    page_number: int
    sheet_ref: str | None = None
    block_type: str = "paragraph"
    text: str = ""
    table_cells: list[list[str]] = []
    bbox: tuple[float, float, float, float] | None = None
    parser_confidence: float = 1.0
    parser_name: str = ""


class StoredDocument(BaseModel):
    id: str
    project_id: str
    filename: str
    document_type: str
    file_path: str
    file_hash: str
    upload_time: datetime | None = None
    parse_status: str = "uploaded"


class DocumentParser(Protocol):
    async def parse(self, document: StoredDocument) -> list[DocumentBlock]:
        ...
