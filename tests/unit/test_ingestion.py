import pytest
from packages.ingestion.parsers import StoredDocument, DocumentBlock
from packages.ingestion.parsers.fixture_parser import FixtureParser
from packages.ingestion.parsers.spreadsheet_parser import SpreadsheetParser
from packages.ingestion.chunking import chunk_by_clause
from packages.ingestion.normalization import normalize_requirement, normalize_submittal
from packages.ingestion.extractors import RequirementCandidate, SubmittalValueCandidate


async def test_fixture_parser():
    parser = FixtureParser()
    doc = StoredDocument(id="DOC-TEST", project_id="P1", filename="test.pdf",
                         document_type="specification", file_path="/tmp/test.pdf",
                         file_hash="abc")
    blocks = await parser.parse(doc)
    assert len(blocks) == 1
    assert blocks[0].parser_name == "fixture"


async def test_chunk_by_clause():
    blocks = [
        DocumentBlock(block_id="1", document_id="D1", project_id="P1", page_number=1,
                     block_type="heading", text="Section 1"),
        DocumentBlock(block_id="2", document_id="D1", project_id="P1", page_number=1,
                     block_type="paragraph", text="Content 1"),
        DocumentBlock(block_id="3", document_id="D1", project_id="P1", page_number=1,
                     block_type="heading", text="Section 2"),
        DocumentBlock(block_id="4", document_id="D1", project_id="P1", page_number=1,
                     block_type="paragraph", text="Content 2"),
    ]
    chunks = chunk_by_clause(blocks)
    assert len(chunks) == 2


def test_normalize_requirement_ok():
    cand = RequirementCandidate(
        asset_type="UPS", equipment_tag="UPS-A", parameter="autonomy",
        operator=">=", value=15.0, unit="minutes", scope="all UPS strings",
        source_sentence="Not less than 15 minutes of autonomy.",
        confidence=0.95,
    )
    req = normalize_requirement(cand, "DOC-SPEC", "P1")
    assert req is not None
    assert req.value == 15.0
    assert req.operator.value == ">="
    assert req.parameter == "autonomy_at_rated_load"


def test_normalize_requirement_unmapped():
    cand = RequirementCandidate(
        asset_type="UPS", equipment_tag="UPS-A", parameter="unknown_parameter",
        operator=">=", value=10.0, unit="units", scope="",
        source_sentence="Test.", confidence=0.5,
    )
    req = normalize_requirement(cand, "DOC-SPEC", "P1")
    assert req is None


def test_normalize_submittal_ok():
    cand = SubmittalValueCandidate(
        equipment_tag="UPS-A", parameter="battery runtime",
        submitted_value=10.0, unit="minutes", vendor="Test Vendor",
        submittal_ref="VS-001",
        source_sentence="Battery runtime: 10 minutes.",
        confidence=0.96,
    )
    sub = normalize_submittal(cand, "DOC-SUB", "P1")
    assert sub is not None
    assert sub.submitted_value == 10.0
    assert sub.parameter == "autonomy_at_rated_load"
