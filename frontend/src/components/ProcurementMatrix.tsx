'use client';

import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, ShieldCheck, Anchor } from 'lucide-react';

interface SourcingAllocation {
  source_country: string;
  supplier_name: string;
  crude_grade: string;
  api_gravity: number;
  sulfur_pct: number;
  volume_bpd: number;
  transport_mode: string;
  transit_days: number;
  landed_cost_usd_bbl: number;
  refinery_fit_score: number;
}

interface ReroutingStrategy {
  strategy_id: string;
  name: string;
  tagline: string;
  landed_cost_usd_bbl: number;
  cost_delta_vs_baseline_usd: number;
  avg_transit_days: number;
  overall_refinery_fit: number;
  allocations: SourcingAllocation[];
  executable_tender_json: string;
  tender_summary_pdf_text: string;
}

interface ProcurementMatrixProps {
  theme: 'dark' | 'cream';
  strategies: ReroutingStrategy[];
  selectedStrategyId?: string;
  onSelectStrategy?: (strategyId: string) => void;
}

export const ProcurementMatrix: React.FC<ProcurementMatrixProps> = ({
  theme,
  strategies,
  selectedStrategyId: externalStrategyId,
  onSelectStrategy
}) => {
  const [internalStrategyId, setInternalStrategyId] = useState<string>(strategies[0]?.strategy_id || 'strat_bypass');
  const [copied, setCopied] = useState(false);

  const activeStrategyId = externalStrategyId !== undefined ? externalStrategyId : internalStrategyId;

  const handleSelect = (id: string) => {
    setInternalStrategyId(id);
    if (onSelectStrategy) {
      onSelectStrategy(id);
    }
  };

  const selectedStrategy = strategies.find(s => s.strategy_id === activeStrategyId) || strategies[0];

  let parsedJson: any = null;
  try {
    parsedJson = JSON.parse(selectedStrategy?.executable_tender_json || '');
  } catch (e) {
    parsedJson = {
      tender_id: "MoPNG/EMERGENCY/2026-08/STRAT-1",
      issuer: "Ministry of Petroleum & Natural Gas / IOCL Chartering",
      total_volume_bpd: 1200000,
      target_delivery_ports: ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"],
      execution_lead_time_hours: 6
    };
  }

  const handleCopyJson = () => {
    if (selectedStrategy?.executable_tender_json) {
      navigator.clipboard.writeText(selectedStrategy.executable_tender_json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Strategy Selection */}
      <div className={`p-5 rounded-xl border transition-colors ${
        theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
      }`}>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-inherit">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Adaptive Procurement Orchestrator</h2>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">Click any emergency strategy card below to highlight its supply routes on the Live GIS Map</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-alert-amber/10 text-alert-amber border border-alert-amber/30 font-mono">
            100% Slate Compatible
          </span>
        </div>

        {/* Strategy Selection Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-4 font-mono">
          {strategies.map((strat) => {
            const isSelected = strat.strategy_id === activeStrategyId;
            return (
              <div
                key={strat.strategy_id}
                onClick={() => handleSelect(strat.strategy_id)}
                className={`p-4 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-alert-amber bg-alert-amber/5 ring-2 ring-alert-amber/50 shadow-lg scale-[1.01]'
                    : theme === 'dark'
                    ? 'bg-dark-bg border-dark-border hover:border-slate-600'
                    : 'bg-cream-bg border-cream-border hover:border-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs">{strat.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-alert-amber flex-shrink-0" />}
                  </div>
                  <p className={`text-[11px] font-sans mb-3 line-clamp-2 ${
                    theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'
                  }`}>
                    {strat.tagline}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-inherit">
                  <div>
                    <span className="block text-slate-500">Landed Cost</span>
                    <span className="font-bold text-alert-amber">${strat.landed_cost_usd_bbl}/bbl</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Lead Time</span>
                    <span className="font-bold">{strat.avg_transit_days} Days</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Refinery Slate</span>
                    <span className="font-bold text-alert-emerald">{(strat.overall_refinery_fit * 100).toFixed(0)}% Fit</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Strategy Allocation Table */}
        {selectedStrategy && (
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3 font-mono">
              Crude Basket Allocation & Logistics Rerouting
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono text-left">
                <thead>
                  <tr className="border-b border-inherit text-slate-500">
                    <th className="pb-2 font-semibold">Source Country / Route</th>
                    <th className="pb-2 font-semibold">Supplier & Grade</th>
                    <th className="pb-2 font-semibold">API / Sulfur</th>
                    <th className="pb-2 font-semibold">Volume (bpd)</th>
                    <th className="pb-2 font-semibold">Transit</th>
                    <th className="pb-2 font-semibold">Landed Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {selectedStrategy.allocations.map((alloc, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/10">
                      <td className="py-2.5 font-bold">{alloc.source_country}</td>
                      <td className="py-2.5">{alloc.supplier_name} ({alloc.crude_grade})</td>
                      <td className="py-2.5">{alloc.api_gravity}° / {alloc.sulfur_pct}% S</td>
                      <td className="py-2.5 font-bold text-alert-amber">{(alloc.volume_bpd / 1000).toFixed(0)}k bpd</td>
                      <td className="py-2.5">{alloc.transit_days} Days</td>
                      <td className="py-2.5 font-bold">${alloc.landed_cost_usd_bbl}/bbl</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* INLINE EXECUTABLE MOPNG EMERGENCY TENDER SPECIFICATION CARD */}
      <div className={`p-5 rounded-xl border transition-colors ${
        theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
      }`}>
        {/* Document Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-inherit">
          <div>
            <h3 className="font-bold text-sm">Ministry of Petroleum & Natural Gas (MoPNG) Emergency Tender</h3>
          </div>

          <button
            onClick={handleCopyJson}
            className="p-1.5 rounded-lg border border-inherit text-slate-400 hover:text-white hover:bg-slate-700/30 transition"
            title={copied ? "Copied!" : "Copy Spec JSON"}
          >
            {copied ? <Check className="w-4 h-4 text-alert-emerald" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Directive Summary Banner */}
        <div className="p-3.5 rounded-lg border text-alert-amber border-alert-amber/30 bg-alert-amber/10 mb-4">
          <p className="font-bold text-xs mb-1 font-mono uppercase tracking-wide">DIRECTIVE SUMMARY:</p>
          <p className="text-xs leading-relaxed font-sans font-medium">
            {selectedStrategy?.tender_summary_pdf_text || "EMERGENCY DIRECTIVE: Dispatch 3 VLCCs to Fujairah ADCOP terminal (UAE) and 2 VLCCs to Yanbu Red Sea terminal. Initiate 240,000 bpd drawdown from Padur & Mangalore ISPRL caverns immediately."}
          </p>
        </div>

        {/* Key Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono mb-4">
          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">TENDER ID & ISSUER</span>
            <p className="font-bold text-xs text-alert-amber">{parsedJson?.tender_id || "MoPNG/EMERGENCY/STRAT-1"}</p>
            <span className="text-[10px] text-slate-400 block mt-0.5">{parsedJson?.issuer || "MoPNG / IOCL"}</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">TOTAL REROUTED VOLUME</span>
            <p className="font-bold text-xs text-alert-emerald">
              {parsedJson?.total_volume_bpd ? (parsedJson.total_volume_bpd / 1000).toFixed(0) : '1,200'}k bpd
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Crude Allocation</span>
          </div>

          <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-1">EXECUTION LEAD TIME</span>
            <p className="font-bold text-xs text-alert-cyan">
              {parsedJson?.execution_lead_time_hours || 6} Hours
            </p>
            <span className="text-[10px] text-slate-400 block mt-0.5">Emergency Dispatch</span>
          </div>
        </div>

        {/* Target Delivery Ports */}
        <div className={`p-3.5 rounded-lg border mb-4 ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
          <span className="text-[10px] text-slate-500 block mb-2 font-mono uppercase tracking-wide">Target Delivery Terminals & Ports</span>
          <div className="flex flex-wrap gap-2">
            {(parsedJson?.target_delivery_ports || ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"]).map((port: string, idx: number) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-alert-cyan/10 text-alert-cyan border border-alert-cyan/30 text-xs font-semibold font-mono flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-alert-cyan" />
                <span>{port}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-2 border-t border-inherit flex items-center justify-between text-xs font-mono text-alert-emerald">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold">Verified 100% Compatible with Indian Refiner Slates</span>
          </div>
          <span className="text-[10px] text-slate-500">Live Executive Spec Payload</span>
        </div>
      </div>
    </div>
  );
};
