'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Database, Factory, Anchor, Navigation, ShieldCheck, X, Maximize2 } from 'lucide-react';

const LiveLeafletMap = dynamic(() => import('./LiveLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
      Loading High-Definition GIS Maritime Radar...
    </div>
  )
});

interface NodeDetail {
  id: string;
  name: string;
  type: string;
  subtitle: string;
  stock: string;
  status: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  refineryFeed: string;
  slateCompatibility: string;
  strategicRole: string;
  logisticsConnectivity: string;
  drawdownRateOrSpeed: string;
  bufferDays: string;
}

export const DigitalTwinMap: React.FC<{
  theme: 'dark' | 'cream';
  nodes: any[];
  daysOfCover: number;
  totalReserveMbbl: number;
}> = ({ theme, daysOfCover, totalReserveMbbl }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeDetails: Record<string, NodeDetail> = {
    vadinar: {
      id: 'vadinar',
      name: 'Vadinar SPM Berth & Tank Farm (Gujarat)',
      type: 'Single Point Mooring (SPM) Import Gateway',
      subtitle: 'Reliance Jamnagar & Nayara Energy Crude Intake Hub',
      stock: '55.0M bbls (13.7 Days Cover)',
      status: '100% Operational (SPM-1 & SPM-2 Active)',
      colorClass: 'text-alert-amber',
      badgeBg: 'bg-alert-amber/10 border-alert-amber/30 text-alert-amber',
      badgeText: 'Primary Import Gateway',
      refineryFeed: 'Reliance Jamnagar (1.2M bpd / 68 MMT) & Nayara Vadinar (400k bpd / 20 MMT)',
      slateCompatibility: 'High Sulfur Heavy Arabian, Basrah, Murban Sweet (API 31.0° - 40.5°)',
      strategicRole: 'Receives ~40% of India total crude imports. Feeds Vadinar-Bina crude pipeline.',
      logisticsConnectivity: 'Deepwater SPM offloading up to 300k DWT VLCCs at 10,000 m³/hr discharge rate',
      drawdownRateOrSpeed: 'Offloading Capacity: 240,000 bpd per berth',
      bufferDays: '+13.7 Days West Coast Refining Buffer'
    },
    padur: {
      id: 'padur',
      name: 'Padur ISPRL Strategic Petroleum Cavern (Karnataka)',
      type: 'Underground Rock Cavern Strategic Petroleum Reserve',
      subtitle: 'ISPRL 2.50 MMT Underground National Emergency Stockpile',
      stock: '18.37M bbls (100% Full Capacity)',
      status: 'Ready for LP Emergency Drawdown',
      colorClass: 'text-alert-emerald',
      badgeBg: 'bg-alert-emerald/10 border-alert-emerald/30 text-alert-emerald',
      badgeText: '100% National Reserve',
      refineryFeed: 'Mangalore Refinery & Petrochemicals Ltd (MRPL 15 MMT)',
      slateCompatibility: 'Arab / Basrah Sour Heavy Blend (API 32.0°, Sulfur 2.1%)',
      strategicRole: 'Protects against Strait of Hormuz closure for up to 18 additional refining days.',
      logisticsConnectivity: 'Direct subsea cross-country pipeline connected directly to MRPL & coastal barge docks',
      drawdownRateOrSpeed: 'Max Drawdown Rate: 240,000 bpd via hydraulic pumps',
      bufferDays: '+4.5 Days National Consumption Cover'
    },
    paradip: {
      id: 'paradip',
      name: 'Paradip IOCL Deepwater SPM & Refinery (Odisha)',
      type: 'East Coast Deepwater SPM & Integrated 15 MMT Refinery',
      subtitle: 'Indian Oil Corporation East Coast Primary Crude Hub',
      stock: '24.0M bbls (16.0 Days Cover)',
      status: 'Operational (Atlantic & Far East Import Active)',
      colorClass: 'text-alert-cyan',
      badgeBg: 'bg-alert-cyan/10 border-alert-cyan/30 text-alert-cyan',
      badgeText: 'East Coast Gateway',
      refineryFeed: 'IOCL Paradip 15 MMT, IOCL Haldia 8 MMT & IOCL Barauni 6 MMT',
      slateCompatibility: 'West African Bonny Light, Russian ESPO, US WTI Midland (API 35.0° - 42.0°)',
      strategicRole: 'Primary intake hub for Atlantic transatlantic bypass imports and Russian Kozmino crude.',
      logisticsConnectivity: 'Paradip-Haldia-Barauni-Guwahati Crude Pipeline (PHBPL 1,400 km network)',
      drawdownRateOrSpeed: 'Discharge Rate: 180,000 bpd offloading',
      bufferDays: '+16.0 Days East Coast Refining Buffer'
    },
    desh_vishal: {
      id: 'desh_vishal',
      name: 'VLCC Desh Vishal (Indian Supertanker at Sea)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Shipping Corporation of India (SCI) Fleet • MMSI 419001234',
      stock: '2.0M bbls Basrah Heavy (At Sea)',
      status: 'Underway at 14.5 Knots • Heading 124°',
      colorClass: 'text-alert-red',
      badgeBg: 'bg-alert-red/10 border-alert-red/30 text-alert-red',
      badgeText: 'Live AIS Telemetry Active',
      refineryFeed: 'Destination: Vadinar SPM (Gujarat) • ETA: Aug 24, 2026 (06:00 UTC)',
      slateCompatibility: 'Basrah Heavy Crude (API 24.0°, Sulfur 3.8%) for Reliance Jamnagar',
      strategicRole: 'Navigating Gulf of Oman corridor under active US-Iran war risk insurance surcharge (1.25%).',
      logisticsConnectivity: 'Live GPS Satellite Telemetry • Origin: Fujairah ADCOP Terminal (UAE)',
      drawdownRateOrSpeed: 'Cruising Speed: 14.5 Knots (26.8 km/h)',
      bufferDays: 'Delivery Target: 2.0M bbls in 48 Hours'
    }
  };

  const toggleNodeSelection = (id: string) => {
    setSelectedNodeId(prev => prev === id ? null : id);
  };

  const activeNode = selectedNodeId ? nodeDetails[selectedNodeId] : null;

  return (
    <div className={`p-5 rounded-xl border transition-colors flex flex-col h-full ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header & Quick Stats Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-inherit">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">Supply Chain Digital Twin</h2>
          {selectedNodeId && (
            <button
              onClick={() => setSelectedNodeId(null)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-mono transition border border-slate-700"
              title="Reset map view to show full region"
            >
              <Maximize2 className="w-3 h-3 text-alert-amber" />
              <span>Reset Wide View</span>
            </button>
          )}
        </div>
        
        {/* Interactive GIS Legend Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] text-red-400 font-semibold">Chokepoints (2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-amber-400 font-semibold">VLCCs at Sea (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-emerald-400 font-semibold">ISPRL Caverns (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="text-[11px] text-sky-400 font-semibold">SPM Berths (4)</span>
          </div>
        </div>
      </div>

      {/* Live Interactive Leaflet GIS Map Container */}
      <div className="mb-3 flex-1">
        <LiveLeafletMap selectedNodeId={selectedNodeId} />
      </div>

      {/* Node Selection Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs mb-3">
        {/* Card 1: Vadinar */}
        <div
          onClick={() => toggleNodeSelection('vadinar')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'vadinar'
              ? 'border-alert-amber bg-alert-amber/10 shadow-md'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-alert-amber font-bold text-[11px]">
              <Anchor className="w-3.5 h-3.5" />
              <span>Vadinar SPM</span>
            </div>
            {selectedNodeId === 'vadinar' && <span className="w-2 h-2 rounded-full bg-alert-amber animate-pulse" />}
          </div>
          <p className="text-[10px] text-slate-500">Reliance / Nayara Hub</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-amber">55.0M bbls Stock</p>
        </div>

        {/* Card 2: Padur */}
        <div
          onClick={() => toggleNodeSelection('padur')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'padur'
              ? 'border-alert-emerald bg-alert-emerald/10 shadow-md'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-alert-emerald font-bold text-[11px]">
              <Database className="w-3.5 h-3.5" />
              <span>Padur Cavern</span>
            </div>
            {selectedNodeId === 'padur' && <span className="w-2 h-2 rounded-full bg-alert-emerald animate-pulse" />}
          </div>
          <p className="text-[10px] text-slate-500">ISPRL 2.5 MMT Reserve</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-emerald">18.37M bbls (100%)</p>
        </div>

        {/* Card 3: Paradip */}
        <div
          onClick={() => toggleNodeSelection('paradip')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'paradip'
              ? 'border-alert-cyan bg-alert-cyan/10 shadow-md'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-alert-cyan font-bold text-[11px]">
              <Factory className="w-3.5 h-3.5" />
              <span>Paradip IOCL</span>
            </div>
            {selectedNodeId === 'paradip' && <span className="w-2 h-2 rounded-full bg-alert-cyan animate-pulse" />}
          </div>
          <p className="text-[10px] text-slate-500">East Coast Refinery</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-cyan">24.0M bbls Stock</p>
        </div>

        {/* Card 4: Desh Vishal */}
        <div
          onClick={() => toggleNodeSelection('desh_vishal')}
          className={`p-3 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'desh_vishal'
              ? 'border-alert-red bg-alert-red/10 shadow-md'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-alert-red font-bold text-[11px]">
              <Navigation className="w-3.5 h-3.5" />
              <span>Desh Vishal</span>
            </div>
            {selectedNodeId === 'desh_vishal' && <span className="w-2 h-2 rounded-full bg-alert-red animate-pulse" />}
          </div>
          <p className="text-[10px] text-slate-500">Basrah Crude in Transit</p>
          <p className="font-bold text-[11px] mt-0.5 text-alert-red">2.0M bbls (At Sea)</p>
        </div>
      </div>

      {/* DETAILED STRATEGIC NODE INTELLIGENCE PANEL */}
      {activeNode && (
        <div className={`p-4 rounded-xl border font-mono transition-all duration-200 ${
          theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-inherit">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-xs ${activeNode.colorClass}`}>{activeNode.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeNode.badgeBg}`}>
                  {activeNode.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">{activeNode.subtitle}</p>
            </div>
            
            <button
              onClick={() => setSelectedNodeId(null)}
              className="p-1 rounded hover:bg-slate-700/20 text-slate-400"
              title="Close Panel & Reset Wide View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Strategic Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] mb-3">
            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">LIVE STOCK / CAPACITY</span>
              <p className="font-bold text-xs text-alert-emerald">{activeNode.stock}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">{activeNode.status}</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">REFINERY FEED DESTINATION</span>
              <p className="font-bold text-xs text-alert-amber line-clamp-1">{activeNode.refineryFeed}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Direct Offtake Hub</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">CRUDE SLATE COMPATIBILITY</span>
              <p className="font-bold text-xs text-alert-cyan line-clamp-1">{activeNode.slateCompatibility}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Assay Matched</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">OFFLOADING / SPEED</span>
              <p className="font-bold text-xs">{activeNode.drawdownRateOrSpeed}</p>
              <span className="text-[10px] text-alert-emerald block mt-0.5">{activeNode.bufferDays}</span>
            </div>
          </div>

          {/* Strategic Role & Logistics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-sans pt-2 border-t border-inherit">
            <div>
              <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1 uppercase tracking-wide">Strategic National Role</span>
              <p className="text-slate-300 leading-relaxed">{activeNode.strategicRole}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 font-mono text-[10px] block mb-1 uppercase tracking-wide">Logistics & Infrastructure Connectivity</span>
              <p className="text-slate-300 leading-relaxed">{activeNode.logisticsConnectivity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
