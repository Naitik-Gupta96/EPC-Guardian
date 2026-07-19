"""
Smoke test for the flagship path.
Runs the full seeded chain: seed → compliance → graph → CPM → workflow.
"""

import asyncio

from scripts.seed_demo import seed

store = seed()

proj = store.project
assert proj["id"] == "DC-TIER3-DEMO-001"

req = store.requirements["REQ-UPS-001"]
assert req.value == 15.0 and req.unit == "minute"

sub = store.submittals["SUB-VS-019-AUTONOMY"]
assert sub.submitted_value == 10.0 and sub.unit == "minute"

dev = store.deviations["DEV-UPS-001"]
assert dev.delta == -5.0
assert dev.severity.value == "critical"
assert "A-2210" in dev.affected_activity_ids
assert "TEST-IST-UPS-A" in dev.affected_test_ids
assert dev.calculation == "10.0 >= 15.0 => false"

graph = asyncio.run(store.graph.get_blast_radius(dev.id))
assert len(graph.nodes) == 8
assert len(graph.edges) >= 8

activities = list(store.activities.values())
from packages.scheduling.cpm import compute_critical_path
result = compute_critical_path(activities)
assert result["duration_days"] > 0
assert len(result["critical_path"]) > 0

print("\n=== SMOKE TEST PASSED ===")
print(f"  Project: {proj['id']}")
print(f"  Deviation: {dev.id}")
print(f"  Delta: {dev.delta} {dev.normalized_unit}")
print(f"  Severity: {dev.severity}")
print(f"  Graph nodes: {len(graph.nodes)}, edges: {len(graph.edges)}")
print(f"  Baseline duration: {result['duration_days']} days")
print(f"  Critical path: {result['critical_path']}")
