from datetime import datetime, timezone
from typing import Any


class AuditEvent:
    def __init__(
        self,
        action: str,
        actor: str,
        project_id: str,
        object_id: str = "",
        details: dict[str, Any] | None = None,
    ):
        self.timestamp = datetime.now(timezone.utc).isoformat()
        self.action = action
        self.actor = actor
        self.project_id = project_id
        self.object_id = object_id
        self.details = details or {}

    def to_dict(self) -> dict:
        return {
            "timestamp": self.timestamp,
            "action": self.action,
            "actor": self.actor,
            "project_id": self.project_id,
            "object_id": self.object_id,
            "details": self.details,
        }


class AuditLedger:
    def __init__(self):
        self._events: list[AuditEvent] = []

    def record(self, event: AuditEvent) -> None:
        self._events.append(event)

    def list(self, project_id: str | None = None) -> list[dict]:
        if project_id:
            return [e.to_dict() for e in self._events if e.project_id == project_id]
        return [e.to_dict() for e in self._events]
