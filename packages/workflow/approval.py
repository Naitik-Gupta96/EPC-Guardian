from datetime import datetime, timezone


class ApprovalGate:
    def __init__(self):
        self._approved: dict[str, bool] = {}
        self._versions: dict[str, int] = {}

    def approve(self, workflow_id: str, by: str, current_version: int) -> bool:
        if self._versions.get(workflow_id, 0) != current_version:
            return False
        self._approved[workflow_id] = True
        self._versions[workflow_id] = current_version + 1
        return True

    def reject(self, workflow_id: str) -> None:
        self._approved[workflow_id] = False
