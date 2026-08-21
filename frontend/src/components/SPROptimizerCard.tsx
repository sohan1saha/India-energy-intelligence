'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SPROptimizerCardProps {
  theme: 'dark' | 'cream';
  daysExtended: number;
}

export const SPROptimizerCard: React.FC<SPROptimizerCardProps> = ({ theme, daysExtended }) => {
  return (
    <div className={`p-5 rounded-xl border transition-colors flex flex-col h-full ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <h2 className="text-sm font-bold uppercase tracking-wider">Strategic Reserve (ISPRL) Optimisation Agent</h2>
        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-alert-emerald/10 text-alert-emerald border border-alert-emerald/20 font-mono">
          LP Drawdown Active
        </span>
      </div>

      {/* Cavern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 font-mono">
        <div className={`p-3.5 rounded-lg border ${
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold">Padur Cavern</span>
            <span className="text-[10px] text-alert-emerald font-bold">2.50 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">Karnataka • 18.37M bbls</p>
          
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-alert-emerald h-full w-[85%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>240k bpd</strong></span>
            <span className="text-alert-emerald">85% Capacity</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-lg border ${
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold">Mangalore Cavern</span>
            <span className="text-[10px] text-alert-emerald font-bold">1.50 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">Karnataka • 11.02M bbls</p>
          
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-alert-emerald h-full w-[80%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>140k bpd</strong></span>
            <span className="text-alert-emerald">80% Capacity</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-lg border ${
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold">Visakhapatnam Cavern</span>
            <span className="text-[10px] text-alert-emerald font-bold">1.33 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">Andhra Pradesh • 9.77M bbls</p>
          
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-alert-emerald h-full w-[90%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>120k bpd</strong></span>
            <span className="text-alert-emerald">90% Capacity</span>
          </div>
        </div>
      </div>

      {/* Impact Banner */}
      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono mt-auto ${
        theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-alert-emerald" />
          <span>National Defense Floor: <strong>15% Reserved</strong></span>
        </div>
        <span className="text-alert-emerald font-bold">+18.0 Additional Refining Days</span>
      </div>
    </div>
  );
};
