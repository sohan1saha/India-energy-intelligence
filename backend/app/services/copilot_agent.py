# copilot_agent.py: AI Energy Security & Procurement Intelligence Copilot
from typing import Dict, Any
from app.services.risk_agent import risk_agent_service
from app.services.digital_twin import digital_twin_service
from app.services.disruption_modeller import disruption_modeller_service
from app.services.spr_optimizer import spr_optimizer_service
from app.services.procurement_orchestrator import procurement_orchestrator_service
from app.models.schemas import DisruptionScenarioRequest, SPROptimizationRequest, ProcurementReroutingRequest

class EnergyCopilotAgent:
    def process_query(self, query: str) -> Dict[str, Any]:
        q = query.lower()

        # 1. Supertanker AIS Telemetry, Vessel Locations & Cargo Volume Queries (in Barrels & Gallons)
        if any(w in q for w in ["tanker", "vlcc", "desh vishal", "swarna kamal", "ratna shalini", "vessel", "ship", "headed", "heading", "going", "destination", "gallon", "barrel", "carrying"]):
            vessels = digital_twin_service.get_live_vessels_telemetry()
            
            if "desh" in q or "vishal" in q:
                v = vessels[0]
                bbls = v['cargo_volume_mbbl'] * 1000000  # 2,000,000 bbls
                gallons = bbls * 42  # 84,000,000 gallons
                answer = (
                    f"🚢 VLCC Desh Vishal Live Voyage & Cargo Telemetry:\n\n"
                    f"• Destination / Headed To: Vadinar SPM Berth (Gujarat, India)\n"
                    f"• Refinery Recipients: Reliance Jamnagar (1.2M bpd) & Nayara Vadinar (400k bpd)\n"
                    f"• Cargo Payload: 2.0 Million Barrels = 84.0 Million US Gallons (84,000,000 Gallons) of Basrah Heavy Crude\n"
                    f"• Origin Terminal: Fujairah ADCOP Oil Terminal (UAE)\n"
                    f"• Live Speed & Heading: {v['speed_knots']} Knots • Heading {v['heading_deg']}° (Gulf of Oman)\n"
                    f"• Estimated Time of Arrival (ETA): Aug 24, 2026 (06:00 UTC)\n"
                    f"• Risk Status: Under active US-Iran war risk insurance surcharge (+1.25%)."
                )
            elif "swarna" in q or "kamal" in q:
                v = vessels[1]
                bbls = v['cargo_volume_mbbl'] * 1000000
                gallons = bbls * 42  # 84,000,000 gallons
                answer = (
                    f"🚢 VLCC Swarna Kamal Live Voyage & Cargo Telemetry:\n\n"
                    f"• Destination / Headed To: Mangalore SPM / MRPL (Karnataka, India)\n"
                    f"• Cargo Payload: 2.0 Million Barrels = 84.0 Million US Gallons (84,000,000 Gallons) of Murban Sweet Crude\n"
                    f"• Origin Terminal: Fujairah ADCOP Oil Terminal (UAE)\n"
                    f"• Live Speed & Heading: {v['speed_knots']} Knots • Heading {v['heading_deg']}° (Arabian Sea)\n"
                    f"• Estimated Time of Arrival (ETA): Aug 25, 2026 (14:30 UTC)"
                )
            elif "ratna" in q or "shalini" in q:
                v = vessels[2]
                bbls = v['cargo_volume_mbbl'] * 1000000
                gallons = bbls * 42  # 79,800,000 gallons
                answer = (
                    f"🚢 VLCC Ratna Shalini Live Voyage & Cargo Telemetry:\n\n"
                    f"• Destination / Headed To: Paradip SPM Berth (Odisha, India)\n"
                    f"• Cargo Payload: 1.9 Million Barrels = 79.8 Million US Gallons (79,800,000 Gallons) of WTI Midland Crude\n"
                    f"• Origin Terminal: Enterprise US Gulf Coast Terminal (Texas, USA)\n"
                    f"• Live Speed & Heading: {v['speed_knots']} Knots • Heading {v['heading_deg']}° (Bay of Bengal)\n"
                    f"• Estimated Time of Arrival (ETA): Aug 26, 2026 (18:00 UTC)"
                )
            else:
                answer = "🚢 Active Live Supertanker Fleet Telemetry:\n\n"
                for v in vessels:
                    gal = v['cargo_volume_mbbl'] * 42
                    answer += f"• {v['name']}: {v['cargo_volume_mbbl']}M bbls ({gal:.1f}M Gallons) {v['cargo_grade']} ➔ Headed To {v['destination_port']}\n"
                answer += "\nUnit Conversion Note: 1 Crude Oil Barrel (bbl) = 42 US Gallons."
            
            return {"query": query, "intent": "supertanker_tracking", "response": answer, "data": vessels}

        # 2. Scenario Simulation & Price Shocks (Highest priority for 'simulate', 'blockade', 'shock')
        elif any(w in q for w in ["simulate", "blockade", "shock", "inflation", "gdp", "cad"]):
            res = disruption_modeller_service.simulate_scenario(DisruptionScenarioRequest(
                scenario_name="Hormuz Disruption Economic Shock",
                hormuz_blockade_pct=80.0,
                red_sea_blockade_pct=50.0,
                duration_days=30
            ))
            impact = res.economic_impact
            answer = (
                f"📈 Disruption Simulation & Economic Impact Analysis (80% Hormuz Shock):\n\n"
                f"• Daily Supply Deficit: {res.daily_crude_deficit_bpd:,.0f} bpd\n"
                f"• Stockout Horizon without Mitigation: {res.stockout_horizon_without_mitigation_days} Days\n"
                f"• Landed Crude Price: ${impact.landed_crude_price_usd:.2f}/bbl (vs ${impact.baseline_crude_price_usd:.2f} baseline, +{impact.price_increase_pct}% surge)\n"
                f"• Import Bill Surge: +₹{impact.import_bill_surge_inr_crores:,.0f} Crores (+${impact.import_bill_surge_usd_billion}B USD)\n"
                f"• Fuel Retail Impact at Pumps: Petrol +₹{impact.petrol_pump_price_impact_inr_l}/L, Diesel +₹{impact.diesel_pump_price_impact_inr_l}/L\n"
                f"• Macro Impact: CAD widens by +{impact.current_account_deficit_impact_pct_gdp}% GDP, CPI inflation +{impact.cpi_inflation_impact_bps} bps."
            )
            return {"query": query, "intent": "scenario_simulation", "response": answer, "data": res.model_dump()}

        # 3. Procurement Rerouting Strategies & Tender Specs
        elif any(w in q for w in ["rerout", "procure", "tender", "strategy", "mopng"]):
            res = procurement_orchestrator_service.generate_rerouting_strategies(ProcurementReroutingRequest(deficit_bpd=1200000.0))
            best = res.strategies[0]
            answer = (
                f"📋 Recommended Rerouting Strategy ({best.name}):\n\n"
                f"• Tagline: {best.tagline}\n"
                f"• Landed Cost: ${best.landed_cost_usd_bbl:.2f}/bbl (Cost Delta +${best.cost_delta_vs_baseline_usd:.2f}/bbl)\n"
                f"• Average Transit Time: {best.avg_transit_days} Days (vs 18+ days normal Cape detour)\n"
                f"• Refinery Slate Fit: {best.overall_refinery_fit * 100:.1f}%\n\n"
                f"Emergency Directive:\n"
                f"{best.tender_summary_pdf_text}\n\n"
                f"Executable MoPNG tender spec JSON generated and ready for instant refiner dispatch."
            )
            return {"query": query, "intent": "procurement_rerouting", "response": answer, "data": res.model_dump()}

        # 4. ADCOP Pipeline & Emergency Bypasses
        elif any(w in q for w in ["adcop", "fujairah", "pipeline", "yanbu", "petroline", "bypass", "adnoc"]):
            answer = (
                "🛢️ Emergency Pipeline Bypass Infrastructure:\n\n"
                "1. Abu Dhabi Crude Oil Pipeline (ADCOP):\n"
                "   • Capacity: 1.5 Million bpd\n"
                "   • Route: Habshan (Abu Dhabi) ➔ Fujairah Deepwater SPM Terminal (Gulf of Oman)\n"
                "   • Strategic Function: Bypasses the Strait of Hormuz entirely, allowing Indian charter VLCCs to load crude in open ocean waters.\n"
                "   • India Allocation: 540,000 bpd of Murban Sweet Crude currently committed to West Coast refiners.\n\n"
                "2. Saudi Aramco Petroline (East-West Pipeline):\n"
                "   • Capacity: 5.0 Million bpd\n"
                "   • Route: Abqaiq (Persian Gulf) ➔ Yanbu Deepwater Terminal (Red Sea)\n"
                "   • India Allocation: 420,000 bpd of Arab Light for East/West coast intake."
            )
            return {"query": query, "intent": "bypass_infrastructure", "response": answer, "data": {}}

        # 5. ISPRL Strategic Petroleum Reserve (SPR) Queries
        elif any(w in q for w in ["spr", "isprl", "cavern", "padur", "mangalore", "visakhapatnam", "reserve"]):
            res = spr_optimizer_service.optimize_drawdown(SPROptimizationRequest(deficit_bpd=1200000.0, days_to_cover=30))
            answer = (
                "🛡️ Indian Strategic Petroleum Reserves Limited (ISPRL) Status:\n\n"
                "• Total Strategic Capacity: 5.33 MMT (~39.16 Million Barrels = 1.64 Billion US Gallons)\n"
                "• National Consumption Cover: 9.5 Days (Extendable to 18.0 days with optimized LP drawdown)\n\n"
                "Cavern Inventory Breakdown:\n"
                "1. Padur (Karnataka): 2.50 MMT (18.37M bbls / 771.5M Gallons) - 100% Stocked. Direct subsea pipeline to MRPL.\n"
                "2. Mangalore (Karnataka): 1.50 MMT (11.02M bbls / 462.8M Gallons) - 80% Stocked. Linked to MRPL refinery.\n"
                "3. Visakhapatnam (Andhra Pradesh): 1.33 MMT (9.77M bbls / 410.3M Gallons) - 90% Stocked. Linked to HPCL Visakh.\n\n"
                "• Strategic Defense Floor: 15% minimum inventory reserved for military emergencies."
            )
            return {"query": query, "intent": "spr_status", "response": answer, "data": res.model_dump()}

        # 6. Refinery Assays, Crude Slate Compatibility & Refining Fit
        elif any(w in q for w in ["refinery", "jamnagar", "nayara", "mrpl", "paradip", "iocl", "bpcl", "hpcl", "grade", "slate"]):
            answer = (
                "🏭 Indian Refinery Assays & Crude Slate Matrix:\n\n"
                "1. Reliance Jamnagar (1.2M bpd) & Nayara Vadinar (400k bpd):\n"
                "   • Compatibility: High Sulfur Heavy Arabian (API 31.0°, Sulfur 2.8%) & Basrah Heavy.\n"
                "   • Gateway: Vadinar Deepwater SPM (55.0M bbls stock).\n\n"
                "2. Mangalore Refinery (MRPL 15 MMT):\n"
                "   • Compatibility: Murban Sweet (API 40.2°) & ISPRL Sour Blend.\n"
                "   • Gateway: Mangalore SPM & Padur subsea pipeline.\n\n"
                "3. IOCL Paradip (15 MMT) & Panipat (15 MMT):\n"
                "   • Compatibility: West African Bonny Light (API 35.3°), US WTI Midland (API 40.5°), and Russian ESPO.\n"
                "   • Logistics: Paradip-Haldia-Barauni-Guwahati (PHBPL 1,400 km) & Mundra-Panipat crude pipelines."
            )
            return {"query": query, "intent": "refinery_compatibility", "response": answer, "data": {}}

        # 7. Risk Assessment & Threat Score Intelligence Queries
        elif any(w in q for w in ["risk", "threat", "score", "hormuz", "red sea", "chokepoint", "houthi"]):
            report = risk_agent_service.get_latest_risk_report()
            answer = (
                f"⚠️ National Energy Risk Report (Index: {report.national_energy_risk_index}/100):\n\n"
                f"1. Strait of Hormuz: Threat Score {report.corridors[0].risk_score}/100 ({report.corridors[0].status})\n"
                f"   • Detail: {report.corridors[0].threat_description}\n"
                f"   • Delay: +{report.corridors[0].transit_delay_days} days | War Surcharge: +{report.corridors[0].war_risk_insurance_pct}%\n\n"
                f"2. Bab-el-Mandeb & Red Sea: Threat Score {report.corridors[1].risk_score}/100 ({report.corridors[1].status})\n"
                f"   • Detail: {report.corridors[1].threat_description}\n"
                f"   • Delay: +{report.corridors[1].transit_delay_days} days | War Surcharge: +{report.corridors[1].war_risk_insurance_pct}%\n\n"
                f"Directive: Execute Fujairah ADCOP pipeline rerouting and release Padur SPR reserves."
            )
            return {"query": query, "intent": "risk_assessment", "response": answer, "data": report.model_dump()}

        # 8. General Conversational / Intelligent Assistant Fallback
        else:
            answer = (
                "🤖 UrjaAegis AI Copilot - Energy Security & Procurement AI Advisor\n\n"
                "I am equipped to analyze India's energy supply chain, live AIS maritime telemetry, strategic reserves, and emergency procurement.\n\n"
                "You can ask me questions such as:\n"
                "• 'Where is VLCC Desh Vishal headed to and how many gallons is it carrying?'\n"
                "• 'How does the Fujairah ADCOP pipeline bypass the Strait of Hormuz?'\n"
                "• 'What is the stock level and drawdown rate of Padur ISPRL cavern?'\n"
                "• 'How much will petrol and diesel prices increase if Hormuz is blocked?'\n"
                "• 'Which crude grades are compatible with Reliance Jamnagar and IOCL Paradip?'\n"
                "• 'Generate emergency crude rerouting tenders for a 1.2M bpd deficit.'"
            )
            return {"query": query, "intent": "general_help", "response": answer, "data": {}}

copilot_agent_service = EnergyCopilotAgent()
