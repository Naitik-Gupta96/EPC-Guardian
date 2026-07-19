PARAMETER_ALIASES: dict[str, list[str]] = {
    "autonomy_at_rated_load": ["autonomy", "backup duration", "battery runtime", "full-load runtime"],
    "rated_capacity": ["kva rating", "power capacity", "nominal capacity"],
    "input_voltage": ["supply voltage", "input v"],
    "output_voltage": ["output v"],
    "efficiency_at_full_load": ["full-load efficiency", "efficiency 100% load"],
    "redundancy_configuration": ["redundancy", "n+1", "2n", "topology"],
    "battery_type": ["battery chemistry", "cell type"],
    "operating_temperature_max": ["maximum ambient", "max operating temperature"],
}


def canonical_parameter(param: str) -> str:
    lower = param.lower().strip()
    for canonical, aliases in PARAMETER_ALIASES.items():
        if lower == canonical or lower in aliases:
            return canonical
    return "unmapped"
