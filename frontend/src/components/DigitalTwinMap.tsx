'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Database, Factory, Anchor, Navigation, Activity } from 'lucide-react';

const LiveLeafletMap = dynamic(() => import('./LiveLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
      Loading High-Definition GIS Maritime Radar...
    </div>
  )
});

interface NetworkNode {
  id: string;
  name: string;
  node_type: string;
  lat: number;
  lng: number;
  capacity_mbbl: number;
  current_volume_mbbl: number;
  status: string;
}

interface DigitalTwinMapProps {
  theme: 'dark' | 'cream';
  nodes: NetworkNode[];
  daysOfCover: number;
  totalReserveMbbl: number;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  theme,
  nodes,
  daysOfCover,
  totalReserveMbbl
}) => {
  return (
    <div className={`p-5 rounded-xl border transition-colors flex flex-col h-full ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header & Quick Stats Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-inherit">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider">Supply Chain Digital Twin</h2>
        </div>
        
        {/* Interactive GIS Legend Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-red animate-ping" />
            <span className="text-[11px]">Chokepoints (2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-amber" />
            <span className="text-[11px]">VLCCs at Sea (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-emerald" />
            <span className="text-[11px]">ISPRL Caverns (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-alert-cyan" />
            <span className="text-[11px]">SPM Berths (4)</span>
          </div>
        </div>
      </div>

      {/* Live Interactive Leaflet GIS Map Container */}
      <div className="mb-3 flex-1">
        <LiveLeafletMap />
      </div>

      {/* Node Overview Pins Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1">
        <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
          <div className="flex items-center gap-1.5 text-alert-amber mb-1">
            <Anchor className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px]">Vadinar SPM</span>
          </div>
          <p className="text-[10px] text-slate-500">Reliance / Nayara Hub</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-amber">55.0M bbls Stock</p>
        </div>

        <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
          <div className="flex items-center gap-1.5 text-alert-emerald mb-1">
            <Database className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px]">Padur Cavern</span>
          </div>
          <p className="text-[10px] text-slate-500">ISPRL 2.5 MMT</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-emerald">18.37M bbls (100%)</p>
        </div>

        <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
          <div className="flex items-center gap-1.5 text-alert-cyan mb-1">
            <Factory className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px]">Paradip IOCL</span>
          </div>
          <p className="text-[10px] text-slate-500">East Coast Refinery</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-cyan">24.0M bbls Stock</p>
        </div>

        <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
          <div className="flex items-center gap-1.5 text-alert-red mb-1">
            <Navigation className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px]">VLCC Desh Vishal</span>
          </div>
          <p className="text-[10px] text-slate-500">Basrah Crude in Transit</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-red">2.0M bbls (At Sea)</p>
        </div>
      </div>
    </div>
  );
};
