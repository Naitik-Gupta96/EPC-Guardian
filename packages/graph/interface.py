from abc import ABC, abstractmethod
from packages.domain.models import Deviation


class ImpactGraphNode:
    def __init__(self, id: str, type: str, label: str, status: str = "", evidence_id: str = ""):
        self.id = id
        self.type = type
        self.label = label
        self.status = status
        self.evidence_id = evidence_id


class ImpactGraphEdge:
    def __init__(self, id: str, source: str, target: str, type: str, label: str = ""):
        self.id = id
        self.source = source
        self.target = target
        self.type = type
        self.label = label


class ImpactGraph:
    def __init__(
        self,
        deviation_id: str,
        nodes: list[ImpactGraphNode],
        edges: list[ImpactGraphEdge],
        summary: dict | None = None,
    ):
        self.deviation_id = deviation_id
        self.nodes = nodes
        self.edges = edges
        self.summary = summary or {}


class ImpactGraphRepository(ABC):
    @abstractmethod
    async def rebuild_project(self, project_id: str) -> None: ...

    @abstractmethod
    async def upsert_deviation(self, deviation_id: str) -> None: ...

    @abstractmethod
    async def get_blast_radius(self, deviation_id: str) -> ImpactGraph: ...
