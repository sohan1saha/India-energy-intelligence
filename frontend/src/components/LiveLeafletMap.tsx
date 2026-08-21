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
      map.flyTo([5.0, 35.0], 3.2, { duration: 1.5 });
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
const createPortIcon = (name: string, isMajor: boolean = false, isAlert: boolean = false, isSelected: boolean = false) => {
  const size = isMajor ? (isSelected ? 'w-4 h-4' : 'w-3 h-3') : 'w-2 h-2';
  const color = isAlert
    ? 'bg-red-500 ring-red-400'
    : isSelected
    ? 'bg-amber-400 ring-amber-300'
    : 'bg-white ring-cyan-400';
  const labelColor = isAlert
    ? 'text-red-400 font-extrabold'
    : isSelected
    ? 'text-amber-300 font-extrabold scale-110'
    : 'text-slate-100 font-bold';

  return L.divIcon({
    className: 'custom-leaflet-port-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${(isAlert || isSelected) ? `<span class="absolute -inset-2.5 rounded-full ${isSelected ? 'bg-amber-400/50' : 'bg-red-500/40'} animate-ping"></span>` : ''}
        <div class="${size} rounded-full ${color} ring-2 shadow-lg transition-transform group-hover:scale-150 relative z-10"></div>
        <div class="absolute left-4 top-[-4px] text-[9px] font-mono tracking-wider ${labelColor} whitespace-nowrap uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] select-none z-20">
          ${name}
        </div>
      </div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

interface LiveLeafletMapProps {
  theme: 'dark' | 'cream';
  selectedNodeId: string | null;
  selectedStrategyId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
}

export default function LiveLeafletMap({ theme, selectedNodeId, selectedStrategyId, onSelectNode }: LiveLeafletMapProps) {
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

  // Global Maritime Shipping Network Base Ports & Risk Corridors
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

    // Geopolitical Risk Corridors & Chokepoints
    { id: "hormuz", name: "STRAIT OF HORMUZ (82.5/100)", pos: [26.56, 56.25] as [number, number], isMajor: true, isAlert: true },
    { id: "red_sea", name: "BAB-EL-MANDEB & RED SEA (76/100)", pos: [12.58, 43.33] as [number, number], isMajor: true, isAlert: true },
    { id: "malacca", name: "STRAIT OF MALACCA (24/100)", pos: [4.15, 100.50] as [number, number], isMajor: true },
    { id: "cape_gh", name: "CAPE OF GOOD HOPE (35/100)", pos: [-34.35, 18.47] as [number, number], isMajor: true, isAlert: true },

    // International Overseas Hubs
    { id: "durban", name: "DURBAN", pos: [-29.85, 31.02] as [number, number], isMajor: false },
    { id: "singapore", name: "SINGAPORE", pos: [1.35, 103.81] as [number, number], isMajor: true },
    { id: "klang", name: "PORT KLANG", pos: [3.00, 101.40] as [number, number], isMajor: false },
    { id: "jakarta", name: "JAKARTA", pos: [-6.20, 106.84] as [number, number], isMajor: false },
    { id: "shanghai", name: "SHANGHAI", pos: [31.23, 121.47] as [number, number], isMajor: true },
    { id: "hongkong", name: "HONG KONG", pos: [22.31, 114.16] as [number, number], isMajor: false },
    { id: "kozmino", name: "KOZMINO RUSSIA", pos: [42.73, 133.08] as [number, number], isMajor: true },
    { id: "yokohama", name: "YOKOHAMA", pos: [35.44, 139.63] as [number, number], isMajor: false },
    { id: "santos", name: "SANTOS BRAZIL", pos: [-23.96, -46.33] as [number, number], isMajor: true },
    { id: "houston", name: "HOUSTON US GULF", pos: [28.95, -95.35] as [number, number], isMajor: true },

    // Supertankers at Sea (Explicit Map Markers)
    { id: "desh_vishal", name: "VLCC DESH VISHAL (2.0M bbls)", pos: [deshLat, deshLng] as [number, number], isMajor: true, cargo: "2.0M bbls Basrah Heavy", origin: "Fujairah ADCOP Terminal (UAE)", destination: "Vadinar SPM (Gujarat)" },
    { id: "swarna_kamal", name: "VLCC SWARNA KAMAL (2.0M bbls)", pos: [swarnaLat, swarnaLng] as [number, number], isMajor: true, cargo: "2.0M bbls Murban Sweet", origin: "Fujairah ADCOP Terminal (UAE)", destination: "Mangalore SPM (MRPL)" },
    { id: "ratna_shalini", name: "VLCC RATNA SHALINI (1.9M bbls)", pos: [ratnaLat, ratnaLng] as [number, number], isMajor: true, cargo: "1.9M bbls WTI Midland", origin: "Enterprise US Gulf Terminal (Texas, USA)", destination: "Paradip SPM (Odisha)" }
  ];

  // Selected Target FlyTo Position
  const selectedLocation = ports.find(p => p.id === selectedNodeId);
  const targetPos = selectedLocation ? selectedLocation.pos : null;

  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // Oceanic Corridors (Only displayed when corresponding strategy is clicked)
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
    [28.95, -95.35], [24.00, -85.00], [-23.96, -46.33], [-29.85, 31.02], [-34.35, 18.47], [-30.00, 45.00], [ratnaLat, ratnaLng], [20.26, 86.67]
  ];

  const domesticSurgeCorridor: [number, number][] = [
    [13.25, 74.78], [12.91, 74.85], [17.68, 83.21], [20.26, 86.67], [19.42, 71.33], [22.45, 69.66]
  ];

  // Specific Vessel Live AIS Voyage Polylines (Rendered when ANY ship is clicked)
  const deshVishalVoyage: [number, number][] = [
    [25.18, 56.36], [24.80, 57.50], [deshLat, deshLng], [23.50, 64.00], [22.45, 69.66]
  ];

  const swarnaKamalVoyage: [number, number][] = [
    [25.18, 56.36], [23.00, 59.00], [18.00, 65.00], [swarnaLat, swarnaLng], [12.91, 74.85]
  ];

  const ratnaShaliniVoyage: [number, number][] = [
    [28.95, -95.35], [24.00, -85.00], [-34.35, 18.47], [-20.00, 55.00], [ratnaLat, ratnaLng], [17.68, 83.21], [20.26, 86.67]
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

        {/* DYNAMIC STRATEGY CORRIDORS - SHOWN WHEN STRATEGY CARD IS CLICKED */}
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

        {/* DYNAMIC SHIP VOYAGE ROUTE POLYLINES - SHOWN WHEN ANY SHIP IS CLICKED */}
        {selectedNodeId === 'desh_vishal' && (
          <Polyline positions={deshVishalVoyage} color="#F59E0B" weight={4.5} opacity={0.95} dashArray="6, 8" />
        )}

        {selectedNodeId === 'swarna_kamal' && (
          <Polyline positions={swarnaKamalVoyage} color="#00F0FF" weight={4.5} opacity={0.95} dashArray="6, 8" />
        )}

        {selectedNodeId === 'ratna_shalini' && (
          <Polyline positions={ratnaShaliniVoyage} color="#10B981" weight={4.5} opacity={0.95} dashArray="6, 8" />
        )}

        {/* ALL BASE PORTS, RISK CHOKEPOINTS & TANKERS */}
        {ports.map((port) => {
          const isSelected = selectedNodeId === port.id;
          return (
            <Marker
              key={port.id}
              position={port.pos}
              icon={createPortIcon(port.name, port.isMajor, port.isAlert, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectNode) {
                    onSelectNode(selectedNodeId === port.id ? null : port.id);
                  }
                },
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup()
              }}
            >
              <Popup className={theme === 'dark' ? 'custom-dark-popup' : 'custom-cream-popup'}>
                <div className="font-mono text-xs p-1 space-y-1">
                  <strong className="text-white block font-bold">{port.name}</strong>
                  {port.origin && <p className="text-[10px] text-emerald-400 font-semibold">ORIGIN: {port.origin}</p>}
                  {port.destination && <p className="text-[10px] text-sky-400 font-semibold">DESTINATION: {port.destination}</p>}
                  {port.cargo && <p className="text-[10px] text-amber-300 font-bold">CARGO: {port.cargo}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* SHIP VOYAGE ROUTE CARD - SHOWN WHEN ANY SHIP IS SELECTED */}
      {selectedNodeId && ['desh_vishal', 'swarna_kamal', 'ratna_shalini'].includes(selectedNodeId) && (
        <div className={`absolute bottom-4 left-4 p-3.5 rounded-lg border shadow-xl z-20 font-mono text-[11px] max-w-sm ${
          theme === 'dark' ? 'bg-slate-900/95 border-amber-500/50 text-slate-100' : 'bg-white/95 border-amber-500 text-stone-900'
        }`}>
          <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-inherit">
            <span className="font-bold text-amber-400 uppercase tracking-wide">
              {selectedNodeId === 'desh_vishal' ? 'VLCC DESH VISHAL TELEMETRY' : selectedNodeId === 'swarna_kamal' ? 'VLCC SWARNA KAMAL TELEMETRY' : 'VLCC RATNA SHALINI TELEMETRY'}
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <p className="text-[10px] text-slate-300 mb-1">
            <strong>ORIGIN:</strong> {selectedNodeId === 'desh_vishal' ? 'Fujairah ADCOP Terminal (UAE)' : selectedNodeId === 'swarna_kamal' ? 'Fujairah ADCOP Terminal (UAE)' : 'Enterprise US Gulf Terminal (Texas, USA)'}
          </p>
          <p className="text-[10px] text-slate-300 mb-1">
            <strong>DESTINATION:</strong> {selectedNodeId === 'desh_vishal' ? 'Vadinar SPM (Gujarat, India)' : selectedNodeId === 'swarna_kamal' ? 'Mangalore SPM (Karnataka, India)' : 'Paradip SPM (Odisha, India)'}
          </p>
          <p className="text-[10px] text-amber-300 font-bold">
            LIVE VOYAGE ROUTE HIGHLIGHTED ON MAP 📍
          </p>
        </div>
      )}

      {/* MARITIME LOGISTICS LEGEND CARD - ONLY SHOWN WHEN A STRATEGY CARD IS EXPLICITLY CLICKED */}
      {selectedStrategyId && (
        <div className={`absolute bottom-4 right-4 p-3 rounded-lg border shadow-xl z-20 font-mono text-[10px] ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-700 text-slate-200' : 'bg-white/90 border-stone-300 text-stone-800'
        }`}>
          <div className="font-bold uppercase tracking-wider mb-2 border-b pb-1 border-inherit flex items-center justify-between gap-3">
            <span>ACTIVE STRATEGY NETWORK</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <div className="space-y-1.5">
            {selectedStrategyId === 'strat_bypass' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-amber-500"></span>
                  <span>PERSIAN GULF / ADCOP BYPASS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-cyan-400"></span>
                  <span>RED SEA YANBU PETROLINE</span>
                </div>
              </>
            )}

            {selectedStrategyId === 'strat_global_pivot' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-red-500"></span>
                <span>TRANSATLANTIC & CAPE SERVICE</span>
              </div>
            )}

            {selectedStrategyId === 'strat_far_east' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-500"></span>
                <span>FAR EAST & ESPO PACIFIC CORRIDOR</span>
              </div>
            )}

            {selectedStrategyId === 'strat_latam' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-purple-500"></span>
                <span>SOUTH AMERICAN TRANSATLANTIC ROUTE</span>
              </div>
            )}

            {selectedStrategyId === 'strat_national_surge' && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-pink-500"></span>
                <span>NATIONAL ISPRL & ONGC SURGE</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-inherit">
              <span className="w-2 h-2 rounded-full bg-white ring-1 ring-cyan-400"></span>
              <span>BASE PORTS & SPM TERMINALS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
