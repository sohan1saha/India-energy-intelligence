# digital_twin.py: Supply Chain Digital Twin Service
import networkx as nx
import time
import math
from datetime import datetime, timezone
from typing import List, Dict, Any
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

    def get_live_vessels_telemetry(self) -> List[Dict[str, Any]]:
        # Calculate real-time AIS drift movement based on current epoch seconds
        t = time.time() / 10.0  # Smooth drift factor
        
        # Desh Vishal drift (Gulf of Oman -> Vadinar)
        desh_lat = 24.50 + math.sin(t * 0.1) * 0.15
        desh_lng = 58.20 + math.cos(t * 0.1) * 0.25

        # Swarna Kamal drift (Arabian Sea -> Mangalore)
        swarna_lat = 15.10 + math.cos(t * 0.12) * 0.20
        swarna_lng = 71.40 + math.sin(t * 0.12) * 0.20

        # Ratna Shalini drift (Bay of Bengal -> Paradip)
        ratna_lat = 11.50 + math.sin(t * 0.08) * 0.25
        ratna_lng = 84.20 + math.cos(t * 0.08) * 0.15

        return [
            {
                "id": "vessel_1",
                "mmsi": 419001234,
                "imo": 9834211,
                "name": "VLCC Desh Vishal",
                "flag": "India (SCI)",
                "lat": round(desh_lat, 4),
                "lng": round(desh_lng, 4),
                "speed_knots": 14.5,
                "heading_deg": 124,
                "status": "UNDERWAY_USING_ENGINE",
                "cargo_grade": "Basrah Heavy",
                "cargo_volume_mbbl": 2.0,
                "origin_port": "Fujairah ADCOP Terminal (UAE)",
                "destination_port": "Vadinar SPM (Gujarat)",
                "eta": "2026-08-24T06:00:00Z"
            },
            {
                "id": "vessel_2",
                "mmsi": 419005678,
                "imo": 9712090,
                "name": "VLCC Swarna Kamal",
                "flag": "India (SCI)",
                "lat": round(swarna_lat, 4),
                "lng": round(swarna_lng, 4),
                "speed_knots": 13.8,
                "heading_deg": 142,
                "status": "UNDERWAY_USING_ENGINE",
                "cargo_grade": "Murban Sweet",
                "cargo_volume_mbbl": 2.0,
                "origin_port": "Fujairah ADCOP Terminal (UAE)",
                "destination_port": "Mangalore SPM / MRPL",
                "eta": "2026-08-25T14:30:00Z"
            },
            {
                "id": "vessel_3",
                "mmsi": 419009876,
                "imo": 9904321,
                "name": "VLCC Ratna Shalini",
                "flag": "India (Great Eastern)",
                "lat": round(ratna_lat, 4),
                "lng": round(ratna_lng, 4),
                "speed_knots": 15.1,
                "heading_deg": 22,
                "status": "UNDERWAY_USING_ENGINE",
                "cargo_grade": "WTI Midland",
                "cargo_volume_mbbl": 1.9,
                "origin_port": "Enterprise US Gulf Terminal",
                "destination_port": "Paradip SPM (Odisha)",
                "eta": "2026-08-26T18:00:00Z"
            }
        ]

    def get_current_twin_state(self) -> EnergyDigitalTwinState:
        total_vessels = sum(1 for n in self.nodes if n.node_type == "TANKER")
        total_at_sea = sum(n.current_volume_mbbl for n in self.nodes if n.node_type in ["TANKER", "PORT_SPM"])
        total_spr = sum(c["current_stock_mbbl"] for c in self.caverns.values())
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
