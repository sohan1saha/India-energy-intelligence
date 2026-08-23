'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DigitalTwinMap } from '@/components/DigitalTwinMap';
import { RiskRadar } from '@/components/RiskRadar';
import { ScenarioSandbox, calculateDisruptionScenario } from '@/components/ScenarioSandbox';
import { SPROptimizerCard } from '@/components/SPROptimizerCard';
import { ProcurementMatrix } from '@/components/ProcurementMatrix';
import { GeopoliticalNewsFeed } from '@/components/GeopoliticalNewsFeed';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { ShieldAlert, Database, Activity, Navigation, Flame } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'cream'>('dark');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>('strat_bypass');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Initial Scenario State computed with exact 3-lever math engine (80% Hormuz, 50% Red Sea, 30 Days)
  const [simulationResult, setSimulationResult] = useState<any>(calculateDisruptionScenario(80, 50, 30));

  const [corridors, setCorridors] = useState<any[]>([
    {
      id: "corridor_hormuz",
      code: "hormuz",
      name: "Strait of Hormuz",
      risk_score: 82.5,
      threat_score: 82.5,
      risk_level: "HIGH_RISK",
      transit_delay_days: 4.5,
      war_risk_insurance_pct: 1.25,
      war_insurance_surcharge_pct: 1.25,
      daily_volume_mbpd: 21.0,
      bypass_route_available: true,
      threat_description: "High Tension Standoff • Coastal Battery Deployment • 45% India Crude Baseline Transits Here",
      status_summary: "High Tension Standoff • Coastal Battery Deployment • 45% India Crude Baseline Transits Here"
    },
    {
      id: "corridor_red_sea",
      code: "red_sea",
      name: "Bab-el-Mandeb & Red Sea",
      risk_score: 76.0,
      threat_score: 76.0,
      risk_level: "HIGH_RISK",
      transit_delay_days: 16.0,
      war_risk_insurance_pct: 1.50,
      war_insurance_surcharge_pct: 1.50,
      daily_volume_mbpd: 4.8,
      bypass_route_available: true,
      threat_description: "Houthi Missile & Drone Hazards • Cape Route Detours Active (+16 Days Transit)",
      status_summary: "Houthi Missile & Drone Hazards • Cape Route Detours Active (+16 Days Transit)"
    },
    {
      id: "corridor_cape_gh",
      code: "cape_gh",
      name: "Cape of Good Hope",
      risk_score: 35.0,
      threat_score: 35.0,
      risk_level: "MODERATE_RISK",
      transit_delay_days: 0.0,
      war_risk_insurance_pct: 0.15,
      war_insurance_surcharge_pct: 0.15,
      daily_volume_mbpd: 6.2,
      bypass_route_available: true,
      threat_description: "Secondary Cape Bypass Active • High Bunker Fuel Burn • Safe Transatlantic Passage",
      status_summary: "Secondary Cape Bypass Active • High Bunker Fuel Burn • Safe Transatlantic Passage"
    },
    {
      id: "corridor_malacca",
      code: "malacca",
      name: "Strait of Malacca",
      risk_score: 24.0,
      threat_score: 24.0,
      risk_level: "LOW_RISK",
      transit_delay_days: 0.0,
      war_risk_insurance_pct: 0.05,
      war_insurance_surcharge_pct: 0.05,
      daily_volume_mbpd: 16.0,
      bypass_route_available: true,
      threat_description: "Normal Traffic Flow • Far East & Russian ESPO Strategic Corridor Active",
      status_summary: "Normal Traffic Flow • Far East & Russian ESPO Strategic Corridor Active"
    }
  ]);

  const [strategies, setStrategies] = useState<any[]>([
    {
      strategy_id: "strat_bypass",
      name: "Emergency Chokepoint Bypass (ADCOP Fujairah + Yanbu Petroline)",
      tagline: "Reroutes Arabian Gulf crude via Habshan-Fujairah pipeline (UAE) & Saudi East-West Petroline to Red Sea.",
      landed_cost_usd_bbl: 83.80,
      cost_delta_vs_baseline_usd: 5.30,
      avg_transit_days: 2.8,
      overall_refinery_fit: 0.97,
      allocations: [
        {
          source_country: "United Arab Emirates (ADCOP)",
          supplier_name: "ADNOC",
          crude_grade: "Murban Sweet",
          api_gravity: 40.2,
          sulfur_pct: 0.78,
          volume_bpd: 960000,
          transport_mode: "Habshan-Fujairah Pipeline ➔ Fujairah SPM ➔ Vadinar SPM",
          transit_days: 2.5,
          landed_cost_usd_bbl: 84.10,
          refinery_fit_score: 0.97
        },
        {
          source_country: "ISPRL Strategic Reserves",
          supplier_name: "ISPRL (Padur & Mangalore)",
          crude_grade: "Arab / Basrah Sour Blend",
          api_gravity: 32.0,
          sulfur_pct: 2.10,
          volume_bpd: 240000,
          transport_mode: "Subsea Pipeline to MRPL & Coastal Barges",
          transit_days: 0.5,
          landed_cost_usd_bbl: 78.50,
          refinery_fit_score: 1.00
        }
      ],
      executable_tender_json: JSON.stringify({
        tender_id: "MoPNG/EMERGENCY/2026-08/STRAT-1",
        issuer: "Ministry of Petroleum & Natural Gas / IOCL Chartering",
        total_volume_bpd: 1200000,
        target_delivery_ports: ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"],
        execution_lead_time_hours: 6
      }, null, 2),
      tender_summary_pdf_text: "EMERGENCY DIRECTIVE: Dispatch 3 VLCCs to Fujairah ADCOP terminal (UAE) and 2 VLCCs to Yanbu Red Sea terminal. Initiate 240,000 bpd drawdown from Padur & Mangalore ISPRL caverns immediately."
    },
    {
      strategy_id: "strat_global_pivot",
      name: "Global Atlantic & Far East Pivot (WTI + Bonny Light + ESPO)",
      tagline: "Diversifies sourcing away from Middle Eastern chokepoints via Atlantic, US Gulf, and Russian Kozmino routes.",
      landed_cost_usd_bbl: 87.10,
      cost_delta_vs_baseline_usd: 8.60,
      avg_transit_days: 23.3,
      overall_refinery_fit: 0.88,
      allocations: [
        {
          source_country: "Nigeria",
          supplier_name: "NNPC",
          crude_grade: "Bonny Light",
          api_gravity: 35.3,
          sulfur_pct: 0.15,
          volume_bpd: 480000,
          transport_mode: "Suezmax via Cape Route",
          transit_days: 22.0,
          landed_cost_usd_bbl: 88.70,
          refinery_fit_score: 0.88
        },
        {
          source_country: "United States (Gulf Coast)",
          supplier_name: "Enterprise / Chevron",
          crude_grade: "WTI Midland",
          api_gravity: 40.5,
          sulfur_pct: 0.20,
          volume_bpd: 420000,
          transport_mode: "VLCC Transatlantic via Cape Route",
          transit_days: 34.0,
          landed_cost_usd_bbl: 89.50,
          refinery_fit_score: 0.85
        }
      ],
      executable_tender_json: JSON.stringify({
        tender_id: "MoPNG/GLOBAL-PIVOT/2026-08/STRAT-2",
        issuer: "Indian Oil Corporation / BPCL Joint Procurement",
        total_volume_bpd: 1200000,
        execution_lead_time_hours: 12
      }, null, 2),
      tender_summary_pdf_text: "GLOBAL TENDER: Issue spot purchase orders for 480k bpd West African Bonny Light, 420k bpd US WTI Midland, and 300k bpd Russian ESPO via Kozmino port."
    },
    {
      strategy_id: "strat_far_east",
      name: "Far East & Russian ESPO Strategic Corridor (Kozmino + Sakhalin + Visakh)",
      tagline: "Fast Pacific & Malacca corridor utilizing Rupee-Ruble settlement and Russian Far East terminals.",
      landed_cost_usd_bbl: 81.50,
      cost_delta_vs_baseline_usd: 3.00,
      avg_transit_days: 11.5,
      overall_refinery_fit: 0.94,
      allocations: [
        {
          source_country: "Russia (Pacific Kozmino)",
          supplier_name: "Rosneft",
          crude_grade: "ESPO Blend",
          api_gravity: 35.6,
          sulfur_pct: 0.52,
          volume_bpd: 600000,
          transport_mode: "Aframax Fleet via Kozmino -> Malacca -> Paradip",
          transit_days: 12.0,
          landed_cost_usd_bbl: 80.50,
          refinery_fit_score: 0.94
        }
      ],
      executable_tender_json: JSON.stringify({
        tender_id: "MoPNG/FAR-EAST/2026-08/STRAT-3",
        issuer: "HPCL / IOCL Joint Far East Chartering",
        total_volume_bpd: 1200000,
        execution_lead_time_hours: 8
      }, null, 2),
      tender_summary_pdf_text: "FAR EAST DIRECTIVE: Charter 6 Aframax vessels for Kozmino & De-Kastri terminals. Activate Visakhapatnam ISPRL cavern drawdown for East Coast refiners."
    },
    {
      strategy_id: "strat_latam",
      name: "Latin American Heavy-Sweet Blend (Brazil Tupi + Guyana Liza + Vasconia)",
      tagline: "Transatlantic South American route bypassing Middle Eastern geopolitical risk corridors completely.",
      landed_cost_usd_bbl: 85.90,
      cost_delta_vs_baseline_usd: 7.40,
      avg_transit_days: 28.0,
      overall_refinery_fit: 0.91,
      allocations: [
        {
          source_country: "Brazil (Santos Basin)",
          supplier_name: "Petrobras",
          crude_grade: "Lula / Tupi Medium",
          api_gravity: 29.8,
          sulfur_pct: 0.37,
          volume_bpd: 480000,
          transport_mode: "VLCC Transatlantic via South Atlantic -> Cape",
          transit_days: 26.0,
          landed_cost_usd_bbl: 85.20,
          refinery_fit_score: 0.92
        }
      ],
      executable_tender_json: JSON.stringify({
        tender_id: "MoPNG/LATAM-PIVOT/2026-08/STRAT-4",
        issuer: "Reliance Jamnagar & Nayara Joint Sourcing",
        total_volume_bpd: 1200000,
        execution_lead_time_hours: 16
      }, null, 2),
      tender_summary_pdf_text: "LATAM DIRECTIVE: Issue long-term term-contracts for Petrobras Tupi and Guyanese Liza crude. Dispatch 4 VLCCs via South Atlantic route."
    },
    {
      strategy_id: "strat_national_surge",
      name: "National Reserve Drawdown & Domestic Surge (ISPRL 100% + ONGC Offshore)",
      tagline: "Immediate domestic defense response activating 100% ISPRL cavern release + ONGC Mumbai High surge.",
      landed_cost_usd_bbl: 77.20,
      cost_delta_vs_baseline_usd: -1.30,
      avg_transit_days: 0.8,
      overall_refinery_fit: 0.99,
      allocations: [
        {
          source_country: "ISPRL National Caverns",
          supplier_name: "ISPRL Ministry of Petroleum",
          crude_grade: "National Strategic Reserve Blend",
          api_gravity: 32.5,
          sulfur_pct: 1.85,
          volume_bpd: 840000,
          transport_mode: "Subsea Pipelines to MRPL/Visakh & Coastal Barges to Jamnagar",
          transit_days: 0.5,
          landed_cost_usd_bbl: 76.50,
          refinery_fit_score: 1.00
        }
      ],
      executable_tender_json: JSON.stringify({
        tender_id: "MoPNG/NATIONAL-DEFENSE/2026-08/STRAT-5",
        issuer: "Cabinet Committee on Economic Affairs (CCEA) Emergency Order",
        total_volume_bpd: 1200000,
        execution_lead_time_hours: 2
      }, null, 2),
      tender_summary_pdf_text: "NATIONAL DEFENSE ORDER: CCEA authorizes maximum 840,000 bpd drawdown across all ISPRL rock caverns and 360,000 bpd ONGC Mumbai High production surge."
    }
  ]);

  useEffect(() => {
    fetch('/api/risk/report')
      .then(res => res.json())
      .then(data => {
        if (data.corridors && data.corridors.length > 0) {
          setCorridors(data.corridors);
        }
      })
      .catch(() => {
        fetch('http://localhost:8000/api/risk/report')
          .then(res => res.json())
          .then(data => {
            if (data.corridors && data.corridors.length > 0) {
              setCorridors(data.corridors);
            }
          })
          .catch(() => {});
      });

    fetch('/api/procurement/reroute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deficit_bpd: 1200000.0 })
    })
      .then(res => res.json())
      .then(data => {
        if (data.strategies && data.strategies.length > 0) {
          setStrategies(data.strategies);
        }
      })
      .catch(() => {});
  }, []);

  const handleSimulateScenario = async (hormuz: number, redSea: number, duration: number) => {
    try {
      const res = await fetch('/api/scenarios/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_name: 'Custom Disruption Simulation',
          hormuz_blockade_pct: hormuz,
          red_sea_blockade_pct: redSea,
          russian_sanctions_tightening_pct: 0,
          duration_days: duration
        })
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      setSimulationResult(calculateDisruptionScenario(hormuz, redSea, duration));
    }
  };

  const handleSelectNode = (codeId: string | null) => {
    setSelectedNodeId(codeId);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-cream-bg text-cream-text'
    }`}>
      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'dark' ? 'cream' : 'dark')}
      />

      {/* Main Command Center Container */}
      <main className="p-4 md:p-6 space-y-6 max-w-[1720px] mx-auto">
        
        {/* TIER 1: TOP HERO KPI BANNER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>NATIONAL RISK INDEX</span>
              <ShieldAlert className="w-4 h-4 text-alert-red" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-alert-red">72.2</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-alert-red/10 text-alert-red border border-alert-red/30">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">Hormuz & Red Sea Chokepoint Alerts Active</p>
          </div>

          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>ISPRL STRATEGIC RESERVE</span>
              <Database className="w-4 h-4 text-alert-emerald" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-alert-emerald">9.5 Days</span>
              <span className="text-xs text-slate-400">39.16M bbls</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">Visakhapatnam, Mangalore & Padur Caverns</p>
          </div>

          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>DAILY CRUDE IMPORTS</span>
              <Activity className="w-4 h-4 text-alert-amber" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-alert-amber">4.5M bpd</span>
              <span className="text-xs text-alert-amber font-semibold">88% Import Dep.</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">45% Volume Transits Strait of Hormuz</p>
          </div>

          <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>SUPERTANKERS AT SEA</span>
              <Navigation className="w-4 h-4 text-alert-cyan" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-alert-cyan">3 VLCCs</span>
              <span className="text-xs text-slate-400">35.5M bbls</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">Indian Ocean & Arabian Sea Corridors</p>
          </div>
        </div>

        {/* TIER 2: FULL-WIDTH SUPPLY CHAIN DIGITAL TWIN GIS MAP */}
        <div className="w-full">
          <DigitalTwinMap
            theme={theme}
            nodes={[]}
            daysOfCover={9.5}
            totalReserveMbbl={39.16}
            selectedNodeId={selectedNodeId}
            selectedStrategyId={selectedStrategyId}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* TIER 3: GEOPOLITICAL RISK INTELLIGENCE AGENT */}
        <div className="w-full">
          <RiskRadar
            theme={theme}
            corridors={corridors}
            selectedNodeId={selectedNodeId}
            onSelectCorridor={(codeId) => handleSelectNode(selectedNodeId === codeId ? null : codeId)}
          />
        </div>

        {/* TIER 4: SECONDARY SPLIT GRID (60% Scenario Sandbox / 40% ISPRL Optimizer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 flex flex-col">
            <ScenarioSandbox
              theme={theme}
              onSimulate={handleSimulateScenario}
              simulationResult={simulationResult}
            />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <SPROptimizerCard
              theme={theme}
              daysExtended={18.0}
              selectedNodeId={selectedNodeId}
              onSelectCavern={(cavernId) => handleSelectNode(selectedNodeId === cavernId ? null : cavernId)}
            />
          </div>
        </div>

        {/* TIER 5: FULL-WIDTH ACTION COMMAND SECTION (Adaptive Procurement Orchestrator & Inline Spec) */}
        <div className="w-full">
          <ProcurementMatrix
            theme={theme}
            strategies={strategies}
            selectedStrategyId={selectedStrategyId}
            onSelectStrategy={(id) => setSelectedStrategyId(id)}
          />
        </div>

        {/* TIER 6: LIVE GEOPOLITICAL & MARITIME NEWS INTELLIGENCE WIRE (RESTORED) */}
        <div className="w-full">
          <GeopoliticalNewsFeed
            theme={theme}
            onSelectLocation={handleSelectNode}
          />
        </div>

      </main>

      {/* Floating Urja Sathi AI Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-alert-amber text-white shadow-xl hover:bg-amber-700 transition z-40 flex items-center gap-2 text-xs font-bold"
      >
        <Flame className="w-5 h-5 text-amber-200 animate-pulse" />
        <span className="hidden sm:inline">Urja Sathi</span>
      </button>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        theme={theme}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
}
