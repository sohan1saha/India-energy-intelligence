'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Database, Factory, Anchor, Navigation, ShieldAlert, X, Maximize2, Layers, Compass } from 'lucide-react';

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
  category: 'chokepoint' | 'tanker' | 'spr' | 'port';
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

interface DigitalTwinMapProps {
  theme: 'dark' | 'cream';
  nodes: any[];
  daysOfCover: number;
  totalReserveMbbl: number;
  selectedNodeIds: string[];
  onToggleNode: (id: string) => void;
  onSelectAllCategory: (category: 'all' | 'chokepoint' | 'tanker' | 'spr' | 'port') => void;
  onResetWideView: () => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  theme,
  daysOfCover,
  totalReserveMbbl,
  selectedNodeIds,
  onToggleNode,
  onSelectAllCategory,
  onResetWideView
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'chokepoint' | 'tanker' | 'spr' | 'port'>('all');

  const allNodeDetails: Record<string, NodeDetail> = {
    // CHOKEPOINTS
    hormuz: {
      id: 'hormuz',
      category: 'chokepoint',
      name: 'Strait of Hormuz (Critical Threat Zone)',
      type: 'Strategic Maritime Chokepoint',
      subtitle: 'Threat Score: 82.5/100 (HIGH_RISK) • 1.89M bpd Transit',
      stock: '1.89M bpd Transit Volume',
      status: 'Naval Patrols & Mine Threat Active',
      colorClass: 'text-alert-red',
      badgeBg: 'bg-alert-red/10 border-alert-red/30 text-alert-red',
      badgeText: 'Chokepoint Alert (82.5/100)',
      refineryFeed: 'Primary corridor for 45% of India crude imports',
      slateCompatibility: 'Arab Light, Basrah Heavy, Murban Sweet',
      strategicRole: 'Elevated US-Iran standoff along Iranian coast. Rerouting via Fujairah ADCOP pipeline recommended.',
      logisticsConnectivity: 'Transit delay +4.5 days, War risk insurance surcharge +1.25%',
      drawdownRateOrSpeed: 'Transit Delay: +4.5 Days',
      bufferDays: 'Action: Reroute via ADCOP Pipeline'
    },
    red_sea: {
      id: 'red_sea',
      category: 'chokepoint',
      name: 'Bab-el-Mandeb & Red Sea (Critical Threat Zone)',
      type: 'Red Sea Anti-Ship Drone & Missile Attack Zone',
      subtitle: 'Threat Score: 76.0/100 (HIGH_RISK) • 1.12M bpd Transit',
      stock: '1.12M bpd Transit Volume',
      status: 'Cape of Good Hope Diversion Active',
      colorClass: 'text-alert-red',
      badgeBg: 'bg-alert-red/10 border-alert-red/30 text-alert-red',
      badgeText: 'Chokepoint Alert (76.0/100)',
      refineryFeed: 'Feeds Mediterranean & Suez imports to Indian refiners',
      slateCompatibility: 'Suezmax & Aframax Tanker Fleets',
      strategicRole: 'Continuous Houthi missile/drone attacks force major tankers into 16-day Cape of Good Hope detour.',
      logisticsConnectivity: 'Transit delay +16.0 days, War risk insurance surcharge +1.50%',
      drawdownRateOrSpeed: 'Transit Delay: +16.0 Days',
      bufferDays: 'Action: Reroute via Yanbu Petroline'
    },
    // SUPERTANKERS
    desh_vishal: {
      id: 'desh_vishal',
      category: 'tanker',
      name: 'VLCC Desh Vishal (Live AIS)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Shipping Corporation of India (SCI) • MMSI 419001234',
      stock: '2.0M bbls Basrah Heavy (At Sea)',
      status: '14.5 Knots • Heading 124°',
      colorClass: 'text-alert-amber',
      badgeBg: 'bg-alert-amber/10 border-alert-amber/30 text-alert-amber',
      badgeText: 'Live AIS Supertanker',
      refineryFeed: 'Destination: Vadinar SPM (Gujarat) • ETA: Aug 24',
      slateCompatibility: 'Basrah Heavy Crude (API 24.0°, Sulfur 3.8%)',
      strategicRole: 'Navigating Gulf of Oman corridor under active US-Iran war risk insurance surcharge (1.25%).',
      logisticsConnectivity: 'Live GPS Satellite Telemetry • Origin: Fujairah ADCOP Terminal',
      drawdownRateOrSpeed: 'Speed: 14.5 Knots (26.8 km/h)',
      bufferDays: 'Cargo: 2.0M Barrels Payload'
    },
    swarna_kamal: {
      id: 'swarna_kamal',
      category: 'tanker',
      name: 'VLCC Swarna Kamal (Live AIS)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Shipping Corporation of India (SCI) • MMSI 419005678',
      stock: '2.0M bbls Murban Sweet (At Sea)',
      status: '13.8 Knots • Heading 142°',
      colorClass: 'text-alert-amber',
      badgeBg: 'bg-alert-amber/10 border-alert-amber/30 text-alert-amber',
      badgeText: 'Live AIS Supertanker',
      refineryFeed: 'Destination: Mangalore SPM (MRPL) • ETA: Aug 25',
      slateCompatibility: 'Murban Sweet Crude (API 40.2°, Sulfur 0.78%)',
      strategicRole: 'Carrying ADCOP bypassed Abu Dhabi crude directly across Arabian Sea to Mangalore.',
      logisticsConnectivity: 'Live GPS Telemetry • Origin: Fujairah ADCOP Terminal (UAE)',
      drawdownRateOrSpeed: 'Speed: 13.8 Knots (25.5 km/h)',
      bufferDays: 'Cargo: 2.0M Barrels Payload'
    },
    ratna_shalini: {
      id: 'ratna_shalini',
      category: 'tanker',
      name: 'VLCC Ratna Shalini (Live AIS)',
      type: '300,000 DWT Very Large Crude Carrier (VLCC)',
      subtitle: 'Great Eastern Shipping • MMSI 419009876',
      stock: '1.9M bbls WTI Midland (At Sea)',
      status: '15.1 Knots • Heading 022°',
      colorClass: 'text-alert-amber',
      badgeBg: 'bg-alert-amber/10 border-alert-amber/30 text-alert-amber',
      badgeText: 'Live AIS Supertanker',
      refineryFeed: 'Destination: Paradip SPM (Odisha) • ETA: Aug 26',
      slateCompatibility: 'US WTI Midland (API 40.5°, Sulfur 0.20%)',
      strategicRole: 'Transatlantic long-haul vessel transiting Bay of Bengal towards Paradip refinery.',
      logisticsConnectivity: 'Live GPS Satellite Telemetry • Origin: Enterprise US Gulf Coast Terminal',
      drawdownRateOrSpeed: 'Speed: 15.1 Knots (28.0 km/h)',
      bufferDays: 'Cargo: 1.9M Barrels Payload'
    },
    // CAVERNS & PORTS
    vadinar: {
      id: 'vadinar',
      category: 'port',
      name: 'Vadinar SPM Berth & Tank Farm (Gujarat)',
      type: 'Single Point Mooring (SPM) Import Gateway',
      subtitle: 'Reliance Jamnagar & Nayara Energy Intake Hub',
      stock: '55.0M bbls (13.7 Days Cover)',
      status: '100% Operational (SPM-1 & SPM-2)',
      colorClass: 'text-alert-cyan',
      badgeBg: 'bg-alert-cyan/10 border-alert-cyan/30 text-alert-cyan',
      badgeText: 'Deepwater SPM Gateway',
      refineryFeed: 'Reliance Jamnagar (1.2M bpd) & Nayara (400k bpd)',
      slateCompatibility: 'Heavy Arabian, Basrah, Murban Sweet',
      strategicRole: 'Receives ~40% of India total crude imports. Feeds Vadinar-Bina crude pipeline.',
      logisticsConnectivity: 'Deepwater SPM offloading up to 300k DWT VLCCs at 10,000 m³/hr discharge rate',
      drawdownRateOrSpeed: 'Offloading: 240,000 bpd',
      bufferDays: '+13.7 Days West Coast Buffer'
    },
    padur: {
      id: 'padur',
      category: 'spr',
      name: 'Padur ISPRL Strategic Petroleum Cavern (Karnataka)',
      type: 'Underground Rock Cavern Strategic Reserve',
      subtitle: 'ISPRL 2.50 MMT Underground National Emergency Stockpile',
      stock: '18.37M bbls (100% Capacity)',
      status: 'Ready for Emergency LP Drawdown',
      colorClass: 'text-alert-emerald',
      badgeBg: 'bg-alert-emerald/10 border-alert-emerald/30 text-alert-emerald',
      badgeText: 'ISPRL Reserve Cavern',
      refineryFeed: 'Mangalore Refinery & Petrochemicals Ltd (MRPL)',
      slateCompatibility: 'Arab / Basrah Sour Heavy Blend',
      strategicRole: 'Protects against Strait of Hormuz closure for up to 18 additional refining days.',
      logisticsConnectivity: 'Direct subsea cross-country pipeline connected directly to MRPL & coastal barge docks',
      drawdownRateOrSpeed: 'Max Drawdown: 240,000 bpd',
      bufferDays: '+4.5 Days National Cover'
    },
    paradip: {
      id: 'paradip',
      category: 'port',
      name: 'Paradip IOCL Deepwater SPM & Refinery (Odisha)',
      type: 'East Coast Deepwater SPM & 15 MMT Refinery',
      subtitle: 'Indian Oil Corporation East Coast Primary Crude Hub',
      stock: '24.0M bbls (16.0 Days Cover)',
      status: 'Operational (Atlantic Import Active)',
      colorClass: 'text-alert-cyan',
      badgeBg: 'bg-alert-cyan/10 border-alert-cyan/30 text-alert-cyan',
      badgeText: 'East Coast Gateway',
      refineryFeed: 'IOCL Paradip 15 MMT, Haldia 8 MMT, Barauni 6 MMT',
      slateCompatibility: 'Bonny Light, Russian ESPO, US WTI Midland',
      strategicRole: 'Primary intake hub for Atlantic transatlantic bypass imports and Russian Kozmino crude.',
      logisticsConnectivity: 'Paradip-Haldia-Barauni-Guwahati Crude Pipeline (PHBPL 1,400 km network)',
      drawdownRateOrSpeed: 'Discharge: 180,000 bpd',
      bufferDays: '+16.0 Days East Coast Buffer'
    }
  };

