# disruption_modeller.py: Disruption Scenario Modeller & Macroeconomic Engine
from app.models.schemas import DisruptionScenarioRequest, DisruptionScenarioResult, RefineryImpact, EconomicImpactMetrics
from app.data.seed_data import INITIAL_REFINERIES

class DisruptionScenarioModeller:
    def simulate_scenario(self, req: DisruptionScenarioRequest) -> DisruptionScenarioResult:
        # India baseline crude import ~4.5 Million bpd
        # Hormuz transits ~42% of India's crude imports (~1.89M bpd)
        # Red Sea transits ~25% of India's crude imports (~1.125M bpd)
        # Russian crude ~36% of imports (~1.62M bpd)

        hormuz_loss_bpd = 1890000.0 * (req.hormuz_blockade_pct / 100.0)
        red_sea_delay_bpd = 1125000.0 * (req.red_sea_blockade_pct / 100.0) * 0.45
        russian_loss_bpd = 1620000.0 * (req.russian_sanctions_tightening_pct / 100.0)

        total_daily_deficit_bpd = hormuz_loss_bpd + red_sea_delay_bpd + russian_loss_bpd
        total_shortfall_mbbl = (total_daily_deficit_bpd * req.duration_days) / 1_000_000.0

        # Stockout Horizon Formula:
        # Emergency Operational Buffer = 18.0 Days (9.5d ISPRL + operational minimums)
        deficit_ratio = total_daily_deficit_bpd / 4500000.0
        if deficit_ratio > 0:
            stockout_days = round(18.0 / deficit_ratio, 1)
        else:
            stockout_days = 999.0

        refinery_impacts = []
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
        price_surge_pct = (req.hormuz_blockade_pct * 0.45) + (req.red_sea_blockade_pct * 0.18) + (req.russian_sanctions_tightening_pct * 0.22)
        landed_price = baseline_price * (1.0 + (price_surge_pct / 100.0))
        price_delta_usd = landed_price - baseline_price

        monthly_import_bbls = 4.5 * 30.0  # 135M bbls/month
        additional_cost_usd_mn = (monthly_import_bbls * price_delta_usd)
        import_bill_surge_usd_bn = round(additional_cost_usd_mn / 1000.0, 2)
        import_bill_surge_inr_crores = round((additional_cost_usd_mn * 83.5) / 10.0, 1)

        pump_surge_inr = round((price_delta_usd / 10.0) * 6.5, 2)
        petrol_surge = round(pump_surge_inr * 1.05, 2)
        diesel_surge = round(pump_surge_inr * 0.95, 2)

        cad_impact = round((price_delta_usd / 10.0) * 0.48, 2)
        cpi_impact = round((price_delta_usd / 10.0) * 36.0, 1)

        economic_metrics = EconomicImpactMetrics(
            baseline_crude_price_usd=baseline_price,
            landed_crude_price_usd=round(landed_price, 2),
            price_increase_pct=round(price_surge_pct, 1),
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
            daily_crude_deficit_bpd=round(total_daily_deficit_bpd, 1),
            total_shortfall_mbbl=round(total_shortfall_mbbl, 2),
            stockout_horizon_without_mitigation_days=stockout_days,
            refinery_impacts=refinery_impacts,
            economic_impact=economic_metrics
        )

disruption_modeller_service = DisruptionScenarioModeller()
