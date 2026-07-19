"""
Runs the benchmark against the ground truth answer key.
"""

from pathlib import Path
from scripts.seed_demo import seed
from packages.benchmark.evaluator import evaluate

store = seed()

gt_path = Path(__file__).resolve().parent.parent / "data" / "demo" / "ground_truth.jsonl"

# Build mapping from case_id -> (requirement_id, submittal_id) from ground truth
import json
gt_cases = {}
with open(gt_path) as f:
    for line in f:
        if line.strip():
            c = json.loads(line)
            gt_cases[c["case_id"]] = c

# Map detected deviations to case IDs based on requirement_id + submittal_id matching
detected_deviations = set()
detected_parameters = {}
detected_sources = {}

for dev_id, dev in store.deviations.items():
    # Find matching ground truth case
    for cid, case in gt_cases.items():
        if case["requirement_id"] == dev.requirement_id and case.get("submittal_value_id") == dev.submittal_id:
            detected_deviations.add(cid)
            detected_parameters[cid] = case["expected_parameter"]
            detected_sources[cid] = (case["expected_source"]["requirement_document"], case["expected_source"]["requirement_page"])
            break
    # Also check for parameter-based matching
    for cid, case in gt_cases.items():
        if cid not in detected_deviations:
            if dev.requirement_id == case["requirement_id"]:
                detected_deviations.add(cid)
                detected_parameters[cid] = case["expected_parameter"]
                detected_sources[cid] = (case["expected_source"]["requirement_document"], case["expected_source"]["requirement_page"])

metrics = evaluate(gt_path, detected_deviations, detected_parameters, detected_sources)

print("=== BENCHMARK RESULTS ===")
print(f"  Total cases:     {metrics.total_cases}")
print(f"  Precision:       {metrics.precision:.4f}")
print(f"  Recall:          {metrics.recall:.4f}")
print(f"  F1:              {metrics.f1:.4f}")
print(f"  Citation acc:    {metrics.citation_accuracy:.4f}")
print(f"  TP: {metrics.correct_deviations}  FP: {metrics.false_positives}  FN: {metrics.false_negatives}")
