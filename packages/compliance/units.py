import pint

ureg = pint.UnitRegistry()
ureg.define("percent = 0.01 = %")
ureg.define("boolean = []")
ureg.define("N = []")
ureg.define("date = []")


def normalize_unit(unit: str) -> str:
    try:
        return str(ureg(unit).units)
    except Exception:
        return unit.lower()


def convert(value: float, from_unit: str, to_unit: str) -> float:
    from_u = from_unit.lower()
    to_u = to_unit.lower()

    if from_u in ("celsius", "degc", "degree_celsius") and to_u in ("celsius", "degc", "degree_celsius"):
        return value

    try:
        q = value * ureg(from_unit)
        return q.to(to_unit).magnitude
    except pint.errors.OffsetUnitCalculusError:
        q = value * ureg(f"delta_{from_unit}")
        return q.to(f"delta_{to_unit}").magnitude
    except Exception:
        return value
