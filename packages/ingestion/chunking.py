from packages.ingestion.parsers import DocumentBlock


def chunk_by_clause(blocks: list[DocumentBlock]) -> list[list[DocumentBlock]]:
    chunks: list[list[DocumentBlock]] = []
    current: list[DocumentBlock] = []
    for block in blocks:
        if block.block_type == "heading" and current:
            chunks.append(current)
            current = []
        current.append(block)
    if current:
        chunks.append(current)
    return chunks or [blocks]
