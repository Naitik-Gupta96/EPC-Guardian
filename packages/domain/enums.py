from enum import Enum


class Comparator(str, Enum):
    GTE = ">="
    LTE = "<="
    EQ = "=="
    NEQ = "!="
    GT = ">"
    LT = "<"


class DeviationStatus(str, Enum):
    OPEN = "open"
    MITIGATED = "mitigated"
    ACCEPTED_RISK = "accepted-risk"
    CLOSED = "closed"


class Severity(str, Enum):
    CRITICAL = "critical"
    MAJOR = "major"
    MINOR = "minor"


class CorrectiveActionKind(str, Enum):
    RFI = "RFI"
    NCR = "NCR"
    RISK_REGISTER = "RISK_REGISTER"
    TASK = "TASK"


class Provenance(str, Enum):
    FIXTURE = "fixture"
    PARSER = "parser"
    LLM = "llm"
    HUMAN = "human"
    COMPUTED = "computed"


class DecisionPath(str, Enum):
    DETERMINISTIC_NUMERIC = "deterministic_numeric"
    DETERMINISTIC_ENUM = "deterministic_enum"
    MISSING_EVIDENCE = "missing_required_evidence"
    SEMANTIC_REVIEW = "semantic_review"
    UNMATCHED = "unmatched"
