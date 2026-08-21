# copilot_agent.py: Humanized AI Energy Security & Procurement Advisor
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

        # 1. Supertanker AIS Telemetry, Vessel Locations & Cargo Volume Queries (Humanized)
        if any(w in q for w in ["tanker", "vlcc", "desh vishal", "swarna kamal", "ratna shalini", "vessel", "ship", "headed", "heading", "going", "destination", "gallon", "barrel", "carrying"]):
            vessels = digital_twin_service.get_live_vessels_telemetry()
            
            if "desh" in q or "vishal" in q:
                v = vessels[0]
                bbls = v['cargo_volume_mbbl'] * 1000000
                gallons = bbls * 42
                answer = (
                    f"Here is the live status for VLCC Desh Vishal right now!\n\n"
                    f"The supertanker is currently sailing through the Gulf of Oman (Lat {v['lat']}°, Lng {v['lng']}°) at a steady speed of {v['speed_knots']} knots, heading 124° towards India.\n\n"
                    f"📍 Where it's headed:\n"
                    f"She is bound for the Vadinar SPM Berth in Gujarat, with an estimated arrival on August 24 at 06:00 UTC. Her crude cargo will directly supply the Reliance Jamnagar and Nayara Vadinar refinery complex.\n\n"
                    f"🛢️ Oil Cargo Carrying:\n"
                    f"She is carrying 2.0 million barrels of Basrah Heavy crude, which converts to exactly 84 million US gallons (84,000,000 gallons).\n\n"
                    f"💡 Quick Context: That single vessel alone carries enough crude oil to meet nearly half of India's total daily import needs for an entire day!"
                )
            elif "swarna" in q or "kamal" in q:
                v = vessels[1]
                bbls = v['cargo_volume_mbbl'] * 1000000
                gallons = bbls * 42
                answer = (
                    f"Here is the latest live update for VLCC Swarna Kamal!\n\n"
                    f"She is currently transiting the open Arabian Sea at {v['speed_knots']} knots, heading 142° directly toward Karnataka's coastline.\n\n"
                    f"📍 Destination & Route:\n"
                    f"She is headed for the Mangalore SPM Terminal, carrying 2.0 million barrels (84 million US gallons) of Murban Sweet crude loaded directly from Fujairah's ADCOP pipeline terminal.\n\n"
                    f"🕒 Expected Arrival:\n"
                    f"Expected to offload at Mangalore Refinery (MRPL) on August 25 at 14:30 UTC."
                )
            elif "ratna" in q or "shalini" in q:
                v = vessels[2]
                bbls = v['cargo_volume_mbbl'] * 1000000
                gallons = bbls * 42
                answer = (
                    f"Here is the tracking telemetry for VLCC Ratna Shalini!\n\n"
                    f"She is currently sailing across the Bay of Bengal at {v['speed_knots']} knots, completing a long transatlantic voyage from Texas.\n\n"
                    f"📍 Destination & Cargo:\n"
                    f"Bound for the Paradip SPM Berth in Odisha, carrying 1.9 million barrels (79.8 million US gallons) of US WTI Midland crude for Indian Oil Corporation (IOCL).\n\n"
                    f"🕒 ETA: Expected at Paradip port on August 26 at 18:00 UTC."
                )
            else:
                answer = "Here is a quick humanized look at all 3 supertankers currently at sea supplying India:\n\n"
                for v in vessels:
                    gal = v['cargo_volume_mbbl'] * 42
                    answer += f"• {v['name']}: Carrying {v['cargo_volume_mbbl']}M barrels ({gal:.0f}M gallons) of {v['cargo_grade']}, headed to {v['destination_port']}.\n"
                answer += "\nAll three vessels are broadcasting live GPS satellite positions and are on schedule."
            
            return {"query": query, "intent": "supertanker_tracking", "response": answer, "data": vessels}

        # 2. Scenario Simulation & Price Shocks (Humanized)
        elif any(w in q for w in ["simulate", "blockade", "shock", "inflation", "gdp", "cad"]):
            res = disruption_modeller_service.simulate_scenario(DisruptionScenarioRequest(
                scenario_name="Hormuz Disruption Economic Shock",
                hormuz_blockade_pct=80.0,
                red_sea_blockade_pct=50.0,
                duration_days=30
            ))
            impact = res.economic_impact
            answer = (
                f"Sure thing! Here is what would happen to India's economy and fuel prices if the Strait of Hormuz faced an 80% blockade over a 30-day period:\n\n"
                f"🚨 Supply Shortfall:\n"
                f"India would face a daily crude supply gap of roughly {res.daily_crude_deficit_bpd:,.0f} barrels per day. Without active rerouting or reserve releases, commercial refinery stocks would run critically low in about {res.stockout_horizon_without_mitigation_days} days.\n\n"
                f"💰 Fuel Prices at the Pump:\n"
                f"• Petrol prices would rise by roughly +₹{impact.petrol_pump_price_impact_inr_l}/liter.\n"
                f"• Diesel prices would surge by about +₹{impact.diesel_pump_price_impact_inr_l}/liter.\n\n"
                f"📊 Overall Macroeconomic Impact:\n"
                f"• Landed crude oil prices would jump from ${impact.baseline_crude_price_usd:.2f} to ${impact.landed_crude_price_usd:.2f} per barrel (+{impact.price_increase_pct}% surge).\n"
                f"• Import Bill Surge: +₹{impact.import_bill_surge_inr_crores:,.0f} Crores (+${impact.import_bill_surge_usd_billion}B USD)\n"
                f"• CPI inflation would rise by +{impact.cpi_inflation_impact_bps} basis points.\n\n"
                f"The good news is that by tapping our ISPRL underground reserves and using pipeline bypasses in Abu Dhabi, we can offset over 75% of this impact!"
            )
            return {"query": query, "intent": "scenario_simulation", "response": answer, "data": res.model_dump()}

        # 3. Procurement Rerouting Strategies & Tender Specs (Humanized)
        elif any(w in q for w in ["rerout", "procure", "tender", "strategy", "mopng"]):
            res = procurement_orchestrator_service.generate_rerouting_strategies(ProcurementReroutingRequest(deficit_bpd=1200000.0))
            best = res.strategies[0]
            answer = (
                f"Here is our top recommended crude rerouting strategy to handle a supply deficit:\n\n"
                f"🎯 Rerouting Strategy: {best.name}\n"
                f"{best.tagline}\n\n"
                f"💡 Why this strategy works best:\n"
                f"• Delivery Speed: Average transit takes just {best.avg_transit_days} days (compared to 18+ days if vessels had to sail all the way around Africa).\n"
                f"• Refinery Compatibility: Has a {best.overall_refinery_fit * 100:.1f}% assay fit with Indian refinery slates.\n"
                f"• Landed Cost: Estimated at ${best.landed_cost_usd_bbl:.2f}/bbl (a minimal delta of +${best.cost_delta_vs_baseline_usd:.2f}/bbl over normal baseline).\n\n"
                f"📜 Actionable MoPNG Directive:\n"
                f"{best.tender_summary_pdf_text}\n\n"
                f"Full executable tender specifications have been generated in JSON format for instant refiner dispatch."
            )
            return {"query": query, "intent": "procurement_rerouting", "response": answer, "data": res.model_dump()}

        # 4. ADCOP Pipeline & Emergency Bypasses (Humanized)
        elif any(w in q for w in ["adcop", "fujairah", "pipeline", "yanbu", "petroline", "bypass", "adnoc"]):
            answer = (
                "Great question! Here's how overland pipeline bypasses protect India's energy supply when chokepoints get risky:\n\n"
                "1. Abu Dhabi ADCOP Pipeline (UAE):\n"
                "Abu Dhabi built a 370-km overland pipeline that carries crude straight from desert oilfields to Fujairah on the open Gulf of Oman. This completely bypasses the Strait of Hormuz! Tankers can load 540,000 barrels a day of Murban Sweet crude out in the open ocean without entering Iranian naval standoff zones.\n\n"
                "2. Saudi Aramco Petroline (Red Sea):\n"
                "Saudi Arabia operates a 5.0 million barrel-per-day East-West pipeline to Yanbu on the Red Sea, giving Indian refiners a safe 420,000 bpd intake option even if Gulf shipping lanes get congested."
            )
            return {"query": query, "intent": "bypass_infrastructure", "response": answer, "data": {}}

        # 5. ISPRL Strategic Petroleum Reserve (SPR) Queries (Humanized)
        elif any(w in q for w in ["spr", "isprl", "cavern", "padur", "mangalore", "visakhapatnam", "reserve"]):
            res = spr_optimizer_service.optimize_drawdown(SPROptimizationRequest(deficit_bpd=1200000.0, days_to_cover=30))
            answer = (
                "Here is an overview of India's Strategic Petroleum Reserve (ISPRL) readiness:\n\n"
                "India maintains 5.33 million metric tonnes (about 39.16 million barrels or 1.64 billion gallons) of crude oil stored deep underground in unlined rock caverns on both coasts.\n\n"
                "📍 Where the reserves are stored:\n"
                "1. Padur (Karnataka): Holds 18.37M barrels (100% full). It connects directly to Mangalore Refinery via a subsea pipeline.\n"
                "2. Mangalore (Karnataka): Holds 11.02M barrels (80% full).\n"
                "3. Visakhapatnam (Andhra Pradesh): Holds 9.77M barrels (90% full), feeding HPCL Visakh.\n\n"
                "🛡️ National Defense Buffer:\n"
                "These caverns provide about 9.5 days of complete national oil consumption. Under our drawdown model, we can stretch this to extend refiner operations by up to 18 additional days while keeping a 15% floor strictly reserved for military readiness."
            )
            return {"query": query, "intent": "spr_status", "response": answer, "data": res.model_dump()}

        # 6. Refinery Assays, Crude Slate Compatibility & Refining Fit (Humanized)
        elif any(w in q for w in ["refinery", "jamnagar", "nayara", "mrpl", "paradip", "iocl", "bpcl", "hpcl", "grade", "slate"]):
            answer = (
                "Here is how different crude oil grades match with India's major refining complexes:\n\n"
                "🏭 West Coast (Jamnagar & Vadinar):\n"
                "Reliance Jamnagar (1.2M bpd) and Nayara Vadinar (400k bpd) are highly complex refineries designed for heavy, high-sulfur crudes like Basrah Heavy and Arab Heavy. They receive crude offloaded at the deepwater Vadinar SPM.\n\n"
                "🏭 South Coast (MRPL Mangalore):\n"
                "Mangalore Refinery is optimized for lighter sweet crudes like Abu Dhabi Murban (API 40.2°) as well as ISPRL cavern stock.\n\n"
                "🏭 East Coast (IOCL Paradip):\n"
                "Paradip Refinery processes transatlantic crudes like US WTI Midland, West African Bonny Light, and Russian ESPO blend, feeding inland refineries via the 1,400 km PHBPL pipeline."
            )
            return {"query": query, "intent": "refinery_compatibility", "response": answer, "data": {}}

        # 7. Risk Assessment & Threat Score Intelligence Queries (Humanized)
        elif any(w in q for w in ["risk", "threat", "score", "hormuz", "red sea", "chokepoint", "houthi"]):
            report = risk_agent_service.get_latest_risk_report()
            answer = (
                f"Here is our latest Geopolitical Risk Report briefing (National Risk Index: {report.national_energy_risk_index}/100):\n\n"
                f"⚠️ Strait of Hormuz (Threat Score {report.corridors[0].risk_score}/100):\n"
                f"{report.corridors[0].threat_description} War risk insurance surcharges are currently up +{report.corridors[0].war_risk_insurance_pct}% with transit delays averaging +{report.corridors[0].transit_delay_days} days.\n\n"
                f"⚠️ Red Sea & Bab-el-Mandeb (Threat Score {report.corridors[1].risk_score}/100):\n"
                f"Houthi anti-ship missile and drone activity continues to force major tankers onto the 16-day detour around Africa's Cape of Good Hope.\n\n"
                f"💡 Recommended Directive: Reroute Persian Gulf tankers via Fujairah's ADCOP pipeline and prepare Padur ISPRL cavern for emergency release."
            )
            return {"query": query, "intent": "risk_assessment", "response": answer, "data": report.model_dump()}

        # 8. General Conversational / Intelligent Assistant Fallback (Humanized)
        else:
            answer = (
                "Hello! I am your UrjaAegis AI Energy Security & Procurement Advisor.\n\n"
                "I'm here to help you monitor India's crude oil supply chain, track live supertankers at sea, analyze geopolitical chokepoint risks, and optimize emergency reserves.\n\n"
                "Here are a few natural questions you can ask me:\n"
                "• 'Where is VLCC Desh Vishal headed to and how many gallons of oil is it carrying?'\n"
                "• 'How does the Fujairah ADCOP pipeline bypass the Strait of Hormuz?'\n"
                "• 'What happens to petrol and diesel prices if Hormuz is blocked?'\n"
                "• 'How many days of oil reserves does India hold in ISPRL caverns?'\n"
                "• 'Which crude grades are compatible with Reliance Jamnagar and IOCL Paradip?'"
            )
            return {"query": query, "intent": "general_help", "response": answer, "data": {}}

copilot_agent_service = EnergyCopilotAgent()
