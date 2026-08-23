'use client';

import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';

interface SPROptimizerCardProps {
  theme: 'dark' | 'cream';
  daysExtended: number;
  selectedNodeId?: string | null;
  onSelectCavern?: (cavernId: string) => void;
}

export const SPROptimizerCard: React.FC<SPROptimizerCardProps> = ({
  theme,
  daysExtended,
  selectedNodeId,
  onSelectCavern
}) => {
  const handleCavernClick = (id: string) => {
    if (onSelectCavern) {
      onSelectCavern(id);
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-colors flex flex-col h-full ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <h2 className="text-sm font-bold uppercase tracking-wider">Strategic Reserve (ISPRL) Optimisation Agent</h2>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded border font-mono ${
          theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
        }`}>
          LP Drawdown Active
        </span>
      </div>

      {/* Cavern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 font-mono">
        {/* Padur Cavern Box */}
        <div
          onClick={() => handleCavernClick('padur')}
          className={`p-3.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'padur'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-500'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs font-bold truncate">
              <Database className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Padur Cavern</span>
            </div>
            <span className={`text-[10px] font-bold shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>2.50 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 font-medium">Karnataka • 18.37M bbls</p>
          
          <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}>
            <div className="bg-emerald-500 h-full w-[85%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>240k bpd</strong></span>
            <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>85% Capacity</span>
          </div>
        </div>

        {/* Mangalore Cavern Box */}
        <div
          onClick={() => handleCavernClick('mangalore')}
          className={`p-3.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'mangalore'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-500'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs font-bold truncate">
              <Database className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Mangalore Cavern</span>
            </div>
            <span className={`text-[10px] font-bold shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>1.50 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 font-medium">Karnataka • 11.02M bbls</p>
          
          <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}>
            <div className="bg-emerald-500 h-full w-[80%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>140k bpd</strong></span>
            <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>80% Capacity</span>
          </div>
        </div>

        {/* Visakhapatnam Cavern Box */}
        <div
          onClick={() => handleCavernClick('visakh')}
          className={`p-3.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'visakh'
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500 shadow-md scale-[1.02]'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-500'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1 text-xs font-bold truncate">
              <Database className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Visakhapatnam</span>
            </div>
            <span className={`text-[10px] font-bold shrink-0 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>1.33 MMT</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 font-medium">Andhra Pradesh • 9.77M bbls</p>
          
          <div className={`w-full h-2 rounded-full overflow-hidden mb-2 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`}>
            <div className="bg-emerald-500 h-full w-[90%]" />
          </div>
          <div className="flex justify-between text-[10px]">
            <span>Drawdown: <strong>120k bpd</strong></span>
            <span className={`font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>90% Capacity</span>
          </div>
        </div>
      </div>

      {/* Impact Banner */}
      <div className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono mt-auto ${
        theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>National Defense Floor: <strong>15% Reserved</strong></span>
        </div>
        <span className={`font-extrabold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
          +{daysExtended.toFixed(1)} Additional Refining Days
        </span>
      </div>
    </div>
  );
};
