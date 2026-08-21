from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Module 1: Geopolitical Risk Intelligence ---
class CorridorRisk(BaseModel):
    id: str
    name: str
    code: str
    risk_score: float = Field(..., ge=0, le=100, description="Risk Score from 0 (Safe) to 100 (Impassable)")
    status: str = Field(..., description="NORMAL, ELEVATED, HIGH_RISK, IMPASSABLE")
    daily_vessel_count: int
    transit_delay_days: float
    war_risk_insurance_pct: float
    threat_description: str

class SupplierRisk(BaseModel):
    id: str
    country: str
    supplier_name: str
    export_terminal: str
    share_of_indian_imports_pct: float
    risk_score: float
    status: str
    key_vulnerabilities: str

class GeopoliticalRiskReport(BaseModel):
    timestamp: str
    national_energy_risk_index: float
    corridors: List[CorridorRisk]
    suppliers: List[SupplierRisk]
    top_threat_summary: str

# --- Module 2: Energy Supply Chain Digital Twin ---
class NetworkNode(BaseModel):
    id: str
    name: str
    node_type: str  # TANKER, CHOKEPOINT, PORT_SPM, REFINERY, ISPRL_CAVERN
    lat: float
    lng: float
    capacity_mbbl: float
    current_volume_mbbl: float
    status: str
    metadata: Dict[str, Any] = {}

class NetworkEdge(BaseModel):
    id: str
    source_id: str
    target_id: str
    distance_nautical_miles: float
    normal_transit_days: float
    risk_score: float
    volume_in_transit_mbbl: float

class EnergyDigitalTwinState(BaseModel):
    timestamp: str
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
    total_vessels_in_transit: int
    total_crude_at_sea_mbbl: float
    isprl_total_reserve_mbbl: float
    isprl_days_of_cover: float

# --- Module 3: Disruption Scenario & Macro Economic Impact ---
class DisruptionScenarioRequest(BaseModel):
    scenario_name: Optional[str] = "Custom Geopolitical Disruption"
    hormuz_blockade_pct: float = Field(0.0, ge=0.0, le=100.0)
    red_sea_blockade_pct: float = Field(0.0, ge=0.0, le=100.0)
    russian_sanctions_tightening_pct: float = Field(0.0, ge=0.0, le=100.0)
    duration_days: int = Field(30, ge=1, le=180)

class RefineryImpact(BaseModel):
    refinery_name: str
    location: str
    operator: str
    nelson_complexity: float
    baseline_throughput_bpd: float
    impacted_throughput_bpd: float
    capacity_utilization_pct: float
    crude_slate_compatibility: float

class EconomicImpactMetrics(BaseModel):
    baseline_crude_price_usd: float
    landed_crude_price_usd: float
    price_increase_pct: float
    import_bill_surge_inr_crores: float
    import_bill_surge_usd_billion: float
    petrol_pump_price_impact_inr_l: float
    diesel_pump_price_impact_inr_l: float
    current_account_deficit_impact_pct_gdp: float
    cpi_inflation_impact_bps: float

class DisruptionScenarioResult(BaseModel):
    scenario_name: str
    duration_days: int
    daily_crude_deficit_bpd: float
    total_shortfall_mbbl: float
    stockout_horizon_without_mitigation_days: float
    refinery_impacts: List[RefineryImpact]
    economic_impact: EconomicImpactMetrics

# --- Module 4: Strategic Petroleum Reserve (ISPRL) Optimization ---
class SPROptimizationRequest(BaseModel):
    daily_supply_gap_bpd: float
    simulation_days: int = 30
    min_military_floor_pct: float = 15.0

class DailyDrawdownStep(BaseModel):
    day: int
    visakhapatnam_drawdown_bpd: float
    mangalore_drawdown_bpd: float
    padur_drawdown_bpd: float
    total_drawdown_bpd: float
    remaining_spr_mbbl: float
    remaining_days_of_cover: float

class SPROptimizationResult(BaseModel):
    total_capacity_mbbl: float = 39.1  # 5.33 MMT
    initial_stock_mbbl: float
    days_extended_by_spr: float
    daily_schedule: List[DailyDrawdownStep]
    replenishment_recommendation: str

# --- Module 5: Adaptive Procurement Orchestration ---
class ProcurementReroutingRequest(BaseModel):
    deficit_bpd: float
    max_acceptable_delay_days: int = 15
    prioritize_cost: float = 0.5  # Weight between 0 (speed) and 1 (cost)

class SourcingAllocation(BaseModel):
    source_country: str
    supplier_name: str
    crude_grade: str
    api_gravity: float
    sulfur_pct: float
    volume_bpd: float
    transport_mode: str
    transit_days: float
    landed_cost_usd_bbl: float
    refinery_fit_score: float

class ReroutingStrategy(BaseModel):
    strategy_id: str
    name: str
    tagline: str
    landed_cost_usd_bbl: float
    cost_delta_vs_baseline_usd: float
    avg_transit_days: float
    overall_refinery_fit: float
    allocations: List[SourcingAllocation]
    executable_tender_json: str
    tender_summary_pdf_text: str

class ProcurementReroutingResult(BaseModel):
    deficit_bpd: float
    strategies: List[ReroutingStrategy]
    recommended_strategy_id: str
