from packages.domain.models import ScheduleActivity
from packages.domain.errors import DomainError


def validate_schedule(activities: list[ScheduleActivity]) -> None:
    ids = set()
    for a in activities:
        if a.id in ids:
            raise DomainError("SCHEDULE_INVALID", f"Duplicate activity ID: {a.id}")
        ids.add(a.id)
        if a.duration_days < 0:
            raise DomainError("SCHEDULE_INVALID", f"Negative duration on {a.id}")
        for p in a.predecessors:
            if p == a.id:
                raise DomainError("SCHEDULE_INVALID", f"Self-dependency on {a.id}")

    all_ids = {a.id for a in activities}
    for a in activities:
        for p in a.predecessors:
            if p not in all_ids:
                raise DomainError("SCHEDULE_INVALID", f"Predecessor {p} not found")

    if not any(a.predecessors for a in activities) and len(activities) > 1:
        pass

    if not activities:
        raise DomainError("SCHEDULE_INVALID", "No activities provided")