  // Filter nodes based on activeTab or multi-selection
  const activeNodesList = Object.values(allNodeDetails).filter(n => {
    if (selectedNodeIds.length > 0) {
      return selectedNodeIds.includes(n.id);
    }
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  return (
    <div className={`p-5 rounded-xl border transition-colors flex flex-col h-full ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header & Simultaneous View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-inherit">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">Supply Chain Digital Twin</h2>
          
          {/* Category Filter Pills for Simultaneous Viewing */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => {
                setActiveTab('all');
                onSelectAllCategory('all');
              }}
              className={`px-2.5 py-1 rounded border transition ${
                activeTab === 'all' && selectedNodeIds.length === 0
                  ? 'bg-alert-amber/20 border-alert-amber text-alert-amber font-bold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Show All Telemetry ({Object.keys(allNodeDetails).length})
            </button>
            <button
              onClick={() => {
                setActiveTab('chokepoint');
                onSelectAllCategory('chokepoint');
              }}
              className={`px-2.5 py-1 rounded border transition ${
                activeTab === 'chokepoint'
                  ? 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              🔴 Chokepoints (2)
            </button>
            <button
              onClick={() => {
                setActiveTab('tanker');
                onSelectAllCategory('tanker');
              }}
              className={`px-2.5 py-1 rounded border transition ${
                activeTab === 'tanker'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              🚢 Supertankers (3)
            </button>
            <button
              onClick={() => {
                setActiveTab('spr');
                onSelectAllCategory('spr');
              }}
              className={`px-2.5 py-1 rounded border transition ${
                activeTab === 'spr'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              🛢️ ISPRL Caverns (3)
            </button>
            <button
              onClick={() => {
                setActiveTab('port');
                onSelectAllCategory('port');
              }}
              className={`px-2.5 py-1 rounded border transition ${
                activeTab === 'port'
                  ? 'bg-sky-500/20 border-sky-500 text-sky-400 font-bold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              ⚓ SPM Berths (4)
            </button>
          </div>
        </div>

        {/* Wide View Reset Button */}
        {selectedNodeIds.length > 0 && (
          <button
            onClick={onResetWideView}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-mono transition border border-slate-700 self-start md:self-auto"
          >
            <Maximize2 className="w-3.5 h-3.5 text-alert-amber" />
            <span>Reset Wide View ({selectedNodeIds.length} Active)</span>
          </button>
        )}
      </div>

      {/* Live Interactive Leaflet GIS Map Container */}
      <div className="mb-3 flex-1">
        <LiveLeafletMap theme={theme} selectedNodeIds={selectedNodeIds} />
      </div>

      {/* Quick Selection Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs mb-3">
        {/* Chokepoint 1 */}
        <div
          onClick={() => onToggleNode('hormuz')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('hormuz')
              ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-red-400">
            <span className="truncate">Hormuz</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">82.5 Risk</span>
        </div>

        {/* Chokepoint 2 */}
        <div
          onClick={() => onToggleNode('red_sea')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('red_sea')
              ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-red-400">
            <span className="truncate">Red Sea</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">76.0 Risk</span>
        </div>

        {/* Supertanker 1 */}
        <div
          onClick={() => onToggleNode('desh_vishal')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('desh_vishal')
              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span className="truncate">Desh Vishal</span>
            <Navigation className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">2.0M bbls</span>
        </div>

        {/* Supertanker 2 */}
        <div
          onClick={() => onToggleNode('swarna_kamal')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('swarna_kamal')
              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span className="truncate">Swarna Kamal</span>
            <Navigation className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">2.0M bbls</span>
        </div>

        {/* Supertanker 3 */}
        <div
          onClick={() => onToggleNode('ratna_shalini')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('ratna_shalini')
              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span className="truncate">Ratna Shalini</span>
            <Navigation className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">1.9M bbls</span>
        </div>

        {/* Padur Cavern */}
        <div
          onClick={() => onToggleNode('padur')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('padur')
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
            <span className="truncate">Padur Reserve</span>
            <Database className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">18.37M bbls</span>
        </div>

        {/* Vadinar SPM */}
        <div
          onClick={() => onToggleNode('vadinar')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('vadinar')
              ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
            <span className="truncate">Vadinar SPM</span>
            <Anchor className="w-3 h-3 text-sky-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">55.0M bbls</span>
        </div>

        {/* Paradip SPM */}
        <div
          onClick={() => onToggleNode('paradip')}
          className={`p-2 rounded border cursor-pointer transition ${
            selectedNodeIds.includes('paradip')
              ? 'border-sky-500 bg-sky-500/10 ring-2 ring-sky-500'
              : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-500'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
            <span className="truncate">Paradip SPM</span>
            <Factory className="w-3 h-3 text-sky-400" />
          </div>
          <span className="text-[9px] text-slate-400 block mt-0.5">24.0M bbls</span>
        </div>
      </div>

      {/* SIMULTANEOUS MULTI-CARD STRATEGIC INTELLIGENCE GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
            Live Telemetry Grid ({activeNodesList.length} Facilities & Chokepoints Displayed Simultaneously)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 font-mono">
          {activeNodesList.map((node) => (
            <div
              key={node.id}
              className={`p-4 rounded-xl border transition-all ${
                selectedNodeIds.includes(node.id)
                  ? 'border-alert-amber bg-alert-amber/10 shadow-lg ring-2 ring-alert-amber'
                  : theme === 'dark'
                  ? 'bg-dark-bg border-dark-border'
                  : 'bg-cream-bg border-cream-border'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-inherit">
                <div>
                  <h3 className={`font-bold text-xs ${node.colorClass}`}>{node.name}</h3>
                  <span className="text-[10px] text-slate-400 font-sans block">{node.subtitle}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${node.badgeBg}`}>
                  {node.badgeText}
                </span>
              </div>

              {/* Data Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-2.5">
                <div className={`p-2 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
                  <span className="text-slate-500 block">Stock / Transit</span>
                  <span className="font-bold text-alert-emerald text-[11px]">{node.stock}</span>
                </div>
                <div className={`p-2 rounded border ${theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-cream-card border-cream-border'}`}>
                  <span className="text-slate-500 block">Offload / Speed</span>
                  <span className="font-bold text-alert-amber text-[11px]">{node.drawdownRateOrSpeed}</span>
                </div>
              </div>

              {/* Strategic Role & Directive */}
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2">
                {node.strategicRole}
              </p>
              <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[10px]">
                <span className="text-slate-400">{node.logisticsConnectivity}</span>
                <span className="font-bold text-alert-cyan">{node.bufferDays}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
