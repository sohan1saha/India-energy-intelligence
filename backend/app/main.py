# main.py: FastAPI Application Entry Point for UrjaAegis AI Engine
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

app = FastAPI(
    title="UrjaAegis AI: Energy Supply Chain Resilience & Procurement Rerouting Engine",
    description="AI-powered Geopolitical Risk Monitoring, Disruption Scenario Modeling, ISPRL SPR Drawdown Optimization, and Executable Procurement Rerouting for Import-Dependent Economies.",
    version="1.0.0"
)

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
    threat_description: str = None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "UrjaAegis AI - Energy Resilience Engine",
        "country_target": "India (88% Crude Import Dependency)",
        "modules": [
            "Geopolitical Risk Intelligence Agent",
            "Energy Supply Chain Digital Twin",
            "Disruption Scenario Modeller",
            "Strategic Reserve (ISPRL) Optimization Agent",
            "Adaptive Procurement Orchestrator",
            "Streaming AI Energy Security Copilot"
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

# 2. Digital Twin
@app.get("/api/digital-twin/state", response_model=EnergyDigitalTwinState)
def get_digital_twin_state():
    return digital_twin_service.get_current_twin_state()

# 3. Disruption Scenario Simulation
@app.post("/api/scenarios/simulate", response_model=DisruptionScenarioResult)
def simulate_disruption_scenario(req: DisruptionScenarioRequest):
    return disruption_modeller_service.simulate_scenario(req)

# 4. ISPRL Strategic Petroleum Reserve Optimization
@app.post("/api/spr/optimize", response_model=SPROptimizationResult)
def optimize_spr_drawdown(req: SPROptimizationRequest):
    return spr_optimizer_service.optimize_drawdown(req)

# 5. Adaptive Procurement Rerouting
@app.post("/api/procurement/reroute", response_model=ProcurementReroutingResult)
def generate_procurement_rerouting(req: ProcurementReroutingRequest):
    return procurement_orchestrator_service.generate_rerouting_strategies(req)

# 6. AI Copilot
@app.post("/api/copilot/chat")
def copilot_chat(req: ChatRequest):
    return copilot_agent_service.process_query(req.message)
