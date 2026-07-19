import pint

ureg = pint.UnitRegistry()
ureg.define("percent = 0.01 = %")


def normalize_unit(unit: str) -> str:
    try:
        return str(ureg(unit).units)
    except Exception:
        return unit.lower()


def convert(value: float, from_unit: str, to_unit: str) -> float:
    return (value * ureg(from_unit)).to(to_unit).magnitude
