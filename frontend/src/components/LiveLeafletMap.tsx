'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Helper component to center and fly map to selected node coordinates or reset to wide view
function MapFlyToHandler({ targetPos }: { targetPos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetPos) {
      map.flyTo(targetPos, 6.5, { duration: 1.5 });
    } else {
      map.flyTo([19.5, 67.5], 5, { duration: 1.5 });
    }
  }, [targetPos, map]);
  return null;
}

// Custom Animated Leaflet HTML DivIcons
const createRadarIcon = (color: string, label: string, isHighlighted: boolean = false, isAlert: boolean = false) => {
  const pulseHtml = (isAlert || isHighlighted)
    ? `<span class="absolute -inset-2.5 rounded-full ${isHighlighted ? 'bg-amber-400/60' : 'bg-red-500/40'} animate-ping"></span>`
    : '';

  const scaleClass = isHighlighted ? 'scale-150 ring-4 ring-amber-400' : 'group-hover:scale-125';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${pulseHtml}
        <div style="background-color: ${color};" class="w-4 h-4 rounded-full border-2 border-white shadow-xl flex items-center justify-center relative z-10 transition-transform ${scaleClass}">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute left-5 bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap shadow-md ${isHighlighted ? 'block' : 'hidden group-hover:block'} z-20">
          ${label}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

interface LiveLeafletMapProps {
  theme: 'dark' | 'cream';
  selectedNodeId: string | null;
}

export default function LiveLeafletMap({ theme, selectedNodeId }: LiveLeafletMapProps) {
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

  // Key GIS Locations (14 total: 4 Chokepoint Corridors, 3 Tankers, 3 Caverns, 4 SPM Ports)
  const locations = [
    {
      id: "hormuz",
      name: "Strait of Hormuz (Chokepoint)",
      pos: [26.56, 56.25] as [number, number],
      type: "chokepoint",
      color: "#EF4444",
      label: "STRAIT OF HORMUZ (82.5/100)",
      isAlert: true,
      threatScore: "82.5/100",
      volume: "1.89M bpd Transit",
      desc: "Elevated US-Iran military standoff, naval patrols, mine/missile threats along Iranian coast.",
      action: "Initiate Fujairah ADCOP Bypass"
    },
    {
      id: "red_sea",
      name: "Bab-el-Mandeb & Red Sea",
      pos: [12.58, 43.33] as [number, number],
      type: "chokepoint",
      color: "#EF4444",
      label: "BAB-EL-MANDEB & RED SEA (76/100)",
      isAlert: true,
      threatScore: "76.0/100",
      volume: "1.12M bpd Transit",
      desc: "Continuous Houthi anti-ship missile/drone attacks; major tankers forced into 16-day Cape detour.",
      action: "Reroute via Yanbu Petroline"
    },
    {
      id: "malacca",
      name: "Strait of Malacca",
      pos: [4.15, 100.50] as [number, number],
      type: "chokepoint",
      color: "#10B981",
      label: "STRAIT OF MALACCA (24/100)",
      threatScore: "24.0/100",
      volume: "85 Vessels / Day",
      desc: "Dense maritime traffic; low geopolitical threat; key corridor for Russian Far East (ESPO) & Asian trade.",
      action: "Normal Operational Status"
    },
    {
      id: "cape_gh",
      name: "Cape of Good Hope",
      pos: [-34.35, 18.47] as [number, number],
      type: "chokepoint",
      color: "#F59E0B",
      label: "CAPE OF GOOD HOPE (35/100)",
      threatScore: "35.0/100",
      volume: "60 Vessels / Day",
      desc: "Congestion at South African bunkering ports (Port Louis, Durban) due to Red Sea diversions.",
      action: "Monitor Cape Bunkering Delays (+15 Days)"
    },
    {
      id: "fujairah",
      name: "Fujairah ADCOP Bypass Terminal (UAE)",
      pos: [25.18, 56.36] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "DEEPWATER SPM BYPASS TERMINAL",
      desc: "Abu Dhabi Crude Oil Pipeline terminal bypassing Strait of Hormuz.",
      action: "540,000 bpd Rerouted to India"
    },
    {
      id: "vadinar",
      name: "Vadinar SPM Berth (Gujarat)",
      pos: [22.45, 69.66] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "VADINAR DEEPWATER SPM BERTH",
      capacity: "55.0M bbls Storage",
      desc: "Deepwater Single Point Mooring serving Reliance Jamnagar & Nayara."
    },
    {
      id: "mundra",
      name: "Mundra Port Crude Terminal",
      pos: [22.75, 69.70] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "MUNDRA CRUDE TERMINAL",
      capacity: "Mundra-Panipat Pipeline Origin",
      desc: "Key import terminal feeding IOCL Panipat refinery complex."
    },
    {
      id: "jnpt",
      name: "JNPT / Nhava Sheva (Mumbai)",
      pos: [18.95, 72.95] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "WEST COAST FREIGHT HUB",
      capacity: "BPCL & HPCL Mumbai Intake",
      desc: "BPCL Mumbai & HPCL Mumbai refinery crude intake terminal."
    },
    {
      id: "padur",
      name: "Padur ISPRL Cavern",
      pos: [13.25, 74.78] as [number, number],
      type: "spr",
      color: "#10B981",
      label: "PADUR 2.5 MMT ISPRL CAVERN",
      capacity: "2.50 MMT (18.37M bbls)",
      desc: "Strategic Petroleum Reserve underground rock cavern. Subsea pipeline to MRPL."
    },
    {
      id: "mangalore",
      name: "Mangalore ISPRL Cavern",
      pos: [12.91, 74.85] as [number, number],
      type: "spr",
      color: "#10B981",
      label: "MANGALORE 1.5 MMT CAVERN",
      capacity: "1.50 MMT (11.02M bbls)",
      desc: "Strategic Petroleum Reserve cavern connected to Mangalore Refinery (MRPL)."
    },
    {
      id: "visakh",
      name: "Visakhapatnam ISPRL Cavern",
      pos: [17.68, 83.21] as [number, number],
      type: "spr",
      color: "#10B981",
      label: "VISAKHAPATNAM 1.33 MMT CAVERN",
      capacity: "1.33 MMT (9.77M bbls)",
      desc: "East Coast Strategic Petroleum Reserve linked to HPCL Visakh refinery."
    },
    {
      id: "paradip",
      name: "Paradip SPM Berth (Odisha)",
      pos: [20.26, 86.67] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "PARADIP DEEPWATER SPM BERTH",
      capacity: "24.0M bbls Storage",
      desc: "IOCL Paradip 15 MMT refinery deepwater crude offloading SPM."
    },
    {
      id: "desh_vishal",
      name: "VLCC Desh Vishal (Live AIS)",
      pos: [deshLat, deshLng] as [number, number],
      type: "tanker",
      color: "#F59E0B",
      label: "VLCC DESH VISHAL (2.0M bbls)",
      status: "14.5 Knots • Heading 124°",
      cargo: "2.0M bbls Basrah Heavy",
      desc: "MMSI 419001234 • Indian Flag (SCI) • Live GPS Telemetry Active.",
      action: "Destination: Vadinar SPM (ETA Aug 24)"
    },
    {
      id: "swarna_kamal",
      name: "VLCC Swarna Kamal (Live AIS)",
      pos: [swarnaLat, swarnaLng] as [number, number],
      type: "tanker",
      color: "#F59E0B",
      label: "VLCC SWARNA KAMAL (2.0M bbls)",
      status: "13.8 Knots • Heading 142°",
      cargo: "2.0M bbls Murban Sweet",
      desc: "MMSI 419005678 • SCI Fleet • ADCOP Bypassed Cargo in Transit.",
      action: "Destination: Mangalore SPM (ETA Aug 25)"
    },
    {
      id: "ratna_shalini",
      name: "VLCC Ratna Shalini (Live AIS)",
      pos: [ratnaLat, ratnaLng] as [number, number],
      type: "tanker",
      color: "#F59E0B",
      label: "VLCC RATNA SHALINI (1.9M bbls)",
      status: "15.1 Knots • Heading 022°",
      cargo: "1.9M bbls WTI Midland",
      desc: "MMSI 419009876 • Great Eastern Fleet • Transatlantic Sourcing Route.",
      action: "Destination: Paradip SPM (ETA Aug 26)"
    }
  ];

  // Selected Target FlyTo Position
  const selectedLocation = locations.find(l => l.id === selectedNodeId);
  const targetPos = selectedLocation ? selectedLocation.pos : null;

  // Dynamic Tile URL based on Theme
  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const popupClass = theme === 'dark' ? 'custom-dark-popup' : 'custom-cream-popup';

  // Primary & Alternative Routes
  const hormuzCorridor: [number, number][] = [[26.56, 56.25], [deshLat, deshLng], [22.45, 69.66]];
  const adcopBypassRoute: [number, number][] = [[25.18, 56.36], [swarnaLat, swarnaLng], [12.91, 74.85]];
  const eastCoastLane: [number, number][] = [[ratnaLat, ratnaLng], [17.68, 83.21], [20.26, 86.67]];

  return (
    <div id="leaflet-map-root" className={`w-full h-[520px] rounded-xl overflow-hidden border shadow-2xl relative z-0 ${
      theme === 'dark' ? 'border-slate-700/60' : 'border-stone-300'
    }`}>
      <MapContainer
        key={`leaflet-map-${theme}`}
        center={[19.5, 67.5]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full relative z-0"
      >
        <MapFlyToHandler targetPos={targetPos} />

        {/* Dynamic CartoDB Dark / Voyager Light Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        <Polyline positions={hormuzCorridor} color="#EF4444" weight={3} dashArray="8, 12" />
        <Polyline positions={adcopBypassRoute} color="#0284C7" weight={3} dashArray="6, 10" />
        <Polyline positions={eastCoastLane} color="#10B981" weight={2.5} dashArray="4, 8" />

        {locations.map((loc) => {
          const isSelected = selectedNodeId === loc.id;
          const icon = createRadarIcon(loc.color, loc.label, isSelected, loc.isAlert);

          return (
            <Marker key={loc.id} position={loc.pos} icon={icon}>
              <Popup className={popupClass}>
                <div className="font-mono text-xs p-1 max-w-[250px] space-y-1.5">
                  <div className="flex items-center justify-between border-b pb-1 border-slate-200">
                    <strong className="text-slate-900 font-bold text-xs">{loc.name}</strong>
                    {loc.threatScore && (
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                        {loc.threatScore}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-slate-700 font-sans leading-tight">{loc.desc}</p>

                  {loc.status && (
                    <div className="text-[10px] text-amber-900 font-semibold bg-amber-100 p-1 rounded">
                      Status: {loc.status}
                    </div>
                  )}
                  
                  {loc.capacity && (
                    <div className="text-[10px] text-slate-800 font-semibold bg-slate-100 p-1 rounded">
                      Capacity: {loc.capacity}
                    </div>
                  )}
                  {loc.cargo && (
                    <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 p-1 rounded">
                      Cargo: {loc.cargo}
                    </div>
                  )}
                  {loc.action && (
                    <div className="text-[10px] text-blue-700 font-bold bg-blue-50 p-1 rounded">
                      {loc.action}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
