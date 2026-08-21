# digital_twin.py: Supply Chain Digital Twin Service
import networkx as nx
from datetime import datetime, timezone
from app.models.schemas import NetworkNode, NetworkEdge, EnergyDigitalTwinState
from app.data.seed_data import INITIAL_NODES, INITIAL_EDGES, INITIAL_ISPRL_CAVERNS

class EnergyDigitalTwinService:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.nodes = [NetworkNode(**n) for n in INITIAL_NODES]
        self.edges = [NetworkEdge(**e) for e in INITIAL_EDGES]
        self.caverns = INITIAL_ISPRL_CAVERNS
        self._build_graph()

    def _build_graph(self):
        self.graph.clear()
        for node in self.nodes:
            self.graph.add_node(node.id, **node.model_dump())
        for edge in self.edges:
            self.graph.add_edge(edge.source_id, edge.target_id, **edge.model_dump())

    def get_current_twin_state(self) -> EnergyDigitalTwinState:
        total_vessels = sum(1 for n in self.nodes if n.node_type == "TANKER")
        total_at_sea = sum(n.current_volume_mbbl for n in self.nodes if n.node_type in ["TANKER", "PORT_SPM"])
        total_spr = sum(c["current_stock_mbbl"] for c in self.caverns.values())
        # India daily import ~4.12M bpd
        days_of_cover = total_spr / 4.12

        return EnergyDigitalTwinState(
            timestamp=datetime.now(timezone.utc).isoformat(),
            nodes=self.nodes,
            edges=self.edges,
            total_vessels_in_transit=total_vessels,
            total_crude_at_sea_mbbl=round(total_at_sea, 2),
            isprl_total_reserve_mbbl=round(total_spr, 2),
            isprl_days_of_cover=round(days_of_cover, 1)
        )

digital_twin_service = EnergyDigitalTwinService()
