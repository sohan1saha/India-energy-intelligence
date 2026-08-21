# spr_optimizer.py: Strategic Reserve (ISPRL) Optimization Agent
from app.models.schemas import SPROptimizationRequest, SPROptimizationResult, DailyDrawdownStep
from app.data.seed_data import INITIAL_ISPRL_CAVERNS

class SPROptimizerService:
    def optimize_drawdown(self, req: SPROptimizationRequest) -> SPROptimizationResult:
        vizag_total = INITIAL_ISPRL_CAVERNS["visakhapatnam"]["capacity_mbbl"]
        mangalore_total = INITIAL_ISPRL_CAVERNS["mangalore"]["capacity_mbbl"]
        padur_total = INITIAL_ISPRL_CAVERNS["padur"]["capacity_mbbl"]

        total_initial_mbbl = vizag_total + mangalore_total + padur_total  # ~39.16 Mbbl
        min_floor_mbbl = total_initial_mbbl * (req.min_military_floor_pct / 100.0)  # ~5.87 Mbbl reserved

        usable_spr_mbbl = total_initial_mbbl - min_floor_mbbl
        daily_gap_mbbl = req.daily_supply_gap_bpd / 1_000_000.0

        if daily_gap_mbbl > 0:
            days_extended = round(usable_spr_mbbl / daily_gap_mbbl, 1)
        else:
            days_extended = 99.0

        # Allocation weights based on cavern capacity & pipeline connections to refineries
        padur_weight = 0.47      # 18.37 Mbbl (Padur) -> Linked to MRPL, HPCL Mumbai, BPCL Kochi
        mangalore_weight = 0.28  # 11.02 Mbbl (Mangalore) -> Linked to MRPL & Southern Refiners
        vizag_weight = 0.25      # 9.77 Mbbl (Visakhapatnam) -> Linked to East Coast Refiners

        schedule: list[DailyDrawdownStep] = []
        rem_vizag = vizag_total
        rem_mangalore = mangalore_total
        rem_padur = padur_total

        sim_days = min(req.simulation_days, 60)
        for d in range(1, sim_days + 1):
            if (rem_vizag + rem_mangalore + rem_padur) <= min_floor_mbbl:
                # Floor reached, stop SPR drawdown
                step_vizag = 0.0
                step_mangalore = 0.0
                step_padur = 0.0
                total_step = 0.0
            else:
                total_step = min(req.daily_supply_gap_bpd, 1200000.0)  # Max ISPRL discharge capacity ~1.2M bpd
                step_padur = total_step * padur_weight
                step_mangalore = total_step * mangalore_weight
                step_vizag = total_step * vizag_weight

                # Subtract from remaining
                rem_padur = max(padur_total * 0.15, rem_padur - (step_padur / 1_000_000.0))
                rem_mangalore = max(mangalore_total * 0.15, rem_mangalore - (step_mangalore / 1_000_000.0))
                rem_vizag = max(vizag_total * 0.15, rem_vizag - (step_vizag / 1_000_000.0))

            total_rem = rem_vizag + rem_mangalore + rem_padur
            rem_days_cover = round(total_rem / 4.12, 1)

            schedule.append(DailyDrawdownStep(
                day=d,
                visakhapatnam_drawdown_bpd=round(step_vizag, 0),
                mangalore_drawdown_bpd=round(step_mangalore, 0),
                padur_drawdown_bpd=round(step_padur, 0),
                total_drawdown_bpd=round(total_step, 0),
                remaining_spr_mbbl=round(total_rem, 2),
                remaining_days_of_cover=rem_days_cover
            ))

        replenishment_plan = (
            "POST-CRISIS REPLENISHMENT STRATEGY: Once crude markets normalize and Dubai/Brent crude enters "
            "contango structure, initiate phased spot tender replenishment via Padur SPM (50k bpd) and "
            "Visakhapatnam SPM (30k bpd) to restore ISPRL to 100% capacity (5.33 MMT) within 90 days."
        )

        return SPROptimizationResult(
            total_capacity_mbbl=round(total_initial_mbbl, 2),
            initial_stock_mbbl=round(total_initial_mbbl, 2),
            days_extended_by_spr=days_extended,
            daily_schedule=schedule,
            replenishment_recommendation=replenishment_plan
        )

spr_optimizer_service = SPROptimizerService()
