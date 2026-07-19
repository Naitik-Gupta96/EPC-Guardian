import pytest
from packages.domain.models import ScheduleActivity, Deviation
from packages.domain.enums import Severity
from packages.scheduling.cpm import compute_critical_path
from packages.scheduling.validation import validate_schedule
from packages.scheduling.scenarios import simulate_deviation_impact


def make_activities():
    return [
        ScheduleActivity(id="A-100", project_id="P1", description="Start", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-200", project_id="P1", description="Middle", predecessors=["A-100"], duration_days=10),
        ScheduleActivity(id="A-300", project_id="P1", description="End", predecessors=["A-200"], duration_days=3),
    ]


def test_simple_chain():
    acts = make_activities()
    result = compute_critical_path(acts)
    assert result["duration_days"] == 18
    assert result["critical_path"] == ["A-100", "A-200", "A-300"]


def test_parallel_paths():
    acts = [
        ScheduleActivity(id="A-100", project_id="P1", description="Start", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-200", project_id="P1", description="Path A", predecessors=["A-100"], duration_days=20),
        ScheduleActivity(id="A-210", project_id="P1", description="Path B", predecessors=["A-100"], duration_days=15),
        ScheduleActivity(id="A-300", project_id="P1", description="End", predecessors=["A-200", "A-210"], duration_days=3),
    ]
    result = compute_critical_path(acts)
    assert result["duration_days"] == 28
    assert "A-200" in result["critical_path"]


def test_non_critical_delay():
    acts = [
        ScheduleActivity(id="A-100", project_id="P1", description="Start", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-200", project_id="P1", description="Fast", predecessors=["A-100"], duration_days=5),
        ScheduleActivity(id="A-210", project_id="P1", description="Slow", predecessors=["A-100"], duration_days=20),
        ScheduleActivity(id="A-300", project_id="P1", description="End", predecessors=["A-210"], duration_days=3),
    ]
    result = compute_critical_path(acts)
    assert result["duration_days"] == 28
    assert result["float_by_activity"]["A-200"] == 18


def test_float_calculation():
    acts = make_activities()
    result = compute_critical_path(acts)
    for a_id in ["A-100", "A-200", "A-300"]:
        assert result["float_by_activity"][a_id] == 0


def test_validate_schedule_ok():
    acts = make_activities()
    validate_schedule(acts)


def test_validate_schedule_duplicate():
    acts = [
        ScheduleActivity(id="A-100", project_id="P1", description="A", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-100", project_id="P1", description="B", predecessors=[], duration_days=5),
    ]
    with pytest.raises(Exception):
        validate_schedule(acts)


def test_scenario_non_critical_delay():
    acts = [
        ScheduleActivity(id="A-100", project_id="P1", description="Start", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-200", project_id="P1", description="Float", predecessors=["A-100"], duration_days=5),
        ScheduleActivity(id="A-210", project_id="P1", description="Critical", predecessors=["A-100"], duration_days=20),
        ScheduleActivity(id="A-300", project_id="P1", description="End", predecessors=["A-210"], duration_days=3),
    ]
    dev = Deviation(
        id="DEV-TEST", project_id="P1",
        requirement_id="R1", submittal_id="S1",
        status="open", delta=0, severity=Severity.MAJOR,
        affected_activity_ids=["A-200"],
        affected_test_ids=[], generated_at="now",
    )
    result = simulate_deviation_impact(dev, acts, extra_delay_days=10)
    assert result.project_delta_days == 0


def test_scenario_critical_delay():
    acts = [
        ScheduleActivity(id="A-100", project_id="P1", description="Start", predecessors=[], duration_days=5),
        ScheduleActivity(id="A-200", project_id="P1", description="Critical", predecessors=["A-100"], duration_days=10),
        ScheduleActivity(id="A-300", project_id="P1", description="End", predecessors=["A-200"], duration_days=3),
    ]
    dev = Deviation(
        id="DEV-TEST", project_id="P1",
        requirement_id="R1", submittal_id="S1",
        status="open", delta=0, severity=Severity.CRITICAL,
        affected_activity_ids=["A-200"],
        affected_test_ids=[], generated_at="now",
    )
    result = simulate_deviation_impact(dev, acts, extra_delay_days=5)
    assert result.project_delta_days == 5
