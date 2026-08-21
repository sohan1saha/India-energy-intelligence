# procurement_orchestrator.py: Adaptive Procurement Orchestrator (5 Comprehensive Strategies)
import json
from app.models.schemas import ProcurementReroutingRequest, ProcurementReroutingResult, ReroutingStrategy, SourcingAllocation

class AdaptiveProcurementOrchestrator:
    def generate_rerouting_strategies(self, req: ProcurementReroutingRequest) -> ProcurementReroutingResult:
        deficit_bpd = req.deficit_bpd or 1200000.0

        # Strategy 1: Emergency Pipeline & SPR Bypass
        strat1_allocations = [
            SourcingAllocation(
                source_country="UAE (ADCOP Pipeline Bypass)",
                supplier_name="ADNOC",
                crude_grade="Murban Sweet",
                api_gravity=40.2,
                sulfur_pct=0.78,
                volume_bpd=round(deficit_bpd * 0.45, 0),
                transport_mode="VLCC Direct from Fujairah Terminal (Bypassing Hormuz)",
                transit_days=3.0,
                landed_cost_usd_bbl=84.50,
                refinery_fit_score=0.95
            ),
            SourcingAllocation(
                source_country="Saudi Arabia (East-West Petroline)",
                supplier_name="Saudi Aramco",
                crude_grade="Arab Light",
                api_gravity=33.4,
                sulfur_pct=1.97,
                volume_bpd=round(deficit_bpd * 0.35, 0),
                transport_mode="VLCC from Yanbu Red Sea Terminal",
                transit_days=4.5,
                landed_cost_usd_bbl=86.20,
                refinery_fit_score=0.98
            ),
            SourcingAllocation(
                source_country="ISPRL Strategic Reserves",
                supplier_name="ISPRL (Padur & Mangalore)",
                crude_grade="Arab / Basrah Sour Blend",
                api_gravity=32.0,
                sulfur_pct=2.10,
                volume_bpd=round(deficit_bpd * 0.20, 0),
                transport_mode="Subsea Pipeline to MRPL & Coastal Barges to Jamnagar",
                transit_days=0.5,
                landed_cost_usd_bbl=78.50,
                refinery_fit_score=1.00
            )
        ]

        tender1_json = json.dumps({
            "tender_id": "MoPNG/EMERGENCY/2026-08/STRAT-1",
            "issuer": "Ministry of Petroleum & Natural Gas / IOCL Chartering",
            "total_volume_bpd": deficit_bpd,
            "target_delivery_ports": ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"],
            "allocations": [a.model_dump() for a in strat1_allocations],
            "execution_lead_time_hours": 6
        }, indent=2)

        strat1 = ReroutingStrategy(
            strategy_id="strat_bypass",
            name="Emergency Chokepoint Bypass (ADCOP + Yanbu + ISPRL)",
            tagline="Fastest delivery (0.5–4.5 days) by utilizing pipeline bypasses in UAE & Saudi Arabia + ISPRL release.",
            landed_cost_usd_bbl=83.80,
            cost_delta_vs_baseline_usd=5.30,
            avg_transit_days=2.8,
            overall_refinery_fit=0.97,
            allocations=strat1_allocations,
            executable_tender_json=tender1_json,
            tender_summary_pdf_text="EMERGENCY DIRECTIVE: Dispatch 3 VLCCs to Fujairah ADCOP terminal (UAE) and 2 VLCCs to Yanbu Red Sea terminal. Initiate 240,000 bpd drawdown from Padur & Mangalore ISPRL caverns immediately."
        )

        # Strategy 2: Global Atlantic & Transatlantic Pivot
        strat2_allocations = [
            SourcingAllocation(
                source_country="Nigeria",
                supplier_name="NNPC",
                crude_grade="Bonny Light",
                api_gravity=35.3,
                sulfur_pct=0.15,
                volume_bpd=round(deficit_bpd * 0.40, 0),
                transport_mode="Suezmax via Cape of Good Hope Route",
                transit_days=22.0,
                landed_cost_usd_bbl=88.70,
                refinery_fit_score=0.88
            ),
            SourcingAllocation(
                source_country="United States (Gulf Coast)",
                supplier_name="Enterprise / Chevron",
                crude_grade="WTI Midland",
                api_gravity=40.5,
                sulfur_pct=0.20,
                volume_bpd=round(deficit_bpd * 0.35, 0),
                transport_mode="VLCC Transatlantic via Cape Route",
                transit_days=34.0,
                landed_cost_usd_bbl=89.50,
                refinery_fit_score=0.85
            ),
            SourcingAllocation(
                source_country="Russia (Far East)",
                supplier_name="Rosneft",
                crude_grade="ESPO Blend",
                api_gravity=35.6,
                sulfur_pct=0.52,
                volume_bpd=round(deficit_bpd * 0.25, 0),
                transport_mode="Aframax via Kozmino Port -> Malacca Strait -> Paradip",
                transit_days=14.0,
                landed_cost_usd_bbl=81.20,
                refinery_fit_score=0.92
            )
        ]

        tender2_json = json.dumps({
            "tender_id": "MoPNG/GLOBAL-PIVOT/2026-08/STRAT-2",
            "issuer": "Indian Oil Corporation / BPCL Joint Procurement",
            "total_volume_bpd": deficit_bpd,
            "target_delivery_ports": ["Paradip (Odisha)", "Vadinar (Gujarat)", "Kochi (Kerala)"],
            "allocations": [a.model_dump() for a in strat2_allocations],
            "execution_lead_time_hours": 12
        }, indent=2)

        strat2 = ReroutingStrategy(
            strategy_id="strat_global_pivot",
            name="Global Atlantic & Far East Pivot (WTI + Bonny Light + ESPO)",
            tagline="Diversifies sourcing away from Middle Eastern chokepoints via Atlantic, US Gulf, and Russian Kozmino routes.",
            landed_cost_usd_bbl=87.10,
            cost_delta_vs_baseline_usd=8.60,
            avg_transit_days=23.3,
            overall_refinery_fit=0.88,
            allocations=strat2_allocations,
            executable_tender_json=tender2_json,
            tender_summary_pdf_text="GLOBAL TENDER: Issue spot purchase orders for 480k bpd West African Bonny Light, 420k bpd US WTI Midland, and 300k bpd Russian ESPO via Kozmino port."
        )

        # Strategy 3: Far East & Russian ESPO Strategic Corridor
        strat3_allocations = [
            SourcingAllocation(
                source_country="Russia (Pacific Kozmino)",
                supplier_name="Rosneft / Gazprom Neft",
                crude_grade="ESPO Blend",
                api_gravity=35.6,
                sulfur_pct=0.52,
                volume_bpd=round(deficit_bpd * 0.50, 0),
                transport_mode="Aframax Fleet via Kozmino -> Malacca -> Paradip / Visakh",
                transit_days=12.0,
                landed_cost_usd_bbl=80.50,
                refinery_fit_score=0.94
            ),
            SourcingAllocation(
                source_country="Russia (Sakhalin Island)",
                supplier_name="Sakhalin Energy",
                crude_grade="Sokol Light",
                api_gravity=37.9,
                sulfur_pct=0.23,
                volume_bpd=round(deficit_bpd * 0.30, 0),
                transport_mode="Shuttle Tankers via Sea of Japan -> Bay of Bengal",
                transit_days=14.0,
                landed_cost_usd_bbl=82.00,
                refinery_fit_score=0.91
            ),
            SourcingAllocation(
                source_country="ISPRL Visakhapatnam Cavern",
                supplier_name="ISPRL East Coast",
                crude_grade="Visakh Light Blend",
                api_gravity=34.0,
                sulfur_pct=1.80,
                volume_bpd=round(deficit_bpd * 0.20, 0),
                transport_mode="Direct Pipeline to HPCL Visakh Refinery",
                transit_days=0.5,
                landed_cost_usd_bbl=79.00,
                refinery_fit_score=0.98
            )
        ]

        tender3_json = json.dumps({
            "tender_id": "MoPNG/FAR-EAST/2026-08/STRAT-3",
            "issuer": "HPCL / IOCL Joint Far East Chartering",
            "total_volume_bpd": deficit_bpd,
            "target_delivery_ports": ["Paradip (Odisha)", "Visakhapatnam (Andhra Pradesh)", "Haldia (West Bengal)"],
            "allocations": [a.model_dump() for a in strat3_allocations],
            "execution_lead_time_hours": 8
        }, indent=2)

        strat3 = ReroutingStrategy(
            strategy_id="strat_far_east",
            name="Far East & Russian ESPO Strategic Corridor (Kozmino + Sokol + Visakh)",
            tagline="Fast Pacific & Malacca corridor utilizing Rupee-Ruble settlement and Russian Far East terminals.",
            landed_cost_usd_bbl=81.50,
            cost_delta_vs_baseline_usd=3.00,
            avg_transit_days=11.5,
            overall_refinery_fit=0.94,
            allocations=strat3_allocations,
            executable_tender_json=tender3_json,
            tender_summary_pdf_text="FAR EAST DIRECTIVE: Charter 6 Aframax vessels for Kozmino & De-Kastri terminals. Activate Visakhapatnam ISPRL cavern drawdown for East Coast refiners."
        )

        # Strategy 4: Latin American Transatlantic Sourcing
        strat4_allocations = [
            SourcingAllocation(
                source_country="Brazil (Santos Basin)",
                supplier_name="Petrobras",
                crude_grade="Lula / Tupi Medium",
                api_gravity=29.8,
                sulfur_pct=0.37,
                volume_bpd=round(deficit_bpd * 0.40, 0),
                transport_mode="VLCC Transatlantic via South Atlantic -> Cape of Good Hope",
                transit_days=26.0,
                landed_cost_usd_bbl=85.20,
                refinery_fit_score=0.92
            ),
            SourcingAllocation(
                source_country="Guyana (Stabroek Block)",
                supplier_name="ExxonMobil / Hess",
                crude_grade="Liza Sweet",
                api_gravity=32.0,
                sulfur_pct=0.58,
                volume_bpd=round(deficit_bpd * 0.35, 0),
                transport_mode="Suezmax Transatlantic via Cape Route",
                transit_days=29.0,
                landed_cost_usd_bbl=86.80,
                refinery_fit_score=0.90
            ),
            SourcingAllocation(
                source_country="Colombia (Coveñas Port)",
                supplier_name="Ecopetrol",
                crude_grade="Vasconia Heavy",
                api_gravity=24.3,
                sulfur_pct=0.96,
                volume_bpd=round(deficit_bpd * 0.25, 0),
                transport_mode="VLCC Transatlantic to Jamnagar & Vadinar",
                transit_days=31.0,
                landed_cost_usd_bbl=84.90,
                refinery_fit_score=0.91
            )
        ]

        tender4_json = json.dumps({
            "tender_id": "MoPNG/LATAM-PIVOT/2026-08/STRAT-4",
            "issuer": "Reliance Jamnagar & Nayara Joint Sourcing",
            "total_volume_bpd": deficit_bpd,
            "target_delivery_ports": ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Visakhapatnam (Andhra Pradesh)"],
            "allocations": [a.model_dump() for a in strat4_allocations],
            "execution_lead_time_hours": 16
        }, indent=2)

        strat4 = ReroutingStrategy(
            strategy_id="strat_latam",
            name="Latin American Heavy-Sweet Blend (Brazil Tupi + Guyana Liza + Vasconia)",
            tagline="Transatlantic South American route bypassing Middle Eastern geopolitical risk corridors completely.",
            landed_cost_usd_bbl=85.90,
            cost_delta_vs_baseline_usd=7.40,
            avg_transit_days=28.0,
            overall_refinery_fit=0.91,
            allocations=strat4_allocations,
            executable_tender_json=tender4_json,
            tender_summary_pdf_text="LATAM DIRECTIVE: Issue long-term term-contracts for Petrobras Tupi and Guyanese Liza crude. Dispatch 4 VLCCs via South Atlantic route."
        )

        # Strategy 5: National Strategic Reserve Drawdown & Domestic Production Surge
        strat5_allocations = [
            SourcingAllocation(
                source_country="ISPRL National Caverns (Padur, Mangalore, Visakh)",
                supplier_name="ISPRL Ministry of Petroleum",
                crude_grade="National Strategic Reserve Blend",
                api_gravity=32.5,
                sulfur_pct=1.85,
                volume_bpd=round(deficit_bpd * 0.70, 0),
                transport_mode="Subsea Pipelines to MRPL/Visakh & Coastal Coastal Barges to Jamnagar",
                transit_days=0.5,
                landed_cost_usd_bbl=76.50,
                refinery_fit_score=1.00
            ),
            SourcingAllocation(
                source_country="India Domestic Production (Offshore & Onshore)",
                supplier_name="ONGC / Oil India Ltd",
                crude_grade="Mumbai High Sweet & Assam Crude",
                api_gravity=38.8,
                sulfur_pct=0.12,
                volume_bpd=round(deficit_bpd * 0.30, 0),
                transport_mode="Offshore Pipeline directly to JNPT Mumbai & Uran Docks",
                transit_days=1.2,
                landed_cost_usd_bbl=78.80,
                refinery_fit_score=0.97
            )
        ]

        tender5_json = json.dumps({
            "tender_id": "MoPNG/NATIONAL-DEFENSE/2026-08/STRAT-5",
            "issuer": "Cabinet Committee on Economic Affairs (CCEA) Emergency Order",
            "total_volume_bpd": deficit_bpd,
            "target_delivery_ports": ["Mangalore (Karnataka)", "Visakhapatnam (Andhra Pradesh)", "JNPT (Mumbai)", "Vadinar (Gujarat)"],
            "allocations": [a.model_dump() for a in strat5_allocations],
            "execution_lead_time_hours": 2
        }, indent=2)

        strat5 = ReroutingStrategy(
            strategy_id="strat_national_surge",
            name="National Reserve Drawdown & Domestic Surge (ISPRL 100% + ONGC Offshore)",
            tagline="Immediate domestic defense response activating 100% ISPRL cavern release + ONGC Mumbai High surge.",
            landed_cost_usd_bbl=77.20,
            cost_delta_vs_baseline_usd=-1.30,
            avg_transit_days=0.8,
            overall_refinery_fit=0.99,
            allocations=strat5_allocations,
            executable_tender_json=tender5_json,
            tender_summary_pdf_text="NATIONAL DEFENSE ORDER: CCEA authorizes maximum 840,000 bpd drawdown across all ISPRL rock caverns and 360,000 bpd ONGC Mumbai High production surge."
        )

        return ProcurementReroutingResult(
            deficit_bpd=deficit_bpd,
            strategies=[strat1, strat2, strat3, strat4, strat5],
            recommended_strategy_id="strat_bypass"
        )

procurement_orchestrator_service = AdaptiveProcurementOrchestrator()
