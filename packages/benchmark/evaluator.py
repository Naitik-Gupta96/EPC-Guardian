import json
from pathlib import Path
from packages.benchmark.metrics import BenchmarkMetrics


def load_ground_truth(path: Path) -> list[dict]:
    cases = []
    with open(path) as f:
        for line in f:
            if line.strip():
                cases.append(json.loads(line))
    return cases


def evaluate(
    ground_truth_path: Path,
    detected_deviations: set[str],
    detected_parameters: dict[str, str],
    detected_sources: dict[str, tuple[str, int]],
) -> BenchmarkMetrics:
    cases = load_ground_truth(ground_truth_path)

    tp = 0
    fp = 0
    fn = 0
    correct_citations = 0
    total_citable = 0
    correct_extractions = 0

    for case in cases:
        cid = case["case_id"]
        should_be_deviation = case["expected_is_deviation"]

        if should_be_deviation:
            if cid in detected_deviations:
                tp += 1
            else:
                fn += 1
        else:
            if cid in detected_deviations:
                fp += 1

        if should_be_deviation and cid in detected_parameters:
            extracted_param = detected_parameters.get(cid, "")
            if extracted_param == case["expected_parameter"]:
                correct_extractions += 1

        if should_be_deviation and cid in detected_sources:
            total_citable += 1
            src = detected_sources[cid]
            expected_src = case["expected_source"]
            if src[0] == expected_src["requirement_document"] or src[0] == expected_src["submittal_document"]:
                correct_citations += 1

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    citation_accuracy = correct_citations / total_citable if total_citable > 0 else 0.0
    exact_extraction = correct_extractions / (tp + fn) if (tp + fn) > 0 else 0.0

    return BenchmarkMetrics(
        precision=round(precision, 4),
        recall=round(recall, 4),
        f1=round(f1, 4),
        citation_accuracy=round(citation_accuracy, 4),
        exact_extraction=round(exact_extraction, 4),
        total_cases=len(cases),
        correct_deviations=tp,
        false_positives=fp,
        false_negatives=fn,
        unsupported_verified=0,
    )
