'use client';

import React, { useState } from 'react';
import { Compass, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

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
  onOpenTenderModal: (strategy: ReroutingStrategy) => void;
}

export const ProcurementMatrix: React.FC<ProcurementMatrixProps> = ({
  theme,
  strategies,
  onOpenTenderModal
}) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(strategies[0]?.strategy_id || 'strat_bypass');

  const selectedStrategy = strategies.find(s => s.strategy_id === selectedStrategyId) || strategies[0];

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-alert-amber" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Direction 3: Adaptive Procurement Orchestrator</h2>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'}`}>
              Ranks alternative crude sources & transit lanes matched to refinery crude slate compatibility
            </p>
          </div>
        </div>

        {/* Primary Action Button: Moved Here! */}
        <button
          onClick={() => onOpenTenderModal(selectedStrategy)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-alert-amber text-white text-xs font-bold hover:bg-amber-700 transition shadow-md self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Tender Spec</span>
        </button>
      </div>

      {/* Strategy Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 font-mono">
        {strategies.map((strat) => {
          const isSelected = strat.strategy_id === selectedStrategyId;
          return (
            <div
              key={strat.strategy_id}
              onClick={() => setSelectedStrategyId(strat.strategy_id)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                isSelected
                  ? 'border-alert-amber bg-alert-amber/5'
                  : theme === 'dark'
                  ? 'bg-dark-bg border-dark-border hover:border-slate-600'
                  : 'bg-cream-bg border-cream-border hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs">{strat.name}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-alert-amber" />}
              </div>
              <p className={`text-[11px] font-sans mb-3 line-clamp-2 ${
                theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'
              }`}>
                {strat.tagline}
              </p>

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

      {/* Selected Strategy Allocation Breakdown Table */}
      {selectedStrategy && (
        <div className={`p-4 rounded-lg border ${
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wide">Crude Basket Allocation & Logistics Rerouting</h3>
            <button
              onClick={() => onOpenTenderModal(selectedStrategy)}
              className="flex items-center gap-1.5 text-xs text-alert-amber hover:underline font-semibold font-mono"
            >
              <span>View Full Directive Payload</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Allocation Table */}
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
  );
};
