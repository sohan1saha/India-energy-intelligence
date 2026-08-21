# copilot_agent.py: AI Energy Security Copilot
from typing import Dict, Any
from app.services.risk_agent import risk_agent_service
from app.services.digital_twin import digital_twin_service
from app.services.disruption_modeller import disruption_modeller_service
from app.services.spr_optimizer import spr_optimizer_service
from app.services.procurement_orchestrator import procurement_orchestrator_service
from app.models.schemas import DisruptionScenarioRequest, SPROptimizationRequest, ProcurementReroutingRequest

class EnergyCopilotAgent:
    def process_query(self, query: str) -> Dict[str, Any]:
        query_lower = query.lower()

        # Check intent
        if "risk" in query_lower or "hormuz" in query_lower or "red sea" in query_lower or "threat" in query_lower:
            report = risk_agent_service.get_latest_risk_report()
            answer = (
                f"🛡️ **National Energy Risk Report (Index: {report.national_energy_risk_index}/100)**:\n\n"
                f"• **Strait of Hormuz**: Threat Score {report.corridors[0].risk_score}/100 ({report.corridors[0].status}). {report.corridors[0].threat_description}\n"
                f"• **Red Sea / Bab-el-Mandeb**: Threat Score {report.corridors[1].risk_score}/100 ({report.corridors[1].status}). Cape diversion (+16 days) active.\n"
                f"• **National Buffer**: ISPRL caverns hold 39.1M bbls (~9.5 days of national consumption).\n\n"
                f"**Recommendation**: Initiate ADCOP Fujairah bypass routing and monitor Padur SPR readiness."
            )
            return {"query": query, "intent": "risk_assessment", "response": answer, "data": report.dict()}

        elif "simulate" in query_lower or "blockade" in query_lower or "impact" in query_lower or "gdp" in query_lower or "price" in query_lower:
            # Default simulation trigger
            res = disruption_modeller_service.simulate_scenario(DisruptionScenarioRequest(
                scenario_name="Hormuz Blockade Simulation",
                hormuz_blockade_pct=80.0,
                red_sea_blockade_pct=50.0,
                duration_days=30
            ))
            answer = (
                f"🚨 **Disruption Simulation Results (80% Hormuz Blockade)**:\n\n"
                f"• **Daily Supply Deficit**: {res.daily_crude_deficit_bpd:,.0f} bpd\n"
                f"• **Stockout Horizon without Mitigation**: {res.stockout_horizon_without_mitigation_days} Days\n"
                f"• **National Import Bill Surge**: +₹{res.economic_impact.import_bill_surge_inr_crores:,.1f} Crores (+${res.economic_impact.import_bill_surge_usd_billion}B USD)\n"
                f"• **Fuel Pump Impact**: Petrol +₹{res.economic_impact.petrol_pump_price_impact_inr_l}/L, Diesel +₹{res.economic_impact.diesel_pump_price_impact_inr_l}/L\n"
                f"• **Macro Impact**: CAD widens by +{res.economic_impact.current_account_deficit_impact_pct_gdp}% GDP, CPI inflation +{res.economic_impact.cpi_inflation_impact_bps} bps."
            )
            return {"query": query, "intent": "scenario_simulation", "response": answer, "data": res.dict()}

        elif "reroute" in query_lower or "procure" in query_lower or "tender" in query_lower or "strategy" in query_lower:
            res = procurement_orchestrator_service.generate_rerouting_strategies(ProcurementReroutingRequest(deficit_bpd=1200000.0))
            best = res.strategies[0]
            answer = (
                f"⚡ **Recommended Rerouting Strategy ({best.name})**:\n\n"
                f"• **Tagline**: {best.tagline}\n"
                f"• **Landed Cost**: ${best.landed_cost_usd_bbl}/bbl (Cost Delta +${best.cost_delta_vs_baseline_usd}/bbl)\n"
                f"• **Average Transit Time**: {best.avg_transit_days} Days (vs 18+ days normal Cape detour)\n"
                f"• **Refinery Slate Fit**: {best.overall_refinery_fit * 100:.1f}%\n\n"
                f"**Execution Directive**: Executable MoPNG tender specs generated and ready for instant refiner dispatch."
            )
            return {"query": query, "intent": "procurement_rerouting", "response": answer, "data": res.dict()}

        else:
            answer = (
                "👋 **I am UrjaAegis AI Copilot**, India's Energy Security & Procurement AI Advisor.\n\n"
                "You can ask me to:\n"
                "1. *Check live geopolitical risk scores across Strait of Hormuz and Red Sea*\n"
                "2. *Simulate a 100% Hormuz closure shock and its impact on refining & GDP*\n"
                "3. *Optimize ISPRL Strategic Petroleum Reserve (Padur/Mangalore/Visakhapatnam) drawdown*\n"
                "4. *Generate executable crude procurement rerouting strategies & emergency tenders*"
            )
            return {"query": query, "intent": "general_help", "response": answer, "data": {}}

copilot_agent_service = EnergyCopilotAgent()
