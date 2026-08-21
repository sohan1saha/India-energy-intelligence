'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper component to center and fly map to selected node coordinates, strategy focus, or reset to wide view
function MapFlyToHandler({
  targetPos,
  selectedStrategyId
}: {
  targetPos: [number, number] | null;
  selectedStrategyId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (targetPos) {
      map.flyTo(targetPos, 6.5, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_bypass') {
      map.flyTo([21.0, 64.0], 5.2, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_global_pivot') {
      map.flyTo([10.0, 35.0], 3.2, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_far_east') {
      map.flyTo([18.0, 105.0], 4.0, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_latam') {
      map.flyTo([-10.0, 15.0], 2.8, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_national_surge') {
      map.flyTo([18.5, 76.0], 5.8, { duration: 1.5 });
    } else {
      map.flyTo([19.5, 67.5], 4.8, { duration: 1.5 });
    }
  }, [targetPos, selectedStrategyId, map]);
  return null;
}

// Custom Shipping Network Base Port Ring Marker (Matching Wallenius Wilhelmsen shipping map style)
const createPortIcon = (name: string, isMajor: boolean = false, isAlert: boolean = false) => {
  const size = isMajor ? 'w-3 h-3' : 'w-2 h-2';
  const color = isAlert ? 'bg-red-500 ring-red-400' : 'bg-white ring-cyan-400';
  const labelColor = isAlert ? 'text-red-400 font-extrabold' : 'text-slate-100 font-bold';

  return L.divIcon({
    className: 'custom-leaflet-port-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <div class="${size} rounded-full ${color} ring-2 shadow-lg transition-transform group-hover:scale-150"></div>
        <div class="absolute left-3.5 top-[-4px] text-[9px] font-mono tracking-wider ${labelColor} whitespace-nowrap uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none">
          ${name}
        </div>
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

interface LiveLeafletMapProps {
  theme: 'dark' | 'cream';
  selectedNodeId: string | null;
  selectedStrategyId?: string | null;
}

export default function LiveLeafletMap({ theme, selectedNodeId, selectedStrategyId }: LiveLeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [vesselTicks, setVesselTicks] = useState<number>(0);

  useEffect(() => {
    const container = L.DomUtil.get('leaflet-map-root');
    if (container !== null) {
      (container as any)._leaflet_id = null;
    }
    setIsMounted(true);

    const interval = setInterval(() => {
      setVesselTicks(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full h-[520px] rounded-xl flex items-center justify-center text-xs font-mono ${
        theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-stone-200 text-stone-600'
      }`}>
        Loading High-Definition AIS Maritime Telemetry Radar...
      </div>
    );
  }

  // Live Drifting Telemetry Calculations for Supertankers
  const deshLat = 24.50 + Math.sin(vesselTicks * 0.1) * 0.08;
  const deshLng = 58.20 + Math.cos(vesselTicks * 0.1) * 0.12;

  const swarnaLat = 15.10 + Math.cos(vesselTicks * 0.12) * 0.10;
  const swarnaLng = 71.40 + Math.sin(vesselTicks * 0.12) * 0.10;

  const ratnaLat = 11.50 + Math.sin(vesselTicks * 0.08) * 0.12;
  const ratnaLng = 84.20 + Math.cos(vesselTicks * 0.08) * 0.08;

  // Global Maritime Shipping Network Base Ports
  const ports = [
    // Indian Gateways & Terminals
    { id: "vadinar", name: "VADINAR", pos: [22.45, 69.66] as [number, number], isMajor: true },
    { id: "mundra", name: "MUNDRA", pos: [22.75, 69.70] as [number, number], isMajor: false },
    { id: "mumbai", name: "MUMBAI / JNPT", pos: [18.95, 72.95] as [number, number], isMajor: true },
    { id: "mangalore", name: "MANGALORE", pos: [12.91, 74.85] as [number, number], isMajor: true },
    { id: "padur", name: "PADUR SPR", pos: [13.25, 74.78] as [number, number], isMajor: false },
    { id: "kochi", name: "KOCHI", pos: [9.93, 76.26] as [number, number], isMajor: false },
    { id: "visakh", name: "VISAKHAPATNAM", pos: [17.68, 83.21] as [number, number], isMajor: true },
    { id: "paradip", name: "PARADIP", pos: [20.26, 86.67] as [number, number], isMajor: true },
    { id: "haldia", name: "HALDIA", pos: [22.02, 88.06] as [number, number], isMajor: false },

    // Middle East Base Ports
    { id: "fujairah", name: "FUJAIRAH ADCOP", pos: [25.18, 56.36] as [number, number], isMajor: true },
    { id: "jebel_ali", name: "JEBEL ALI", pos: [25.00, 55.06] as [number, number], isMajor: false },
    { id: "sohar", name: "SOHAR", pos: [24.36, 56.73] as [number, number], isMajor: false },
    { id: "dammam", name: "DAMMAM", pos: [26.43, 50.10] as [number, number], isMajor: false },
    { id: "hamad", name: "HAMAD", pos: [25.01, 51.61] as [number, number], isMajor: false },
    { id: "kuwait", name: "KUWAIT CITY", pos: [29.37, 47.97] as [number, number], isMajor: false },
    { id: "jeddah", name: "JEDDAH", pos: [21.48, 39.19] as [number, number], isMajor: false },
    { id: "yanbu", name: "YANBU PETROLINE", pos: [24.08, 38.06] as [number, number], isMajor: true },

    // Chokepoints (Alert Pins)
    { id: "hormuz", name: "HORMUZ (ALERT)", pos: [26.56, 56.25] as [number, number], isMajor: true, isAlert: true },
    { id: "red_sea", name: "RED SEA (ALERT)", pos: [12.58, 43.33] as [number, number], isMajor: true, isAlert: true },
    { id: "malacca", name: "MALACCA STRAIT", pos: [4.15, 100.50] as [number, number], isMajor: true },

    // International Overseas Hubs
    { id: "durban", name: "DURBAN", pos: [-29.85, 31.02] as [number, number], isMajor: false },
    { id: "cape_town", name: "CAPE TOWN", pos: [-33.92, 18.42] as [number, number], isMajor: true },
    { id: "singapore", name: "SINGAPORE", pos: [1.35, 103.81] as [number, number], isMajor: true },
    { id: "klang", name: "PORT KLANG", pos: [3.00, 101.40] as [number, number], isMajor: false },
    { id: "jakarta", name: "JAKARTA", pos: [-6.20, 106.84] as [number, number], isMajor: false },
    { id: "shanghai", name: "SHANGHAI", pos: [31.23, 121.47] as [number, number], isMajor: true },
    { id: "hongkong", name: "HONG KONG", pos: [22.31, 114.16] as [number, number], isMajor: false },
    { id: "kozmino", name: "KOZMINO RUSSIA", pos: [42.73, 133.08] as [number, number], isMajor: true },
    { id: "yokohama", name: "YOKOHAMA", pos: [35.44, 139.63] as [number, number], isMajor: false },
    { id: "santos", name: "SANTOS BRAZIL", pos: [-23.96, -46.33] as [number, number], isMajor: true },
    { id: "houston", name: "HOUSTON US GULF", pos: [28.95, -95.35] as [number, number], isMajor: true }
  ];

  // Selected Target FlyTo Position
  const selectedLocation = ports.find(p => p.id === selectedNodeId);
  const targetPos = selectedLocation ? selectedLocation.pos : null;

  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // Wallenius Wilhelmsen Style Oceanic Corridors (Only displayed when corresponding strategy is clicked)
  const middleEastBypassCorridor: [number, number][] = [
    [29.37, 47.97], [26.43, 50.10], [25.01, 51.61], [25.00, 55.06], [26.56, 56.25], [25.18, 56.36], [24.36, 56.73], [deshLat, deshLng], [22.45, 69.66]
  ];

  const redSeaBypassCorridor: [number, number][] = [
    [24.08, 38.06], [21.48, 39.19], [18.00, 40.20], [12.58, 43.33], [12.00, 51.00], [swarnaLat, swarnaLng], [12.91, 74.85]
  ];

  const farEastPacificCorridor: [number, number][] = [
    [42.73, 133.08], [35.44, 139.63], [31.23, 121.47], [22.31, 114.16], [3.00, 101.40], [1.35, 103.81], [4.15, 100.50], [10.00, 93.00], [17.68, 83.21], [20.26, 86.67]
  ];

  const atlanticCapeCorridor: [number, number][] = [
    [28.95, -95.35], [24.00, -85.00], [-23.96, -46.33], [-29.85, 31.02], [-33.92, 18.42], [-30.00, 45.00], [ratnaLat, ratnaLng], [20.26, 86.67]
  ];

  const domesticSurgeCorridor: [number, number][] = [
    [13.25, 74.78], [12.91, 74.85], [17.68, 83.21], [20.26, 86.67], [19.42, 71.33], [22.45, 69.66]
  ];

  return (
    <div id="leaflet-map-root" className={`w-full h-[520px] rounded-xl overflow-hidden border shadow-2xl relative z-0 ${
      theme === 'dark' ? 'border-slate-700/60 bg-[#0A0E17]' : 'border-stone-300 bg-[#FAF8F5]'
    }`}>
      <MapContainer
        key={`leaflet-map-${theme}`}
        center={[19.5, 67.5]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full relative z-0"
      >
        <MapFlyToHandler targetPos={targetPos} selectedStrategyId={selectedStrategyId || null} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        {/* DYNAMIC STRATEGY CORRIDORS - ONLY SHOWN WHEN SPECIFIC STRATEGY CARD IS CLICKED */}
        {selectedStrategyId === 'strat_bypass' && (
          <>
            <Polyline positions={middleEastBypassCorridor} color="#00F0FF" weight={3.5} opacity={0.9} />
            <Polyline positions={redSeaBypassCorridor} color="#F59E0B" weight={3.5} opacity={0.9} dashArray="4, 6" />
          </>
        )}

        {selectedStrategyId === 'strat_global_pivot' && (
          <Polyline positions={atlanticCapeCorridor} color="#EF4444" weight={3.5} opacity={0.9} />
        )}

        {selectedStrategyId === 'strat_far_east' && (
          <Polyline positions={farEastPacificCorridor} color="#10B981" weight={3.5} opacity={0.9} />
        )}

        {selectedStrategyId === 'strat_latam' && (
          <Polyline positions={atlanticCapeCorridor} color="#A855F7" weight={3.5} opacity={0.9} />
        )}

        {selectedStrategyId === 'strat_national_surge' && (
          <Polyline positions={domesticSurgeCorridor} color="#EC4899" weight={4} opacity={0.95} dashArray="3, 5" />
        )}

        {/* ALL BASE PORTS & TERMINALS */}
        {ports.map((port) => (
          <Marker
            key={port.id}
            position={port.pos}
            icon={createPortIcon(port.name, port.isMajor, port.isAlert)}
          >
            <Popup className={theme === 'dark' ? 'custom-dark-popup' : 'custom-cream-popup'}>
              <div className="font-mono text-xs p-1">
                <strong className="text-white block font-bold">{port.name} PORT HUB</strong>
                <span className="text-[10px] text-slate-300">Base Port & Maritime Intake Terminal</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* MARITIME LOGISTICS LEGEND CARD */}
      <div className={`absolute bottom-4 right-4 p-3 rounded-lg border shadow-xl z-20 font-mono text-[10px] ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white/90 border-stone-300 text-stone-800'
      }`}>
        <div className="font-bold uppercase tracking-wider mb-2 border-b pb-1 border-inherit flex items-center justify-between gap-3">
          <span>MARITIME SERVICE NETWORK</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-red-500"></span>
            <span>TRANSATLANTIC & CAPE SERVICE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-cyan-400"></span>
            <span>PERSIAN GULF / ADCOP BYPASS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-emerald-500"></span>
            <span>FAR EAST & ESPO PACIFIC CORRIDOR</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-inherit">
            <span className="w-2 h-2 rounded-full bg-white ring-1 ring-cyan-400"></span>
            <span>BASE PORTS & SPM TERMINALS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
