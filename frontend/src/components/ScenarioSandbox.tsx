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

  // Track gradient fill styling helper
  const getTrackStyle = (val: number, max: number, activeColor: string) => {
    const pct = (val / max) * 100;
    const bgTrack = theme === 'dark' ? '#1E293B' : '#7E8C9F';
    return {
      background: `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${pct}%, ${bgTrack} ${pct}%, ${bgTrack} 100%)`
    };
  };

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider">Disruption Scenario Modeller</h2>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">Drag sliders or tap preset chips to simulate geopolitical crude import shocks</p>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded font-mono border ${
          theme === 'dark'
            ? 'bg-red-500/10 text-red-400 border-red-500/30'
            : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          Macro Stress Testing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 font-mono">Geopolitical Shock Triggers</h3>

          {/* Hormuz Slider */}
          <div className="p-3 rounded-lg border border-inherit bg-slate-800/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold">Strait of Hormuz Blockade</span>
              <span className={`px-2 py-0.5 text-xs font-mono font-extrabold rounded border ${
                theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-red-100 text-red-900 border-red-400'
              }`}>
                {hormuz}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={hormuz}
              style={getTrackStyle(hormuz, 100, '#EF4444')}
              onChange={(e) => handleSliderChange(Number(e.target.value), redSea, russian, duration)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none transition-all shadow-inner"
            />
            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px]">
              <span className="text-slate-500">Presets:</span>
              {[0, 25, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSliderChange(preset, redSea, russian, duration)}
                  className={`px-1.5 py-0.5 rounded border transition ${
                    hormuz === preset
                      ? 'bg-red-600 text-white border-red-500 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Red Sea Slider */}
          <div className="p-3 rounded-lg border border-inherit bg-slate-800/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold">Red Sea / Suez Suspension</span>
              <span className={`px-2 py-0.5 text-xs font-mono font-extrabold rounded border ${
                theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-amber-100 text-amber-900 border-amber-400'
              }`}>
                {redSea}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={redSea}
              style={getTrackStyle(redSea, 100, '#F59E0B')}
              onChange={(e) => handleSliderChange(hormuz, Number(e.target.value), russian, duration)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none transition-all shadow-inner"
            />
            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px]">
              <span className="text-slate-500">Presets:</span>
              {[0, 25, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSliderChange(hormuz, preset, russian, duration)}
                  className={`px-1.5 py-0.5 rounded border transition ${
                    redSea === preset
                      ? 'bg-amber-600 text-white border-amber-500 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Russian Sanctions Slider */}
          <div className="p-3 rounded-lg border border-inherit bg-slate-800/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold">Russian Shadow Fleet Sanctions</span>
              <span className={`px-2 py-0.5 text-xs font-mono font-extrabold rounded border ${
                theme === 'dark' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' : 'bg-sky-100 text-sky-900 border-sky-400'
              }`}>
                {russian}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={russian}
              style={getTrackStyle(russian, 100, '#06B6D4')}
              onChange={(e) => handleSliderChange(hormuz, redSea, Number(e.target.value), duration)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none transition-all shadow-inner"
            />
            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px]">
              <span className="text-slate-500">Presets:</span>
              {[0, 25, 50, 75, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSliderChange(hormuz, redSea, preset, duration)}
                  className={`px-1.5 py-0.5 rounded border transition ${
                    russian === preset
                      ? 'bg-sky-600 text-white border-sky-500 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="p-3 rounded-lg border border-inherit bg-slate-800/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold">Crisis Duration (Days)</span>
              <span className={`px-2 py-0.5 text-xs font-mono font-extrabold rounded border ${
                theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border-emerald-400'
              }`}>
                {duration} Days
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="90"
              value={duration}
              style={getTrackStyle(duration, 90, '#10B981')}
              onChange={(e) => handleSliderChange(hormuz, redSea, russian, Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none transition-all shadow-inner"
            />
            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 mt-2 font-mono text-[9px]">
              <span className="text-slate-500">Presets:</span>
              {[7, 14, 30, 60, 90].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleSliderChange(hormuz, redSea, russian, preset)}
                  className={`px-1.5 py-0.5 rounded border transition ${
                    duration === preset
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {preset}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Economic Metrics */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Daily Crude Deficit</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              {simulationResult ? (simulationResult.daily_crude_deficit_bpd / 1000).toFixed(0) : '1,512'}k bpd
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Total: {simulationResult?.total_shortfall_mbbl}M bbls</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Stockout Horizon</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-amber' : 'text-amber-800'}`}>
              {simulationResult?.stockout_horizon_without_mitigation_days || 34.2} Days
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Without Rerouting</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Import Bill Surge</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              +₹{econ ? econ.import_bill_surge_inr_crores.toLocaleString() : '34,500'} Cr
            </p>
            <span className="text-[10px] text-slate-500 font-medium">+${econ?.import_bill_surge_usd_billion}B USD</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Petrol Pump Hike</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-amber' : 'text-amber-800'}`}>
              +₹{econ?.petrol_pump_price_impact_inr_l || 14.2}/L
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Diesel: +₹{econ?.diesel_pump_price_impact_inr_l || 16.5}/L</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">Landed Crude Price</span>
            <p className="text-xl font-extrabold">
              ${econ?.landed_crude_price_usd || 106.8}/bbl
            </p>
            <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>+{econ?.price_increase_pct || 36}% surge</span>
          </div>

          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wide">CAD & CPI Inflation</span>
            <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-alert-red' : 'text-red-700'}`}>
              +{econ?.current_account_deficit_impact_pct_gdp || 0.48}% GDP
            </p>
            <span className="text-[10px] text-slate-500 font-medium">CPI: +{econ?.cpi_inflation_impact_bps || 36} bps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
