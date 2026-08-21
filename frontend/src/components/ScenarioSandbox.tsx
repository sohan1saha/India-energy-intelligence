'use client';

import React, { useState } from 'react';

interface EconomicImpactMetrics {
  baseline_crude_price_usd: number;
  landed_crude_price_usd: number;
  price_increase_pct: number;
  import_bill_surge_inr_crores: number;
  import_bill_surge_usd_billion: number;
  petrol_pump_price_impact_inr_l: number;
  diesel_pump_price_impact_inr_l: number;
  current_account_deficit_impact_pct_gdp: number;
  cpi_inflation_impact_bps: number;
}

interface DisruptionScenarioResult {
  scenario_name: string;
  duration_days: number;
  daily_crude_deficit_bpd: number;
  total_shortfall_mbbl: number;
  stockout_horizon_without_mitigation_days: number;
  economic_impact: EconomicImpactMetrics;
}

interface ScenarioSandboxProps {
  theme: 'dark' | 'cream';
  onSimulate: (hormuz: number, redSea: number, russian: number, duration: number) => void;
  simulationResult: DisruptionScenarioResult | null;
}

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({
  theme,
  onSimulate,
  simulationResult
}) => {
  const [hormuz, setHormuz] = useState<number>(80);
  const [redSea, setRedSea] = useState<number>(50);
  const [russian, setRussian] = useState<number>(20);
  const [duration, setDuration] = useState<number>(30);

  const handleSliderChange = (h: number, r: number, ru: number, d: number) => {
    setHormuz(h);
    setRedSea(r);
    setRussian(ru);
    setDuration(d);
    onSimulate(h, r, ru, d);
  };

  const econ = simulationResult?.economic_impact;

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <h2 className="text-sm font-bold uppercase tracking-wider">Disruption Scenario Modeller</h2>
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-alert-red/10 text-alert-red border border-alert-red/20 font-mono">
          Macro Stress Testing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 font-mono">Geopolitical Shock Triggers</h3>

          {/* Hormuz Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span>Strait of Hormuz Blockade</span>
              <span className="text-alert-red font-mono">{hormuz}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hormuz}
              onChange={(e) => handleSliderChange(Number(e.target.value), redSea, russian, duration)}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>

          {/* Red Sea Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span>Red Sea / Suez Suspension</span>
              <span className="text-alert-amber font-mono">{redSea}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={redSea}
              onChange={(e) => handleSliderChange(hormuz, Number(e.target.value), russian, duration)}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          {/* Russian Sanctions Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span>Russian Shadow Fleet Sanctions</span>
              <span className="text-alert-cyan font-mono">{russian}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={russian}
              onChange={(e) => handleSliderChange(hormuz, redSea, Number(e.target.value), duration)}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1 font-semibold">
              <span>Crisis Duration (Days)</span>
              <span className="font-mono">{duration} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="90"
              value={duration}
              onChange={(e) => handleSliderChange(hormuz, redSea, russian, Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Right Column: Real-Time Economic Metrics */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">Daily Crude Deficit</span>
            <p className="text-lg font-bold text-alert-red">
              {simulationResult ? (simulationResult.daily_crude_deficit_bpd / 1000).toFixed(0) : '1,512'}k bpd
            </p>
            <span className="text-[10px] text-slate-400">Total: {simulationResult?.total_shortfall_mbbl}M bbls</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">Stockout Horizon</span>
            <p className="text-lg font-bold text-alert-amber">
              {simulationResult?.stockout_horizon_without_mitigation_days || 34.2} Days
            </p>
            <span className="text-[10px] text-slate-400">Without Rerouting</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">Import Bill Surge</span>
            <p className="text-lg font-bold text-alert-red">
              +₹{econ ? econ.import_bill_surge_inr_crores.toLocaleString() : '34,500'} Cr
            </p>
            <span className="text-[10px] text-slate-400">+${econ?.import_bill_surge_usd_billion}B USD</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">Petrol Pump Hike</span>
            <p className="text-lg font-bold text-alert-amber">
              +₹{econ?.petrol_pump_price_impact_inr_l || 14.2}/L
            </p>
            <span className="text-[10px] text-slate-400">Diesel: +₹{econ?.diesel_pump_price_impact_inr_l || 16.5}/L</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">Landed Crude Price</span>
            <p className="text-lg font-bold">
              ${econ?.landed_crude_price_usd || 106.8}/bbl
            </p>
            <span className="text-[10px] text-alert-red">+{econ?.price_increase_pct || 36}% surge</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">CAD & CPI Inflation</span>
            <p className="text-lg font-bold text-alert-red">
              +{econ?.current_account_deficit_impact_pct_gdp || 0.48}% GDP
            </p>
            <span className="text-[10px] text-slate-400">CPI: +{econ?.cpi_inflation_impact_bps || 36} bps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
