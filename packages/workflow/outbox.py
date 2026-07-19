from datetime import datetime, timezone
from typing import Any


class OutboxEntry:
    def __init__(self, workflow_id: str, kind: str, content: str, approved_by: str):
        self.id = f"OUT-{workflow_id}-{kind}"
        self.workflow_id = workflow_id
        self.kind = kind
        self.content = content
        self.approved_by = approved_by
        self.approved_at = datetime.now(timezone.utc).isoformat()
        self.status = "queued"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "workflow_id": self.workflow_id,
            "kind": self.kind,
            "approved_by": self.approved_by,
            "approved_at": self.approved_at,
            "status": self.status,
        }


class Outbox:
    def __init__(self):
        self._entries: list[OutboxEntry] = []

    def add(self, entry: OutboxEntry) -> None:
        self._entries.append(entry)

    def list(self) -> list[dict]:
        return [e.to_dict() for e in self._entries]
