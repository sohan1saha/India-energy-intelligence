# 🇮🇳 India Energy Intelligence (UrjaAegis AI)

> **AI-Driven Energy Supply Chain Resilience Engine for Import-Dependent Economies**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org/)

An enterprise-grade, full-stack AI/ML intelligence and autonomous orchestration platform designed for India's crude oil supply chain. The system continuously monitors geopolitical risks, models cascading disruption scenarios on refining and national economy, optimizes Strategic Petroleum Reserve (ISPRL) drawdowns, and generates executable procurement rerouting plans within hours.

---

## 🎯 Problem Statement & National Context

- **Import Vulnerability**: India imports **~88% of its crude oil**, with **40–45% of total volume transiting the Strait of Hormuz**.
- **Geopolitical Flashpoints**: US-Iran tensions, renewed sanctions on Iranian exports, and attacks on Red Sea shipping lanes (forcing +16-day Cape of Good Hope detours).
- **Fragile Buffer**: India's **Strategic Petroleum Reserves (ISPRL)** at Visakhapatnam (1.33 MMT), Mangalore (1.5 MMT), and Padur (2.5 MMT) cover only **~9.5 days of national consumption**.
- **Core Goal**: Model geopolitical risk in real time, simulate cascading shocks, optimize reserve drawdowns, and generate executable emergency procurement rerouting tenders.

---

## 🏛️ System Architecture: The 5 Illustrative Directions

1. **Geopolitical Risk Intelligence Agent**: Computes dynamic threat scores (0–100) for *Strait of Hormuz*, *Red Sea / Bab-el-Mandeb*, *Malacca*, and *Cape of Good Hope* corridors and key crude suppliers.
2. **Disruption Scenario Modeller**: Simulates Hormuz closures and Red Sea blockades, calculating daily crude deficit (bpd), stockout horizon (days), refinery throughput impact, import bill surge (₹ Cr / $ Bn), petrol/diesel pump price impact (₹/L), and macro GDP/inflation impact.
3. **Adaptive Procurement Orchestrator**: Solves multi-objective rerouting allocations (ADCOP Fujairah bypass, Saudi Yanbu Red Sea terminal, US WTI Midland, Russian ESPO) matching refinery crude-slate compatibility (API & sulfur content), generating 1-click MoPNG tender specs.
4. **Strategic Reserve (ISPRL) Optimisation Agent**: Linear programming model for Padur, Mangalore, and Visakhapatnam cavern drawdowns while strictly enforcing a 15% emergency military floor.
5. **Supply Chain Digital Twin**: Geospatial simulation mapping tankers at sea, SPM berths, refineries, pipelines, and ISPRL caverns.

---

## 🚀 Quick Start & Installation

### Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

---

## 📄 API Endpoints

- `GET  /api/risk/report` - Live Geopolitical Risk Report & Corridor Scores
- `GET  /api/digital-twin/state` - Digital Twin Graph State & ISPRL Reserve Levels
- `POST /api/scenarios/simulate` - Run Disruption Shock Simulation & Macro Economic Impact
- `POST /api/spr/optimize` - ISPRL Reserve Drawdown Linear Programming Solver
- `POST /api/procurement/reroute` - Generate Adaptive Procurement Rerouting Strategies & Tenders
- `POST /api/copilot/chat` - Interactive AI Energy Security Copilot Chat
