from packages.domain.models import ScheduleActivity, Deviation, ScenarioResult
from packages.scheduling.cpm import compute_critical_path


def simulate_deviation_impact(
    deviation: Deviation, activities: list[ScheduleActivity], extra_delay_days: int
) -> ScenarioResult:
    baseline = compute_critical_path(activities)

    patched = [
        ScheduleActivity(
            id=a.id,
            project_id=a.project_id,
            description=a.description,
            predecessors=list(a.predecessors),
            duration_days=a.duration_days + extra_delay_days if a.id in deviation.affected_activity_ids else a.duration_days,
            total_float_days=a.total_float_days,
            linked_equipment_tags=list(a.linked_equipment_tags),
        )
        for a in activities
    ]

    impacted = compute_critical_path(patched)

    baseline_cp = set(baseline["critical_path"])
    impacted_cp = set(impacted["critical_path"])
    newly_critical = sorted(impacted_cp - baseline_cp)

    return ScenarioResult(
        baseline_duration_days=baseline["duration_days"],
        impacted_duration_days=impacted["duration_days"],
        project_delta_days=impacted["duration_days"] - baseline["duration_days"],
        baseline_critical_path=baseline["critical_path"],
        impacted_critical_path=impacted["critical_path"],
        newly_critical_activities=newly_critical,
        float_by_activity=impacted["float_by_activity"],
        scenario_inputs={"deviation_id": deviation.id, "extra_delay_days": extra_delay_days, "option": ""},
        calculation_version="cpm-v1",
    )
