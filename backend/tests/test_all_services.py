# test_all_services.py: Comprehensive Test Suite for UrjaAegis AI Backend Services
import sys
import os
import unittest

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.risk_agent import risk_agent_service
from app.services.digital_twin import digital_twin_service
from app.services.disruption_modeller import disruption_modeller_service
from app.services.spr_optimizer import spr_optimizer_service
from app.services.procurement_orchestrator import procurement_orchestrator_service
from app.services.copilot_agent import copilot_agent_service
from app.models.schemas import DisruptionScenarioRequest, SPROptimizationRequest, ProcurementReroutingRequest

class TestUrjaAegisBackend(unittest.TestCase):

    def test_1_geopolitical_risk_agent(self):
        """Test Module 1: Geopolitical Risk Intelligence Agent"""
        report = risk_agent_service.get_latest_risk_report()
        self.assertIsNotNone(report.timestamp)
        self.assertGreater(report.national_energy_risk_index, 0)
        self.assertEqual(len(report.corridors), 4)
        self.assertEqual(len(report.suppliers), 6)
        
        # Test update corridor
        updated = risk_agent_service.update_corridor_risk("HORMUZ", 90.0, "Critical naval exercise")
        self.assertEqual(updated.risk_score, 90.0)
        self.assertEqual(updated.status, "IMPASSABLE")

    def test_2_digital_twin_service(self):
        """Test Module 2 & 5: Energy Supply Chain Digital Twin"""
        state = digital_twin_service.get_current_twin_state()
        self.assertGreater(len(state.nodes), 5)
        self.assertGreater(len(state.edges), 3)
        self.assertGreater(state.total_crude_at_sea_mbbl, 0)
        self.assertAlmostEqual(state.isprl_days_of_cover, 9.5, delta=1.5)

    def test_3_disruption_scenario_modeller(self):
        """Test Module 3: Disruption Scenario Modeller & Macro Engine"""
        req = DisruptionScenarioRequest(
            scenario_name="Hormuz & Red Sea Shock",
            hormuz_blockade_pct=80.0,
            red_sea_blockade_pct=50.0,
            duration_days=30
        )
        res = disruption_modeller_service.simulate_scenario(req)
        self.assertGreater(res.daily_crude_deficit_bpd, 1000000.0)
        self.assertLess(res.stockout_horizon_without_mitigation_days, 60.0)
        self.assertGreater(res.economic_impact.import_bill_surge_inr_crores, 10000.0)
        self.assertGreater(res.economic_impact.petrol_pump_price_impact_inr_l, 5.0)

    def test_4_spr_optimizer(self):
        """Test Module 4: Strategic Petroleum Reserve (ISPRL) Optimization Agent"""
        req = SPROptimizationRequest(
            daily_supply_gap_bpd=1200000.0,
            simulation_days=30,
            min_military_floor_pct=15.0
        )
        res = spr_optimizer_service.optimize_drawdown(req)
        self.assertAlmostEqual(res.total_capacity_mbbl, 39.16, delta=1.0)
        self.assertGreater(res.days_extended_by_spr, 10.0)
        self.assertEqual(len(res.daily_schedule), 30)

    def test_5_procurement_orchestrator(self):
        """Test Direction 3: Adaptive Procurement Orchestrator"""
        req = ProcurementReroutingRequest(deficit_bpd=1200000.0)
        res = procurement_orchestrator_service.generate_rerouting_strategies(req)
        self.assertEqual(len(res.strategies), 2)
        best = res.strategies[0]
        self.assertEqual(best.strategy_id, "strat_bypass")
        self.assertGreater(best.overall_refinery_fit, 0.90)
        self.assertIn("MoPNG", best.executable_tender_json)

    def test_6_copilot_agent(self):
        """Test AI Energy Security Copilot"""
        res_risk = copilot_agent_service.process_query("What is the current threat score for Strait of Hormuz?")
        self.assertIn("Risk Report", res_risk["response"])

        res_sim = copilot_agent_service.process_query("Simulate an 80% blockade on Hormuz")
        self.assertIn("Import Bill Surge", res_sim["response"])

        res_proc = copilot_agent_service.process_query("Generate crude rerouting strategies")
        self.assertIn("Rerouting Strategy", res_proc["response"])

if __name__ == "__main__":
    unittest.main()
