'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { RiskRadar } from '@/components/RiskRadar';
import { DigitalTwinMap } from '@/components/DigitalTwinMap';
import { ScenarioSandbox } from '@/components/ScenarioSandbox';
import { SPROptimizerCard } from '@/components/SPROptimizerCard';
import { ProcurementMatrix } from '@/components/ProcurementMatrix';
import { AICopilotDrawer } from '@/components/AICopilotDrawer';
import { TenderModal } from '@/components/TenderModal';
import { Bot } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'cream'>('dark');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState<boolean>(false);

  // Default initial mock state from backend data
  const [corridors, setCorridors] = useState<any[]>([
    {
      id: "c1",
      name: "Strait of Hormuz",
      code: "HORMUZ",
      risk_score: 82.5,
      status: "HIGH_RISK",
      daily_vessel_count: 42,
      transit_delay_days: 4.5,
      war_risk_insurance_pct: 1.25,
      threat_description: "Elevated US-Iran standoff, naval patrols, mine/missile threats along Iranian coast."
    },
    {
      id: "c2",
      name: "Bab-el-Mandeb & Red Sea",
      code: "RED_SEA",
      risk_score: 76.0,
      status: "HIGH_RISK",
      daily_vessel_count: 18,
      transit_delay_days: 16.0,
      war_risk_insurance_pct: 1.50,
      threat_description: "Continuous Houthi missile/drone attacks; major tankers diverted around Cape of Good Hope."
    },
    {
      id: "c3",
      name: "Strait of Malacca",
      code: "MALACCA",
      risk_score: 24.0,
      status: "NORMAL",
      daily_vessel_count: 85,
      transit_delay_days: 0.5,
      war_risk_insurance_pct: 0.05,
      threat_description: "Dense maritime traffic; low geopolitical threat; key for Russian Far East ESPO crude."
    },
    {
      id: "c4",
      name: "Cape of Good Hope",
      code: "CAPE_GH",
      risk_score: 35.0,
      status: "ELEVATED",
      daily_vessel_count: 60,
      transit_delay_days: 15.0,
      war_risk_insurance_pct: 0.15,
      threat_description: "Bunkering congestion at South African ports (Port Louis, Durban) due to Red Sea diversions."
    }
  ]);

  const [simulationResult, setSimulationResult] = useState<any>({
    scenario_name: "Hormuz & Red Sea Disruption",
    duration_days: 30,
    daily_crude_deficit_bpd: 1512000.0,
    total_shortfall_mbbl: 45.36,
    stockout_horizon_without_mitigation_days: 34.2,
    economic_impact: {
      baseline_crude_price_usd: 78.50,
      landed_crude_price_usd: 106.80,
      price_increase_pct: 36.0,
      import_bill_surge_inr_crores: 34500.0,
      import_bill_surge_usd_billion: 4.13,
      petrol_pump_price_impact_inr_l: 14.2,
      diesel_pump_price_impact_inr_l: 16.5,
      current_account_deficit_impact_pct_gdp: 0.48,
      cpi_inflation_impact_bps: 36.0
    }
  });

  const [strategies, setStrategies] = useState<any[]>([
    {
      strategy_id: "strat_bypass",
      name: "Emergency Chokepoint Bypass (ADCOP + Yanbu + ISPRL)",
      tagline: "Fastest delivery (0.5–4.5 days) by utilizing pipeline bypasses in UAE & Saudi Arabia + ISPRL release.",
      landed_cost_usd_bbl: 83.80,
      cost_delta_vs_baseline_usd: 5.30,
      avg_transit_days: 2.8,
      overall_refinery_fit: 0.97,
      allocations: [
        {
          source_country: "UAE (ADCOP Bypass)",
          supplier_name: "ADNOC",
          crude_grade: "Murban Sweet",
          api_gravity: 40.2,
          sulfur_pct: 0.78,
          volume_bpd: 540000,
          transport_mode: "VLCC Direct from Fujairah Terminal",
          transit_days: 3.0,
          landed_cost_usd_bbl: 84.50,
          refinery_fit_score: 0.95
        },
        {
          source_country: "Saudi Arabia (Petroline)",
          supplier_name: "Saudi Aramco",
          crude_grade: "Arab Light",
          api_gravity: 33.4,
          sulfur_pct: 1.97,
          volume_bpd: 420000,
          transport_mode: "VLCC from Yanbu Red Sea Terminal",
          transit_days: 4.5,
          landed_cost_usd_bbl: 86.20,
          refinery_fit_score: 0.98
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
    }
  ]);

  const [activeTender, setActiveTender] = useState<any>(strategies[0]);

  // Fetch backend APIs on load if FastAPI server is active
  useEffect(() => {
    fetch('http://localhost:8000/api/risk/report')
      .then(res => res.json())
      .then(data => {
        if (data.corridors) setCorridors(data.corridors);
      })
      .catch(() => {});
  }, []);

  const handleSimulateScenario = async (hormuz: number, redSea: number, russian: number, duration: number) => {
    try {
      const res = await fetch('http://localhost:8000/api/scenarios/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_name: 'Custom Disruption Simulation',
          hormuz_blockade_pct: hormuz,
          red_sea_blockade_pct: redSea,
          russian_sanctions_tightening_pct: russian,
          duration_days: duration
        })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      // Mock calculation update if backend is offline
      const deficit = (1890000 * (hormuz / 100)) + (1125000 * (redSea / 100) * 0.45);
      setSimulationResult({
        scenario_name: 'Custom Disruption Simulation',
        duration_days: duration,
        daily_crude_deficit_bpd: deficit,
        total_shortfall_mbbl: (deficit * duration) / 1000000,
        stockout_horizon_without_mitigation_days: Number((18.0 / (deficit / 4500000)).toFixed(1)),
        economic_impact: {
          baseline_crude_price_usd: 78.50,
          landed_crude_price_usd: Number((78.5 * (1 + (hormuz * 0.45 / 100))).toFixed(2)),
          price_increase_pct: Number((hormuz * 0.45).toFixed(1)),
          import_bill_surge_inr_crores: Number((deficit * 0.25).toFixed(0)),
          import_bill_surge_usd_billion: Number((deficit * 0.0028).toFixed(2)),
          petrol_pump_price_impact_inr_l: Number((hormuz * 0.18).toFixed(1)),
          diesel_pump_price_impact_inr_l: Number((hormuz * 0.20).toFixed(1)),
          current_account_deficit_impact_pct_gdp: Number((hormuz * 0.006).toFixed(2)),
          cpi_inflation_impact_bps: Number((hormuz * 0.45).toFixed(0))
        }
      });
    }
  };

  const handleOpenTenderModal = (strat?: any) => {
    if (strat) setActiveTender(strat);
    setIsTenderModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-dark-bg text-dark-text' : 'bg-cream-bg text-cream-text'
    }`}>
      {/* Header */}
      <Header
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'dark' ? 'cream' : 'dark')}
        onOpenTenderModal={() => handleOpenTenderModal(strategies[0])}
      />

      {/* Main Container */}
      <main className="p-4 md:p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Direction 1: Risk Radar */}
        <RiskRadar theme={theme} corridors={corridors} />

        {/* Grid 2: Digital Twin Map & Scenario Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6">
            <DigitalTwinMap
              theme={theme}
              nodes={[]}
              daysOfCover={9.5}
              totalReserveMbbl={39.16}
            />
          </div>
          <div className="lg:col-span-6">
            <ScenarioSandbox
              theme={theme}
              onSimulate={handleSimulateScenario}
              simulationResult={simulationResult}
            />
          </div>
        </div>

        {/* Grid 3: SPR Optimizer & Procurement Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5">
            <SPROptimizerCard theme={theme} daysExtended={18.0} />
          </div>
          <div className="lg:col-span-7">
            <ProcurementMatrix
              theme={theme}
              strategies={strategies}
              onOpenTenderModal={(strat) => handleOpenTenderModal(strat)}
            />
          </div>
        </div>
      </main>

      {/* Floating AI Copilot Trigger Button */}
      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-alert-amber text-white shadow-xl hover:bg-amber-700 transition z-40 flex items-center gap-2 text-xs font-bold"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">AI Copilot</span>
      </button>

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        theme={theme}
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Emergency Tender Spec Modal */}
      <TenderModal
        theme={theme}
        isOpen={isTenderModalOpen}
        onClose={() => setIsTenderModalOpen(false)}
        tenderJson={activeTender?.executable_tender_json || ''}
        tenderText={activeTender?.tender_summary_pdf_text || ''}
      />
    </div>
  );
}
