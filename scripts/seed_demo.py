"""
Idempotent seed script for the demo project.
Loads normalized fixtures into the in-memory store and pre-computes the flagship deviation.
"""

import json
import os
from pathlib import Path

from packages.domain.models import (
    Requirement, VendorSubmittal, Equipment, PurchaseOrder,
    Milestone, ScheduleActivity, CommissioningTest, Deviation,
)
from packages.compliance.engine import check_compliance
from packages.graph.in_memory_repository import InMemoryImpactGraphRepository
from packages.scheduling.cpm import compute_critical_path
from packages.scheduling.validation import validate_schedule

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "demo" / "normalized"


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


class DemoStore:
    def __init__(self):
        self.project: dict = {}
        self.documents: list[dict] = []
        self.requirements: dict[str, Requirement] = {}
        self.submittals: dict[str, VendorSubmittal] = {}
        self.equipment: dict[str, Equipment] = {}
        self.purchase_orders: dict[str, PurchaseOrder] = {}
        self.milestones: dict[str, Milestone] = {}
        self.activities: dict[str, ScheduleActivity] = {}
        self.tests: dict[str, CommissioningTest] = {}
        self.deviations: dict[str, Deviation] = {}
        self.graph = InMemoryImpactGraphRepository()

    def load_all(self):
        with open(DATA_DIR / "project.json") as f:
            self.project = json.load(f)

        self.documents = json.loads((DATA_DIR / "documents.json").read_text())

        for d in load_jsonl(DATA_DIR / "requirements.jsonl"):
            r = Requirement(**d)
            self.requirements[r.id] = r

        for d in load_jsonl(DATA_DIR / "submittal_values.jsonl"):
            s = VendorSubmittal(**d)
            self.submittals[s.id] = s

        for d in load_jsonl(DATA_DIR / "equipment.jsonl"):
            e = Equipment(**d)
            self.equipment[e.tag] = e

        for d in load_jsonl(DATA_DIR / "purchase_orders.jsonl"):
            po = PurchaseOrder(**d)
            self.purchase_orders[po.id] = po

        for d in load_jsonl(DATA_DIR / "milestones.jsonl"):
            m = Milestone(**d)
            self.milestones[m.id] = m

        for d in load_jsonl(DATA_DIR / "activities.jsonl"):
            a = ScheduleActivity(**d)
            self.activities[a.id] = a

        for d in load_jsonl(DATA_DIR / "commissioning_tests.jsonl"):
            t = CommissioningTest(**d)
            self.tests[t.id] = t

    def run_compliance(self):
        for req_id, req in self.requirements.items():
            for sub_id, sub in self.submittals.items():
                if req.equipment_tag == sub.equipment_tag and req.parameter == sub.parameter:
                    dev = check_compliance(req, sub)
                    if dev is not None:
                        dev.id = "DEV-UPS-001"
                        activities = list(self.activities.values())
                        validate_schedule(activities)
                        baseline = compute_critical_path(activities)
                        affected = [
                            a_id for a_id, a in self.activities.items()
                            if req.equipment_tag in a.linked_equipment_tags
                        ]
                        dev.affected_activity_ids = affected
                        dev.affected_test_ids = [
                            t_id for t_id, t in self.tests.items()
                            if req.equipment_tag in t.depends_on_activities or any(
                                a in affected for a in t.depends_on_activities
                            )
                        ]
                        self.deviations[dev.id] = dev


store = DemoStore()


def seed():
    store.load_all()
    store.run_compliance()
    print(f"Seeded project: {store.project['id']}")
    print(f"  Requirements: {len(store.requirements)}")
    print(f"  Submittals: {len(store.submittals)}")
    print(f"  Equipment: {len(store.equipment)}")
    print(f"  Purchase Orders: {len(store.purchase_orders)}")
    print(f"  Activities: {len(store.activities)}")
    print(f"  Tests: {len(store.tests)}")
    print(f"  Deviations: {len(store.deviations)}")
    for dev_id, dev in store.deviations.items():
        print(f"    {dev_id}: delta={dev.delta} {dev.normalized_unit}, severity={dev.severity}")
    return store


if __name__ == "__main__":
    seed()
