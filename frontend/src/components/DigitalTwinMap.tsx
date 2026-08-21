'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Database, Factory, Anchor, Navigation, X, Maximize2 } from 'lucide-react';

const LiveLeafletMap = dynamic(() => import('./LiveLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
      Loading High-Definition GIS Maritime Telemetry Radar...
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
  colorClassDark: string;
  colorClassLight: string;
  badgeBg: string;
  badgeText: string;
  refineryFeed: string;
  slateCompatibility: string;
  strategicRole: string;
  logisticsConnectivity: string;
  drawdownRateOrSpeed: string;
  bufferDays: string;
}

interface DigitalTwinMapProps {
  theme: 'dark' | 'cream';
  nodes: any[];
  daysOfCover: number;
  totalReserveMbbl: number;
  selectedNodeId: string | null;
  selectedStrategyId?: string | null;
  onSelectNode: (codeId: string | null) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  theme,
  daysOfCover,
  totalReserveMbbl,
  selectedNodeId,
  selectedStrategyId,
  onSelectNode
}) => {
  const nodeDetails: Record<string, NodeDetail> = {
    vadinar: {
      id: 'vadinar',
      name: 'Vadinar SPM Berth & Tank Farm (Gujarat)',
      type: 'Single Point Mooring (SPM) Import Gateway',
      subtitle: 'Reliance Jamnagar & Nayara Energy Crude Intake Hub',
      stock: '55.0M bbls (13.7 Days Cover)',
      status: '100% Operational (SPM-1 & SPM-2 Active)',
      colorClassDark: 'text-amber-400',
      colorClassLight: 'text-amber-800 font-extrabold',
      badgeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-800 font-bold',
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
      colorClassDark: 'text-emerald-400',
      colorClassLight: 'text-emerald-800 font-extrabold',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 font-bold',
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
      colorClassDark: 'text-sky-400',
      colorClassLight: 'text-sky-800 font-extrabold',
      badgeBg: 'bg-sky-500/10 border-sky-500/40 text-sky-800 font-bold',
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
      colorClassDark: 'text-amber-400',
      colorClassLight: 'text-amber-800 font-extrabold',
      badgeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-800 font-bold',
      badgeText: 'Live AIS Telemetry Active',
      refineryFeed: 'ORIGIN: Fujairah ADCOP Terminal (UAE) ➔ DESTINATION: Vadinar SPM (ETA Aug 24)',
      slateCompatibility: 'Basrah Heavy Crude (API 24.0°, Sulfur 3.8%) for Reliance Jamnagar',
      strategicRole: 'Origin: Fujairah ADCOP Terminal (UAE). Destination: Vadinar SPM Berth (Gujarat). Navigating Gulf of Oman corridor under active US-Iran war risk insurance surcharge (1.25%).',
      logisticsConnectivity: 'Origin: Fujairah ADCOP Terminal (UAE) ➔ Destination: Vadinar SPM (Gujarat, India)',
      drawdownRateOrSpeed: 'Cruising Speed: 14.5 Knots (26.8 km/h)',
      bufferDays: 'Delivery Target: 2.0M bbls in 48 Hours'
    },
    swarna_kamal: {
      id: 'swarna_kamal',
      name: 'VLCC Swarna Kamal (Indian Supertanker at Sea)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Shipping Corporation of India (SCI) Fleet • MMSI 419005678',
      stock: '2.0M bbls Murban Sweet (At Sea)',
      status: 'Underway at 13.8 Knots • Heading 142°',
      colorClassDark: 'text-sky-400',
      colorClassLight: 'text-sky-800 font-extrabold',
      badgeBg: 'bg-sky-500/10 border-sky-500/40 text-sky-800 font-bold',
      badgeText: 'Live AIS Telemetry Active',
      refineryFeed: 'ORIGIN: Fujairah ADCOP Terminal (UAE) ➔ DESTINATION: Mangalore SPM (ETA Aug 25)',
      slateCompatibility: 'Murban Sweet Crude (API 40.2°, Sulfur 0.78%) for MRPL Mangalore',
      strategicRole: 'Origin: Fujairah ADCOP Terminal (UAE). Destination: Mangalore SPM Berth (MRPL, Karnataka). ADCOP bypass route active.',
      logisticsConnectivity: 'Origin: Fujairah ADCOP Terminal (UAE) ➔ Destination: Mangalore SPM (Karnataka, India)',
      drawdownRateOrSpeed: 'Cruising Speed: 13.8 Knots (25.5 km/h)',
      bufferDays: 'Delivery Target: 2.0M bbls in 72 Hours'
    },
    ratna_shalini: {
      id: 'ratna_shalini',
      name: 'VLCC Ratna Shalini (Indian Supertanker at Sea)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Great Eastern Shipping Fleet • MMSI 419009876',
      stock: '1.9M bbls WTI Midland (At Sea)',
      status: 'Underway at 15.1 Knots • Heading 022°',
      colorClassDark: 'text-emerald-400',
      colorClassLight: 'text-emerald-800 font-extrabold',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-800 font-bold',
      badgeText: 'Live AIS Telemetry Active',
      refineryFeed: 'ORIGIN: Enterprise US Gulf Terminal (Texas, USA) ➔ DESTINATION: Paradip SPM (ETA Aug 26)',
      slateCompatibility: 'WTI Midland Crude (API 40.5°, Sulfur 0.20%) for IOCL Paradip',
      strategicRole: 'Origin: Enterprise US Gulf Terminal (Texas, USA). Destination: Paradip SPM Berth (Odisha). Transatlantic route via Cape of Good Hope.',
      logisticsConnectivity: 'Origin: Enterprise US Gulf Terminal (USA) ➔ Destination: Paradip SPM (Odisha, India)',
      drawdownRateOrSpeed: 'Cruising Speed: 15.1 Knots (28.0 km/h)',
      bufferDays: 'Delivery Target: 1.9M bbls in 96 Hours'
    }
  };

  const toggleNodeSelection = (id: string) => {
    onSelectNode(selectedNodeId === id ? null : id);
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
              onClick={() => onSelectNode(null)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition border ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-300 text-slate-900 border-slate-400 font-bold'
              }`}
              title="Reset map view to show full region"
            >
              <Maximize2 className="w-3 h-3 text-amber-500" />
              <span>Reset Wide View</span>
            </button>
          )}
        </div>
        
        {/* High-Contrast GIS Legend Bar in Light Mode */}
        <div className="flex flex-wrap items-center gap-3.5 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-red-400' : 'text-red-700 font-extrabold'}`}>
              Chokepoints (2)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800 font-extrabold'}`}>
              VLCCs at Sea (3)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800 font-extrabold'}`}>
              ISPRL Caverns (3)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800 font-extrabold'}`}>
              SPM Berths (4)
            </span>
          </div>
        </div>
      </div>

      {/* Live Interactive Leaflet GIS Map Container */}
      <div className="mb-3 flex-1">
        <LiveLeafletMap
          theme={theme}
          selectedNodeId={selectedNodeId}
          selectedStrategyId={selectedStrategyId}
          onSelectNode={onSelectNode}
        />
      </div>

      {/* Node Selection Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs mb-3">
        {/* Card 1: Vadinar */}
        <div
          onClick={() => toggleNodeSelection('vadinar')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'vadinar'
              ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
              <Anchor className="w-3 h-3" />
              <span>Vadinar SPM</span>
            </div>
            {selectedNodeId === 'vadinar' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Reliance / Nayara</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>55.0M bbls</p>
        </div>

        {/* Card 2: Padur */}
        <div
          onClick={() => toggleNodeSelection('padur')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'padur'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
              <Database className="w-3 h-3" />
              <span>Padur Cavern</span>
            </div>
            {selectedNodeId === 'padur' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>ISPRL 2.5 MMT</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>18.37M bbls</p>
        </div>

        {/* Card 3: Paradip */}
        <div
          onClick={() => toggleNodeSelection('paradip')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'paradip'
              ? 'border-sky-500 bg-sky-500/10 shadow-md ring-2 ring-sky-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'}`}>
              <Factory className="w-3 h-3" />
              <span>Paradip IOCL</span>
            </div>
            {selectedNodeId === 'paradip' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>IOCL East Coast</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'}`}>24.0M bbls</p>
        </div>

        {/* Card 4: Desh Vishal */}
        <div
          onClick={() => toggleNodeSelection('desh_vishal')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'desh_vishal'
              ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>
              <Navigation className="w-3 h-3" />
              <span>Desh Vishal</span>
            </div>
            {selectedNodeId === 'desh_vishal' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Fujairah ➔ Vadinar</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'}`}>2.0M bbls</p>
        </div>

        {/* Card 5: Swarna Kamal */}
        <div
          onClick={() => toggleNodeSelection('swarna_kamal')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'swarna_kamal'
              ? 'border-sky-500 bg-sky-500/10 shadow-md ring-2 ring-sky-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'}`}>
              <Navigation className="w-3 h-3" />
              <span>Swarna Kamal</span>
            </div>
            {selectedNodeId === 'swarna_kamal' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>Fujairah ➔ MRPL</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'}`}>2.0M bbls</p>
        </div>

        {/* Card 6: Ratna Shalini */}
        <div
          onClick={() => toggleNodeSelection('ratna_shalini')}
          className={`p-2.5 rounded-lg border cursor-pointer transition ${
            selectedNodeId === 'ratna_shalini'
              ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500'
              : theme === 'dark'
              ? 'bg-dark-bg border-dark-border hover:border-slate-600'
              : 'bg-cream-bg border-cream-border hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`flex items-center gap-1 font-bold text-[10px] ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>
              <Navigation className="w-3 h-3" />
              <span>Ratna Shalini</span>
            </div>
            {selectedNodeId === 'ratna_shalini' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </div>
          <p className={`text-[9px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>US Gulf ➔ Paradip</p>
          <p className={`font-bold text-[10px] mt-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>1.9M bbls</p>
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
                <h3 className={`font-bold text-xs ${theme === 'dark' ? activeNode.colorClassDark : activeNode.colorClassLight}`}>
                  {activeNode.name}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeNode.badgeBg}`}>
                  {activeNode.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">{activeNode.subtitle}</p>
            </div>
            
            <button
              onClick={() => onSelectNode(null)}
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
              <p className={`font-bold text-xs ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'}`}>{activeNode.stock}</p>
              <span className="text-[10px] text-slate-500 block mt-0.5">{activeNode.status}</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">ROUTE TELEMETRY (ORIGIN ➔ DEST)</span>
              <p className={`font-bold text-xs ${theme === 'dark' ? 'text-amber-400' : 'text-amber-800'} line-clamp-1`}>{activeNode.refineryFeed}</p>
              <span className="text-[10px] text-slate-500 block mt-0.5">Offtake & Delivery Gateway</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">CRUDE SLATE COMPATIBILITY</span>
              <p className={`font-bold text-xs ${theme === 'dark' ? 'text-sky-400' : 'text-sky-800'} line-clamp-1`}>{activeNode.slateCompatibility}</p>
              <span className="text-[10px] text-slate-500 block mt-0.5">Assay Matched</span>
            </div>

            <div className={`p-2.5 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">OFFLOADING / SPEED</span>
              <p className="font-bold text-xs">{activeNode.drawdownRateOrSpeed}</p>
              <span className={`text-[10px] block mt-0.5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800 font-bold'}`}>{activeNode.bufferDays}</span>
            </div>
          </div>

          {/* Strategic Role & Logistics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-sans pt-2 border-t border-inherit">
            <div>
              <span className="font-bold text-slate-500 font-mono text-[10px] block mb-1 uppercase tracking-wide">Strategic National Role</span>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>{activeNode.strategicRole}</p>
            </div>
            <div>
              <span className="font-bold text-slate-500 font-mono text-[10px] block mb-1 uppercase tracking-wide">Logistics & Infrastructure Connectivity</span>
              <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900 font-medium'}`}>{activeNode.logisticsConnectivity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
