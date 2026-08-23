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

  // Exact math calculation for HTML input range fill percentage considering min and max
  const getTrackStyle = (val: number, min: number, max: number, color: string) => {
    const pct = Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
    const bgTrack = theme === 'dark' ? '#1E293B' : '#7E8C9F';
    return {
      background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, ${bgTrack} ${pct}%, ${bgTrack} 100%)`
    };
  };

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-inherit">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider">Disruption Scenario Modeller</h2>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">Adjust shock levers to model real-time crude deficit and macroeconomic impact</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded font-mono border ${
          theme === 'dark'
            ? 'bg-red-500/10 text-red-400 border-red-500/30'
            : 'bg-red-100 text-red-800 border-red-300 font-bold'
        }`}>
          Macro Stress Testing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Minimalist Sleek Controls */}
        <div className="lg:col-span-5 space-y-4 font-mono">
          {/* Hormuz Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans font-semibold">Strait of Hormuz Blockade</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                {hormuz}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hormuz}
              style={getTrackStyle(hormuz, 0, 100, '#EF4444')}
              onChange={(e) => handleSliderChange(Number(e.target.value), redSea, russian, duration)}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none transition"
            />
          </div>

          {/* Red Sea Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans font-semibold">Red Sea / Suez Suspension</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
                {redSea}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={redSea}
              style={getTrackStyle(redSea, 0, 100, '#F59E0B')}
              onChange={(e) => handleSliderChange(hormuz, Number(e.target.value), russian, duration)}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none transition"
            />
          </div>

          {/* Russian Sanctions Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans font-semibold">Russian Shadow Fleet Sanctions</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'}`}>
                {russian}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={russian}
              style={getTrackStyle(russian, 0, 100, '#06B6D4')}
              onChange={(e) => handleSliderChange(hormuz, redSea, Number(e.target.value), duration)}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-none transition"
            />
          </div>

          {/* Duration Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-sans font-semibold">Crisis Duration</span>
              <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
                {duration} Days
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="90"
              value={duration}
              style={getTrackStyle(duration, 7, 90, '#10B981')}
              onChange={(e) => handleSliderChange(hormuz, redSea, russian, Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Right Column: Real-Time Economic Metrics */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Daily Crude Deficit</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              {simulationResult ? (simulationResult.daily_crude_deficit_bpd / 1000).toFixed(0) : '2089'}k bpd
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Total: {simulationResult?.total_shortfall_mbbl || 62.67}M bbls</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Stockout Horizon</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-amber' : 'text-amber-800'}`}>
              {simulationResult?.stockout_horizon_without_mitigation_days || 38.8} Days
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Without Rerouting</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Import Bill Surge</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              +₹{econ ? econ.import_bill_surge_inr_crores.toLocaleString() : '43,715'} Cr
            </p>
            <span className="text-[10px] text-slate-500 font-medium">+${econ?.import_bill_surge_usd_billion || 5.24}B USD</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Petrol Pump Hike</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-amber' : 'text-amber-800'}`}>
              +₹{econ?.petrol_pump_price_impact_inr_l || 26.5}/L
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Diesel: +₹{econ?.diesel_pump_price_impact_inr_l || 24.0}/L</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Landed Crude Price</span>
            <p className="text-xl font-extrabold">
              ${econ?.landed_crude_price_usd || 117.28}/bbl
            </p>
            <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>+{econ?.price_increase_pct || 49.4}% surge</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">CAD & CPI Inflation</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              +{econ?.current_account_deficit_impact_pct_gdp || 1.86}% GDP
            </p>
            <span className="text-[10px] text-slate-500 font-medium">CPI: +{econ?.cpi_inflation_impact_bps || 140} bps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
