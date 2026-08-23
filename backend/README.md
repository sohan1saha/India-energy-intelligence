# UrjaAegis AI — Backend Python Architecture Guide

This document provides a comprehensive technical reference for all Python source code files powering the **UrjaAegis AI (ऊα)** backend engine.

---

## 📁 Directory Structure Overview

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                          # FastAPI Application Entry Point & Route Definitions
│   ├── database.py                      # PostgreSQL / PostGIS Spatial Database ORM & Fallback Engine
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py                   # Pydantic Schemas & Data Contracts
│   ├── data/
│   │   ├── __init__.py
│   │   └── seed_data.py                 # Reference Seed Data (23 Refineries, ISPRL Caverns, Crude Slates)
│   └── services/
│       ├── __init__.py
│       ├── risk_agent.py                # Geopolitical Risk Intelligence Scoring Engine
│       ├── digital_twin.py              # Energy Supply Chain GIS Digital Twin State Manager
│       ├── ais_stream.py                # Live Satellite AIS Telemetry Client (Spire / MarineTraffic)
│       ├── disruption_modeller.py       # Macroeconomic Shock & Fuel Pump Price Simulator
│       ├── spr_optimizer.py             # ISPRL Underground Reserve LP Drawdown Solver (Simplex/Interior-Point)
│       ├── refinery_vdu_lp.py           # 23 Indian Refineries VDU Linear Programming Optimizer
│       ├── procurement_orchestrator.py   # Adaptive Procurement Rerouting Matrix & Tender Generator
│       └── copilot_agent.py             # Urja Sathi AI (ऊर्जा साथी) Natural Language Engine
└── tests/
    └── test_all_services.py             # Automated Pytest Validation Suite
