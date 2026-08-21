# main.py: FastAPI Application Entry Point for UrjaAegis AI Engine
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.models.schemas import (
    GeopoliticalRiskReport,
    EnergyDigitalTwinState,
    DisruptionScenarioRequest,
    DisruptionScenarioResult,
    SPROptimizationRequest,
    SPROptimizationResult,
    ProcurementReroutingRequest,
    ProcurementReroutingResult
)
from app.services.risk_agent import risk_agent_service
from app.services.digital_twin import digital_twin_service
from app.services.disruption_modeller import disruption_modeller_service
from app.services.spr_optimizer import spr_optimizer_service
from app.services.procurement_orchestrator import procurement_orchestrator_service
from app.services.copilot_agent import copilot_agent_service

# Enterprise Extension Services: AIS Satellite Streaming, PostGIS Database, 23 Indian Refineries VDU LP Optimizer
from app.services.ais_stream import ais_stream_service
from app.database import init_db
from app.services.refinery_vdu_lp import refinery_vdu_lp_service

app = FastAPI(
    title="UrjaAegis AI: Energy Supply Chain Resilience Engine",
    description="AI-powered Geopolitical Risk Monitoring, Live Satellite AIS Stream, PostGIS Spatial Graph Data, 23 Indian Refineries VDU LP Optimization, ISPRL SPR Drawdown Solver, and Procurement Rerouting.",
    version="1.1.0"
)

# Initialize PostGIS / Spatial Database tables on startup
@app.on_event("startup")
def on_startup():
    try:
        init_db()
        print("[UrjaAegis DB] Spatial Database / PostGIS engine initialized successfully.")
    except Exception as e:
        print(f"[UrjaAegis DB Warning] PostGIS init error: {e}")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class RiskUpdateRequest(BaseModel):
    corridor_code: str
    new_risk_score: float
    threat_description: Optional[str] = None

class VDUOptimizeRequest(BaseModel):
    crude_options: Optional[List[Dict[str, Any]]] = None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "UrjaAegis AI - Energy Resilience Engine",
        "country_target": "India (88% Crude Import Dependency)",
        "modules": [
            "Geopolitical Risk Intelligence Agent",
            "Energy Supply Chain Digital Twin (PostGIS)",
            "Live Satellite AIS Telemetry Stream (Spire / MarineTraffic)",
            "Disruption Scenario Modeller",
            "Strategic Reserve (ISPRL) Optimization Agent",
            "23 Indian Refineries VDU Linear Programming Optimizer",
            "Adaptive Procurement Orchestrator",
            "Streaming Urja Sathi AI Assistant"
        ]
    }

# 1. Risk Intelligence
@app.get("/api/risk/report", response_model=GeopoliticalRiskReport)
def get_risk_report():
    return risk_agent_service.get_latest_risk_report()

@app.post("/api/risk/update")
def update_corridor_risk(req: RiskUpdateRequest):
    try:
        updated = risk_agent_service.update_corridor_risk(req.corridor_code, req.new_risk_score, req.threat_description)
        return {"status": "success", "corridor": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# 2. Digital Twin & Live Satellite AIS Telemetry
@app.get("/api/digital-twin/state", response_model=EnergyDigitalTwinState)
def get_digital_twin_state():
    return digital_twin_service.get_current_twin_state()

@app.get("/api/telemetry/live-vessels")
def get_live_satellite_ais_vessels():
    """Fetch real-time vessel positions from Spire / MarineTraffic satellite AIS feeds."""
    return {
        "status": "active",
        "timestamp_utc": "2026-08-22T03:02:00Z",
        "vessels": ais_stream_service.fetch_live_vessel_telemetry()
    }

# 3. Disruption Scenario Simulation
@app.post("/api/scenarios/simulate", response_model=DisruptionScenarioResult)
def simulate_disruption_scenario(req: DisruptionScenarioRequest):
    return disruption_modeller_service.simulate_scenario(req)

# 4. ISPRL Strategic Petroleum Reserve Optimization
@app.post("/api/spr/optimize", response_model=SPROptimizationResult)
def optimize_spr_drawdown(req: SPROptimizationRequest):
    return spr_optimizer_service.optimize_drawdown(req)

# 5. 23 Indian Refineries Vacuum Distillation Unit (VDU) LP Optimization
@app.get("/api/refineries/all")
def get_all_23_indian_refineries():
    """Return comprehensive metadata for all 23 active oil refineries across India."""
    return {
        "total_count": len(refinery_vdu_lp_service.refineries),
        "refineries": refinery_vdu_lp_service.refineries
    }

@app.post("/api/refineries/vdu-optimize")
def optimize_all_refineries_vdu(req: VDUOptimizeRequest):
    """Solve Linear Programming (linprog) VDU crude slate blending across all 23 Indian refineries."""
    default_crudes = [
        {"name": "ADNOC Murban Sweet", "api_gravity": 40.2, "sulfur_pct": 0.75},
        {"name": "Saudi Arab Light", "api_gravity": 33.4, "sulfur_pct": 1.95},
        {"name": "Basrah Heavy", "api_gravity": 24.1, "sulfur_pct": 3.80},
        {"name": "US WTI Midland", "api_gravity": 42.0, "sulfur_pct": 0.20},
        {"name": "Russian ESPO", "api_gravity": 35.6, "sulfur_pct": 0.55}
    ]
    crudes = req.crude_options if req.crude_options else default_crudes
    return refinery_vdu_lp_service.optimize_vdu_crude_slate(crudes)

# 6. Adaptive Procurement Rerouting
@app.post("/api/procurement/reroute", response_model=ProcurementReroutingResult)
def generate_procurement_rerouting(req: ProcurementReroutingRequest):
    return procurement_orchestrator_service.generate_rerouting_strategies(req)

# 7. Urja Sathi AI Assistant
@app.post("/api/copilot/chat")
def copilot_chat(req: ChatRequest):
    return copilot_agent_service.process_query(req.message)
