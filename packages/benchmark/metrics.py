from pydantic import BaseModel


class BenchmarkMetrics(BaseModel):
    precision: float
    recall: float
    f1: float
    citation_accuracy: float
    exact_extraction: float
    total_cases: int
    correct_deviations: int
    false_positives: int
    false_negatives: int
    unsupported_verified: int
    category_breakdown: dict[str, dict] = {}
