from packages.domain.enums import Comparator

OPS = {
    Comparator.GTE: lambda a, b: a >= b,
    Comparator.LTE: lambda a, b: a <= b,
    Comparator.EQ: lambda a, b: abs(a - b) < 1e-9,
    Comparator.NEQ: lambda a, b: abs(a - b) >= 1e-9,
    Comparator.GT: lambda a, b: a > b,
    Comparator.LT: lambda a, b: a < b,
}


def compare(a: float, op: Comparator, b: float) -> bool:
    return OPS[op](a, b)
