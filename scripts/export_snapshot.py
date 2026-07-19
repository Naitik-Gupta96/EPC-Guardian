"""
Exports the current demo database snapshot to a portable JSON file.
"""

import json
from pathlib import Path
from scripts.seed_demo import seed

store = seed()
output = Path(__file__).resolve().parent.parent / "data" / "demo" / "snapshot.json"

snapshot = {
    "project": store.project,
    "requirements": {k: v.model_dump() for k, v in store.requirements.items()},
    "submittals": {k: v.model_dump() for k, v in store.submittals.items()},
    "equipment": {k: v.model_dump() for k, v in store.equipment.items()},
    "purchase_orders": {k: v.model_dump() for k, v in store.purchase_orders.items()},
    "activities": {k: v.model_dump() for k, v in store.activities.items()},
    "tests": {k: v.model_dump() for k, v in store.tests.items()},
    "deviations": {k: v.model_dump() for k, v in store.deviations.items()},
}

with open(output, "w") as f:
    json.dump(snapshot, f, indent=2, default=str)

print(f"Snapshot exported to {output}")
print(f"  {len(snapshot['requirements'])} requirements")
print(f"  {len(snapshot['submittals'])} submittals")
print(f"  {len(snapshot['deviations'])} deviations")