```

---

## ⚙️ Core Files & Detailed Descriptions

### 1. `app/main.py`
- **Purpose**: FastAPI Application Entry Point & Web Server Configuration.
- **Key Responsibilities**:
  - Initializes FastAPI application instance with metadata and OpenAPI configuration.
  - Mounts CORS middleware allowing cross-origin requests from Next.js frontend environments.
  - Triggers database initialization (`init_db()`) upon startup.
  - Exposes RESTful endpoints:
    - `GET /`: Health check and system status.
    - `GET /api/risk/report` & `POST /api/risk/update`: Geopolitical risk report retrieval and manual score overrides.
    - `GET /api/digital-twin/state`: Current GIS digital twin node graph state.
    - `GET /api/telemetry/live-vessels`: Live satellite AIS vessel telemetry.
    - `GET /api/refineries/all` & `POST /api/refineries/vdu-optimize`: Metadata and VDU LP optimization across all 23 refineries.
    - `POST /api/scenarios/simulate`: Macroeconomic disruption shock simulation.
    - `POST /api/spr/optimize`: ISPRL cavern drawdown optimization.
    - `POST /api/procurement/reroute`: Procurement rerouting strategies and 1-click MoPNG tender generation.
    - `POST /api/copilot/chat`: Interactive chat handler for **Urja Sathi AI (ऊर्जा साथी)**.

---

### 2. `app/database.py`
- **Purpose**: Spatial Database Integration & PostgreSQL / PostGIS ORM Layer.
- **Key Responsibilities**:
  - Configures SQLAlchemy engine connecting to PostgreSQL / PostGIS database (or SQLite fallback).
  - Defines ORM spatial data models:
    - `PostGISVesselLocation`: Tracks real-time vessel MMSI, IMO, coordinates, heading, speed, and destination berth.
    - `PostGISRefineryNode`: Spatial node model for crude refineries, capacities, VDU limits, and assay tolerances.
    - `PostGISISPRLCavern`: Underground rock cavern storage levels, maximum drawdown rates, and military floor constraints.
  - Provides `init_db()` table creation and `get_db()` session dependency.
  - Includes a zero-dependency in-memory spatial engine for environments without SQLAlchemy.

---

### 3. `app/models/schemas.py`
- **Purpose**: Pydantic Data Models & Type Validation Contracts.
- **Key Responsibilities**:
  - Defines strictly-typed request and response structures across the entire backend:
    - `CorridorRisk`: Risk score ($R_c$), risk level, transit delay, and war insurance surcharges for maritime transit corridors.
    - `GeopoliticalRiskReport`: Composite national energy risk index ($0 - 100$) and corridor alerts.
    - `DigitalTwinNode` & `EnergyDigitalTwinState`: Graph node representation for refineries, SPM berths, caverns, and tankers.
    - `DisruptionScenarioRequest` & `DisruptionScenarioResult`: Inputs for Hormuz/Red Sea blockades and economic outputs (landed crude price, import bill surge, retail petrol/diesel pump price impact, CPI inflation).
    - `SPROptimizationRequest` & `SPROptimizationResult`: Shortfall inputs and LP drawdown allocations across Padur, Mangalore, and Visakhapatnam.
    - `ProcurementReroutingRequest` & `ProcurementReroutingResult`: Multi-objective rerouting strategies and downloadable MoPNG tender specifications.

---

### 4. `app/data/seed_data.py`
- **Purpose**: System Baseline Reference Data & Crude Assay Parameters.
- **Key Responsibilities**:
  - Contains authoritative static datasets for India's energy infrastructure:
    - **Refineries**: Capacity, location coordinates, VDU specs, and crude assay constraints for all 23 refineries (Reliance Jamnagar DTA/SEZ, Nayara Vadinar, IOCL Paradip/Koyali/Panipat, BPCL Mumbai/Kochi, HPCL Visakh/Mumbai/Barmer, MRPL Mangalore, etc.).
    - **ISPRL Caverns**: Padur (2.5 MMT), Mangalore (1.5 MMT), and Visakhapatnam (1.33 MMT).
    - **SPM Berths**: Deepwater offloading berths at Vadinar, Mundra, Mangalore, and Paradip.
    - **Crude Oil Grades**: API gravity, sulfur percentage, and VGO distillate yield parameters for Murban, Basrah Heavy, Saudi Arab Light, US WTI Midland, and Russian ESPO.

---

### 5. `app/services/risk_agent.py`
- **Purpose**: Geopolitical Risk Intelligence Scoring Agent.
- **Key Responsibilities**:
  - Computes dynamic threat scores $R_c \in [0, 100]$ for all key transit corridors (Strait of Hormuz, Bab-el-Mandeb & Red Sea, Strait of Malacca, Cape of Good Hope):
    $$R_c = \min\left(100, \, w_1 \cdot I_{\text{conflict}} + w_2 \cdot \Delta T_{\text{transit}} + w_3 \cdot P_{\text{war\_insurance}} + w_4 \cdot \rho_{\text{density}}\right)$$
  - Evaluates risk classification tiers: `LOW_RISK` ($R_c < 40$), `MODERATE_RISK` ($40 \le R_c < 70$), and `HIGH_RISK` ($R_c \ge 70$).
  - Calculates composite National Energy Risk Index.

---

### 6. `app/services/digital_twin.py`
- **Purpose**: Energy Supply Chain GIS Digital Twin State Engine.
- **Key Responsibilities**:
  - Maintains state graph connecting overseas loading ports, chokepoints, supertankers, coastal SPM berths, refineries, and underground caverns.
  - Computes real-time vessel position drift and returns spatial network nodes for interactive Leaflet map rendering.

---

### 7. `app/services/ais_stream.py`
- **Purpose**: Live Satellite AIS Telemetry Client.
- **Key Responsibilities**:
  - Connects to **Spire Maritime API** and **MarineTraffic API** endpoints using Python `urllib.request`.
  - Ingests real-time vessel MMSI, IMO, latitude, longitude, speed in knots, heading, ETA, and cargo slate.
  - Provides active mathematical spatial drift fallback for continuous high-frequency telemetry when API keys are unconfigured.

---

### 8. `app/services/disruption_modeller.py`
- **Purpose**: Macroeconomic Disruption Shock & Price Impact Simulator.
- **Key Responsibilities**:
  - Simulates supply shortfall ($\mathcal{D}_{\text{shortfall}}$) under partial or full corridor blockades over custom crisis durations (e.g., 30 days).
  - Calculates unmitigated national stockout horizon in days.
  - Implements econometric elasticity formulas predicting:
    - Landed crude cost surge ($/bbl).
    - Retail petrol & diesel pump price increases (+₹14.20/L petrol, +₹16.50/L diesel).
    - Import bill surge in ₹ Crores and $ USD ($4.13B).
    - CPI inflation impact (+36 basis points) and Current Account Deficit impact.

---

### 9. `app/services/spr_optimizer.py`
- **Purpose**: ISPRL Underground Reserve Linear Programming (LP) Drawdown Solver.
- **Key Responsibilities**:
  - Solves linear programming optimization across Padur, Mangalore, and Visakhapatnam caverns.
  - Minimizes combined drawdown cost and pipeline transport cost:
    $$\min \sum_{c} \left( C_c^{\text{draw}} \cdot d_c + C_c^{\text{pipeline}} \cdot p_c \right)$$
  - **Enforces mandatory 15% military defense floor constraint** ($S_c \ge 0.15 \cdot S_c^{\text{capacity}}$) preventing defense depletion.

---

### 10. `app/services/refinery_vdu_lp.py`
- **Purpose**: All 23 Indian Refineries Vacuum Distillation Unit (VDU) LP Optimizer.
- **Key Responsibilities**:
  - Implements SciPy Linear Programming solver (`scipy.optimize.linprog`) across **all 23 active oil refineries in India**.
  - Maximizes Vacuum Gas Oil (VGO) distillate yield:
    $$\max \sum_{r=1}^{23} \sum_{k} \left( \text{VGO\_Yield}_{r,k} \cdot V_{r,k} \right)$$
  - Enforces VDU intake capacity limits, max sulfur ceiling constraints, and min/max API gravity tolerances per refinery.

---

### 11. `app/services/procurement_orchestrator.py`
- **Purpose**: Adaptive Procurement Rerouting Matrix & Tender Generator.
- **Key Responsibilities**:
  - Formulates 5 distinct emergency crude rerouting strategies:
    1. *Emergency Chokepoint Bypass (ADCOP Fujairah + Yanbu Petroline)*
    2. *Global Atlantic & Far East Pivot (WTI + Bonny Light + ESPO)*
    3. *Far East & Russian ESPO Strategic Corridor (Kozmino + Sakhalin)*
    4. *Latin American Heavy-Sweet Blend (Brazil Tupi + Guyana Liza)*
    5. *National Reserve Drawdown & Domestic Surge (ISPRL + ONGC)*
  - Generates downloadable, 1-click MoPNG emergency tender specifications in JSON and summary text in **< 5 seconds**.

---

### 12. `app/services/copilot_agent.py`
- **Purpose**: Urja Sathi AI (ऊर्जा साथी) Natural Language Engine.
- **Key Responsibilities**:
  - Processes natural language energy security queries from decision-makers.
  - Handles intent recognition for:
    - Crude oil market prices & landed import basket costs ($78.50/bbl).
    - Live supertanker tracking and cargo volume conversions (bbls to gallons/litres).
    - Fujairah ADCOP and Saudi Yanbu pipeline bypasses.
    - Disruption scenario price shocks.
    - ISPRL cavern stock levels and drawdown limits.
    - Refinery assay crude compatibility.

---

### 13. `tests/test_all_services.py`
- **Purpose**: Automated Pytest Test Suite.
- **Key Responsibilities**:
  - Executes comprehensive unit and integration tests across all backend services.
  - Verifies risk report generation, digital twin state structure, scenario simulation calculations, SPR LP drawdown limits, refinery VDU optimization, and AIS vessel telemetry.
