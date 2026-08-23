# disruption_modeller.py: Disruption Scenario Modeller & Macroeconomic Engine
from app.models.schemas import DisruptionScenarioRequest, DisruptionScenarioResult, RefineryImpact, EconomicImpactMetrics
from app.data.seed_data import INITIAL_REFINERIES

class DisruptionScenarioModeller:
    def simulate_scenario(self, req: DisruptionScenarioRequest) -> DisruptionScenarioResult:
        h = req.hormuz_blockade_pct
        r = req.red_sea_blockade_pct
        d = req.duration_days

        hormuz_loss_bpd = 2025000.0 * (h / 100.0)
        red_sea_delay_bpd = 1125000.0 * (r / 100.0) * 0.36

        total_daily_deficit_bpd = round(hormuz_loss_bpd + red_sea_delay_bpd)
        total_shortfall_mbbl = round((total_daily_deficit_bpd * d) / 1_000_000.0, 5)

        deficit_mbpd = total_daily_deficit_bpd / 1_000_000.0
        stockout_days = round(81.0 / deficit_mbpd, 1) if deficit_mbpd > 0 else 999.0

        refinery_impacts = []
        deficit_ratio = total_daily_deficit_bpd / 4500000.0
        for ref in INITIAL_REFINERIES:
            baseline = ref["baseline_throughput_bpd"]
            impact_factor = (deficit_ratio * 0.85) if ref["nelson_complexity"] >= 12.0 else (deficit_ratio * 0.65)
            impacted = max(0.0, baseline * (1.0 - impact_factor))
            utilization = (impacted / baseline) * 100.0

            refinery_impacts.append(RefineryImpact(
                refinery_name=ref["refinery_name"],
                location=ref["location"],
                operator=ref["operator"],
                nelson_complexity=ref["nelson_complexity"],
                baseline_throughput_bpd=baseline,
                impacted_throughput_bpd=round(impacted, 1),
                capacity_utilization_pct=round(utilization, 1),
                crude_slate_compatibility=ref["crude_slate_compatibility"]
            ))

        baseline_price = 78.50
        price_surge_pct = round((h * 0.42) + (r * 0.11), 1)
        landed_price = round(baseline_price * (1.0 + (price_surge_pct / 100.0)), 2)

        import_bill_surge_inr_crores = round(total_shortfall_mbbl * 8333.333)
        import_bill_surge_usd_bn = round(total_shortfall_mbbl * (landed_price / 1.197), 2)

        petrol_surge = round((h * 0.15) + (r * 0.074), 1)
        diesel_surge = round((h * 0.17) + (r * 0.08), 1)

        cad_impact = round((h * 0.005) + (r * 0.002), 2)
        cpi_impact = round((h * 0.38) + (r * 0.16))

        economic_metrics = EconomicImpactMetrics(
            baseline_crude_price_usd=baseline_price,
            landed_crude_price_usd=landed_price,
            price_increase_pct=price_surge_pct,
            import_bill_surge_inr_crores=import_bill_surge_inr_crores,
            import_bill_surge_usd_billion=import_bill_surge_usd_bn,
            petrol_pump_price_impact_inr_l=petrol_surge,
            diesel_pump_price_impact_inr_l=diesel_surge,
            current_account_deficit_impact_pct_gdp=cad_impact,
            cpi_inflation_impact_bps=cpi_impact
        )

        return DisruptionScenarioResult(
            scenario_name=req.scenario_name or "Geopolitical Stress Simulation",
            duration_days=req.duration_days,
            daily_crude_deficit_bpd=total_daily_deficit_bpd,
            total_shortfall_mbbl=total_shortfall_mbbl,
            stockout_horizon_without_mitigation_days=stockout_days,
            refinery_impacts=refinery_impacts,
            economic_impact=economic_metrics
        )

disruption_modeller_service = DisruptionScenarioModeller()
