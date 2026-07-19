from packages.graph.interface import ImpactGraphRepository, ImpactGraph, ImpactGraphNode, ImpactGraphEdge
from packages.domain.identifiers import (
    REQUIREMENT_UPS_AUTONOMY, EQUIP_UPS_A, PO_441, MS_UPS_A_DELIVERY,
    ACTIVITY_FAT, ACTIVITY_INSTALL, TEST_IST, DEV_UPS_001, SUB_VS019_AUTONOMY,
)


class InMemoryImpactGraphRepository(ImpactGraphRepository):
    def __init__(self):
        self._data: dict[str, ImpactGraph] = {}
        self._build_flagship()

    def _build_flagship(self):
        nodes = [
            ImpactGraphNode(id=REQUIREMENT_UPS_AUTONOMY, type="requirement", label=">= 15 min autonomy", status="violated", evidence_id="EVID-REQ-UPS-001"),
            ImpactGraphNode(id=SUB_VS019_AUTONOMY, type="submittal", label="10 min autonomy", status="reviewed", evidence_id="EVID-SUB-VS-019"),
            ImpactGraphNode(id=EQUIP_UPS_A, type="equipment", label="UPS-A", status="affected"),
            ImpactGraphNode(id=PO_441, type="purchase_order", label="PO-441", status="delayed"),
            ImpactGraphNode(id=MS_UPS_A_DELIVERY, type="milestone", label="UPS-A Delivery", status="at_risk"),
            ImpactGraphNode(id=ACTIVITY_FAT, type="activity", label="UPS-A FAT (A-2190)", status="at_risk"),
            ImpactGraphNode(id=ACTIVITY_INSTALL, type="activity", label="UPS-A Installation (A-2210)", status="at_risk"),
            ImpactGraphNode(id=TEST_IST, type="test", label="Integrated Systems Test - UPS-A", status="at_risk"),
        ]
        edges = [
            ImpactGraphEdge(id=f"{REQUIREMENT_UPS_AUTONOMY}__{EQUIP_UPS_A}", source=REQUIREMENT_UPS_AUTONOMY, target=EQUIP_UPS_A, type="SPECIFIES", label="specifies"),
            ImpactGraphEdge(id=f"{SUB_VS019_AUTONOMY}__{EQUIP_UPS_A}", source=SUB_VS019_AUTONOMY, target=EQUIP_UPS_A, type="SUBMITTED_FOR", label="submitted for"),
            ImpactGraphEdge(id=f"{DEV_UPS_001}__{REQUIREMENT_UPS_AUTONOMY}", source=DEV_UPS_001, target=REQUIREMENT_UPS_AUTONOMY, type="VIOLATES", label="violates"),
            ImpactGraphEdge(id=f"{EQUIP_UPS_A}__{PO_441}", source=EQUIP_UPS_A, target=PO_441, type="PROCURED_VIA", label="procured via"),
            ImpactGraphEdge(id=f"{PO_441}__{MS_UPS_A_DELIVERY}", source=PO_441, target=MS_UPS_A_DELIVERY, type="DELIVERS_TO", label="delivers to"),
            ImpactGraphEdge(id=f"{MS_UPS_A_DELIVERY}__{ACTIVITY_FAT}", source=MS_UPS_A_DELIVERY, target=ACTIVITY_FAT, type="GATES", label="gates"),
            ImpactGraphEdge(id=f"{ACTIVITY_FAT}__{ACTIVITY_INSTALL}", source=ACTIVITY_FAT, target=ACTIVITY_INSTALL, type="PRECEDES", label="precedes"),
            ImpactGraphEdge(id=f"{ACTIVITY_INSTALL}__{TEST_IST}", source=ACTIVITY_INSTALL, target=TEST_IST, type="VALIDATED_BY", label="validated by"),
        ]
        summary = {
            "equipment_count": 1,
            "purchase_order_count": 1,
            "affected_activity_count": 2,
            "affected_test_count": 1,
        }
        self._data[DEV_UPS_001] = ImpactGraph(deviation_id=DEV_UPS_001, nodes=nodes, edges=edges, summary=summary)

    async def rebuild_project(self, project_id: str) -> None:
        pass

    async def upsert_deviation(self, deviation_id: str) -> None:
        pass

    async def get_blast_radius(self, deviation_id: str) -> ImpactGraph:
        return self._data.get(deviation_id, ImpactGraph(deviation_id=deviation_id, nodes=[], edges=[]))
