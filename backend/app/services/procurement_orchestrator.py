# procurement_orchestrator.py: Adaptive Procurement Orchestrator
import json
from app.models.schemas import ProcurementReroutingRequest, ProcurementReroutingResult, ReroutingStrategy, SourcingAllocation

class AdaptiveProcurementOrchestrator:
    def generate_rerouting_strategies(self, req: ProcurementReroutingRequest) -> ProcurementReroutingResult:
        deficit_bpd = req.deficit_bpd or 1200000.0

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

        return ProcurementReroutingResult(
            deficit_bpd=deficit_bpd,
            strategies=[strat1, strat2],
            recommended_strategy_id="strat_bypass"
        )

procurement_orchestrator_service = AdaptiveProcurementOrchestrator()
