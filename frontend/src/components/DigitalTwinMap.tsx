'use client';

import React from 'react';
import { Navigation, Database, Factory, Anchor } from 'lucide-react';

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-alert-cyan" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Direction 5: Supply Chain Digital Twin</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-alert-emerald font-bold">ISPRL Buffer: {daysOfCover} Days ({totalReserveMbbl}M bbls)</span>
        </div>
      </div>

      {/* Simulated Geospatial GIS Map Canvas */}
      <div className={`relative flex-1 min-h-[280px] rounded-lg border overflow-hidden p-4 flex flex-col justify-between ${
        theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
      }`}>
        {/* SVG Sea Lanes & Nodes Graphic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full stroke-current text-alert-cyan" fill="none" strokeWidth="1">
            <line x1="10%" y1="30%" x2="50%" y2="60%" strokeDasharray="4 4" />
            <line x1="50%" y1="60%" x2="80%" y2="40%" strokeDasharray="4 4" />
            <line x1="20%" y1="80%" x2="50%" y2="60%" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Top Info Tag */}
        <div className="flex items-center justify-between relative z-10 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-alert-emerald animate-ping" />
            <span>INDIAN OCEAN & ARABIAN SEA MARITIME GRID</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] bg-alert-cyan/10 text-alert-cyan border border-alert-cyan/20">
            Live AIS Telemetry
          </span>
        </div>

        {/* Node Overview Pins */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative z-10 my-4 font-mono text-xs">
          <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center gap-1.5 text-alert-amber mb-1">
              <Anchor className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">Vadinar SPM</span>
            </div>
            <p className="text-[10px] text-slate-500">Reliance / Nayara Hub</p>
            <p className="font-bold text-[11px] mt-0.5">55.0M bbls Stock</p>
          </div>

          <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center gap-1.5 text-alert-emerald mb-1">
              <Database className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">Padur Cavern</span>
            </div>
            <p className="text-[10px] text-slate-500">ISPRL 2.5 MMT</p>
            <p className="font-bold text-[11px] mt-0.5">18.37M bbls (100%)</p>
          </div>

          <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center gap-1.5 text-alert-cyan mb-1">
              <Factory className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">Paradip IOCL</span>
            </div>
            <p className="text-[10px] text-slate-500">East Coast Refinery</p>
            <p className="font-bold text-[11px] mt-0.5">24.0M bbls Stock</p>
          </div>

          <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
            <div className="flex items-center gap-1.5 text-alert-red mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">VLCC Desh Vishal</span>
            </div>
            <p className="text-[10px] text-slate-500">Basrah Crude in Transit</p>
            <p className="font-bold text-[11px] mt-0.5">2.0M bbls (At Sea)</p>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 relative z-10 pt-2 border-t border-inherit">
          <span>Active Supertankers Tracked: 3 VLCCs</span>
          <span>Total Crude at Sea: 35.5M Barrels</span>
        </div>
      </div>
    </div>
  );
};
