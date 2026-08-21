# risk_agent.py: Geopolitical Risk Intelligence Agent
from datetime import datetime, timezone
from typing import List
from app.models.schemas import CorridorRisk, SupplierRisk, GeopoliticalRiskReport
from app.data.seed_data import INITIAL_CORRIDORS, INITIAL_SUPPLIERS

class GeopoliticalRiskAgent:
    def __init__(self):
        self.corridors = [CorridorRisk(**c) for c in INITIAL_CORRIDORS]
        self.suppliers = [SupplierRisk(**s) for s in INITIAL_SUPPLIERS]

    def get_latest_risk_report(self) -> GeopoliticalRiskReport:
        weighted_corridor_risk = sum(c.risk_score * (0.45 if c.code == 'HORMUZ' else 0.3 if c.code == 'RED_SEA' else 0.15) for c in self.corridors)
        
        top_threats = (
            "CRITICAL WARNING: Strait of Hormuz threat score elevated due to US-Iran standoff. "
            "Red Sea attacks continue forcing Cape diversions (+16 days). "
            "India's 88% crude import dependency is exposed with 9.5-day ISPRL buffer."
        )

        return GeopoliticalRiskReport(
            timestamp=datetime.now(timezone.utc).isoformat(),
            national_energy_risk_index=round(weighted_corridor_risk, 1),
            corridors=self.corridors,
            suppliers=self.suppliers,
            top_threat_summary=top_threats
        )

    def update_corridor_risk(self, corridor_code: str, new_risk_score: float, threat_desc: str = None) -> CorridorRisk:
        for c in self.corridors:
            if c.code == corridor_code:
                c.risk_score = min(100.0, max(0.0, new_risk_score))
                if c.risk_score >= 85.0:
                    c.status = "IMPASSABLE"
                elif c.risk_score >= 60.0:
                    c.status = "HIGH_RISK"
                elif c.risk_score >= 35.0:
                    c.status = "ELEVATED"
                else:
                    c.status = "NORMAL"
                if threat_desc:
                    c.threat_description = threat_desc
                return c
        raise ValueError(f"Corridor code {corridor_code} not found.")

risk_agent_service = GeopoliticalRiskAgent()
