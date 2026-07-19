import networkx as nx

from packages.domain.models import ScheduleActivity


def compute_critical_path(activities: list[ScheduleActivity]) -> dict:
    g = nx.DiGraph()
    for a in activities:
        g.add_node(a.id, duration=a.duration_days)
        for p in a.predecessors:
            g.add_edge(p, a.id)

    order = list(nx.topological_sort(g))

    early_finish: dict[str, int] = {}
    for node in order:
        preds = list(g.predecessors(node))
        early_start = max((early_finish[p] for p in preds), default=0)
        early_finish[node] = early_start + g.nodes[node]["duration"]

    project_duration = max(early_finish.values()) if early_finish else 0

    late_finish: dict[str, int] = {}
    for node in reversed(order):
        succs = list(g.successors(node))
        if not succs:
            late_finish[node] = project_duration
        else:
            late_finish[node] = min(late_finish[s] - g.nodes[s]["duration"] for s in succs)

    late_start = {n: late_finish[n] - g.nodes[n]["duration"] for n in order}
    total_float = {n: late_start[n] - (early_finish[n] - g.nodes[n]["duration"]) for n in order}
    critical_path = sorted(n for n in order if abs(total_float[n]) < 1e-9)

    return {
        "duration_days": project_duration,
        "critical_path": critical_path,
        "float_by_activity": total_float,
    }
