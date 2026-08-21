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
      map.flyTo([21.0, 64.0], 5.5, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_global_pivot') {
      map.flyTo([5.0, 30.0], 3.2, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_far_east') {
      map.flyTo([18.0, 105.0], 4.0, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_latam') {
      map.flyTo([-15.0, 10.0], 3.0, { duration: 1.5 });
    } else if (selectedStrategyId === 'strat_national_surge') {
      map.flyTo([18.5, 76.0], 5.8, { duration: 1.5 });
    } else {
      map.flyTo([19.5, 67.5], 5, { duration: 1.5 });
    }
  }, [targetPos, selectedStrategyId, map]);
  return null;
}

// Function to generate sweeping, magnetic-field-style elliptical circular arcs between waypoints
function generateMagneticFieldArc(start: [number, number], end: [number, number], arcOffset: number = 0.35): [number, number][] {
  const points: [number, number][] = [];
  const steps = 30;

  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;

  const dx = end[1] - start[1];
  const dy = end[0] - start[0];
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular magnetic field line vector offset
  const perpLat = -dx / (dist || 1) * dist * arcOffset;
  const perpLng = dy / (dist || 1) * dist * arcOffset;

  const ctrlLat = midLat + perpLat;
  const ctrlLng = midLng + perpLng;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * ctrlLat + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * ctrlLng + t * t * end[1];
    points.push([lat, lng]);
  }
  return points;
}

// Function to convert multi-waypoint routes into magnetic field arcs
function generateMagneticRoute(waypoints: [number, number][], arcOffset: number = 0.35): [number, number][] {
  if (waypoints.length < 2) return waypoints;
  let fullPath: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const segmentArc = generateMagneticFieldArc(waypoints[i], waypoints[i + 1], arcOffset);
    if (i > 0) segmentArc.shift();
    fullPath = fullPath.concat(segmentArc);
  }
  return fullPath;
}

// Custom Animated Leaflet HTML DivIcons
const createRadarIcon = (color: string, label: string, isHighlighted: boolean = false, isAlert: boolean = false) => {
  const pulseHtml = (isAlert || isHighlighted)
    ? `<span class="absolute -inset-2.5 rounded-full ${isHighlighted ? 'bg-amber-400/60' : 'bg-red-500/40'} animate-ping"></span>`
    : '';

  const scaleClass = isHighlighted ? 'scale-150 ring-4 ring-amber-400 font-bold' : 'group-hover:scale-125';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${pulseHtml}
        <div style="background-color: ${color};" class="w-4 h-4 rounded-full border-2 border-white shadow-xl flex items-center justify-center relative z-10 transition-transform ${scaleClass}">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute left-5 bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap shadow-md ${isHighlighted ? 'block font-bold border-amber-400' : 'hidden group-hover:block'} z-20">
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

  // Key GIS Locations (Including International Terminal Pins)
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
      id: "yanbu",
      name: "Yanbu Petroline Red Sea Terminal (Saudi Arabia)",
      pos: [24.08, 38.06] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "YANBU PETROLINE TERMINAL",
      desc: "Saudi Aramco East-West pipeline terminal on Red Sea coast.",
      action: "420,000 bpd Rerouted via Red Sea"
    },
    {
      id: "santos",
      name: "Santos Basin Offshore Terminal (Brazil)",
      pos: [-23.96, -46.33] as [number, number],
      type: "port",
      color: "#8B5CF6",
      label: "BRAZIL PETROBRAS TUPI TERMINAL",
      desc: "Deepwater Santos Basin offshore loading terminal for Tupi & Lula medium crude.",
      action: "480,000 bpd Transatlantic Sourcing"
    },
    {
      id: "kozmino",
      name: "Kozmino Pacific Oil Terminal (Russia)",
      pos: [42.73, 133.08] as [number, number],
      type: "port",
      color: "#10B981",
      label: "KOZMINO ESPO PACIFIC TERMINAL",
      desc: "ESPO crude Pacific pipeline export terminal near Nakhodka.",
      action: "600,000 bpd Pacific Corridor Sourcing"
    },
    {
      id: "us_gulf",
      name: "Enterprise Offshore US Gulf Terminal (Texas, USA)",
      pos: [28.95, -95.35] as [number, number],
      type: "port",
      color: "#0284C7",
      label: "US GULF WTI EXPORT HUB",
      desc: "Deepwater Freeport offshore VLCC terminal exporting WTI Midland crude.",
      action: "420,000 bpd Transatlantic Sourcing"
    },
    {
      id: "ongc_mumbai",
      name: "ONGC Mumbai High Offshore Platform (India)",
      pos: [19.42, 71.33] as [number, number],
      type: "spr",
      color: "#EC4899",
      label: "ONGC MUMBAI HIGH PLATFORM",
      desc: "India's largest domestic offshore crude production complex.",
      action: "360,000 bpd Production Surge"
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
      origin: "Fujairah ADCOP Terminal (UAE)",
      destination: "Vadinar SPM (Gujarat) [ETA Aug 24]",
      desc: "MMSI 419001234 • Indian Flag (SCI) • Live Telemetry Active"
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
      origin: "Fujairah ADCOP Terminal (UAE)",
      destination: "Mangalore SPM (MRPL) [ETA Aug 25]",
      desc: "MMSI 419005678 • SCI Fleet • ADCOP Bypass Active"
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
      origin: "Enterprise US Gulf Terminal (Texas, USA)",
      destination: "Paradip SPM (Odisha) [ETA Aug 26]",
      desc: "MMSI 419009876 • Great Eastern Fleet • Transatlantic Sourcing"
    }
  ];

  // Selected Target FlyTo Position
  const selectedLocation = locations.find(l => l.id === selectedNodeId);
  const targetPos = selectedLocation ? selectedLocation.pos : null;

  const tileUrl = theme === 'dark'
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const popupClass = theme === 'dark' ? 'custom-dark-popup' : 'custom-cream-popup';

  // Magnetic Field Lines Style Arc Arrays (Sweeping outward magnetic field loops)
  const strat1Routes = [
    generateMagneticFieldArc([25.18, 56.36], [22.45, 69.66], 0.30),
    generateMagneticFieldArc([25.18, 56.36], [22.45, 69.66], -0.30), // Outer magnetic loop
    generateMagneticRoute([[24.08, 38.06], [18.00, 40.00], [12.58, 43.33], [12.00, 52.00], [12.91, 74.85]], 0.35)
  ];

  const strat2Routes = [
    generateMagneticRoute([[28.95, -95.35], [24.00, -85.00], [23.00, -79.00], [18.00, -50.00], [0.00, -25.00], [-20.00, -10.00], [-34.35, 18.47], [-30.00, 45.00], [-10.00, 65.00], [20.26, 86.67]], 0.40),
    generateMagneticRoute([[42.73, 133.08], [34.00, 128.00], [25.00, 122.00], [12.00, 112.00], [4.15, 100.50], [6.00, 93.00], [15.00, 88.00], [20.26, 86.67]], 0.35)
  ];

  const strat3Routes = [
    generateMagneticRoute([[42.73, 133.08], [34.00, 128.00], [22.00, 120.00], [12.00, 112.00], [4.15, 100.50], [8.00, 90.00], [17.68, 83.21], [20.26, 86.67]], 0.35),
    generateMagneticFieldArc([42.73, 133.08], [20.26, 86.67], -0.50) // Wide outer magnetic field loop
  ];

  const strat4Routes = [
    generateMagneticRoute([[-23.96, -46.33], [-28.00, -35.00], [-34.00, -10.00], [-34.35, 18.47], [-28.00, 45.00], [-10.00, 62.00], [12.00, 68.00], [22.45, 69.66]], 0.45),
    generateMagneticFieldArc([-23.96, -46.33], [22.45, 69.66], -0.60) // Direct outward magnetic field arc
  ];

  const strat5Routes = [
    generateMagneticFieldArc([13.25, 74.78], [12.91, 74.85], 0.25),
    generateMagneticFieldArc([17.68, 83.21], [20.26, 86.67], 0.25),
    generateMagneticFieldArc([19.42, 71.33], [22.45, 69.66], 0.30),
    generateMagneticFieldArc([19.42, 71.33], [22.45, 69.66], -0.30)
  ];

  const baselineHormuz = generateMagneticFieldArc([26.56, 56.25], [22.45, 69.66], 0.25);
  const baselineHormuzOuter = generateMagneticFieldArc([26.56, 56.25], [22.45, 69.66], -0.25);
  const baselineAdcop = generateMagneticFieldArc([25.18, 56.36], [12.91, 74.85], 0.25);
  const baselineEastCoast = generateMagneticFieldArc([84.20, 11.50], [20.26, 86.67], 0.25);

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
        <MapFlyToHandler targetPos={targetPos} selectedStrategyId={selectedStrategyId || null} />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrl}
        />

        {/* Dynamic Strategy Magnetic Field Style Sweeping Arcs Overlay */}
        {selectedStrategyId === 'strat_bypass' && strat1Routes.map((r, i) => (
          <Polyline key={`s1-${i}`} positions={r} color="#D97706" weight={4.5} dashArray="6, 8" />
        ))}

        {selectedStrategyId === 'strat_global_pivot' && strat2Routes.map((r, i) => (
          <Polyline key={`s2-${i}`} positions={r} color="#0284C7" weight={4.5} dashArray="6, 8" />
        ))}

        {selectedStrategyId === 'strat_far_east' && strat3Routes.map((r, i) => (
          <Polyline key={`s3-${i}`} positions={r} color="#10B981" weight={4.5} dashArray="6, 8" />
        ))}

        {selectedStrategyId === 'strat_latam' && strat4Routes.map((r, i) => (
          <Polyline key={`s4-${i}`} positions={r} color="#8B5CF6" weight={4.5} dashArray="6, 8" />
        ))}

        {selectedStrategyId === 'strat_national_surge' && strat5Routes.map((r, i) => (
          <Polyline key={`s5-${i}`} positions={r} color="#EC4899" weight={5} dashArray="4, 6" />
        ))}

        {/* Baseline Standard Corridors with Dual Magnetic Field Loops */}
        {!selectedStrategyId && (
          <>
            <Polyline positions={baselineHormuz} color="#EF4444" weight={3} dashArray="8, 12" />
            <Polyline positions={baselineHormuzOuter} color="#EF4444" weight={2} dashArray="4, 8" />
            <Polyline positions={baselineAdcop} color="#0284C7" weight={3} dashArray="6, 10" />
            <Polyline positions={baselineEastCoast} color="#10B981" weight={2.5} dashArray="4, 8" />
          </>
        )}

        {locations.map((loc) => {
          const isSelected = selectedNodeId === loc.id;
          const icon = createRadarIcon(loc.color, loc.label, isSelected, loc.isAlert);

          return (
            <Marker
              key={loc.id}
              position={loc.pos}
              icon={icon}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.closePopup();
                }
              }}
            >
              <Popup className={popupClass}>
                <div className={`font-mono text-xs p-1 max-w-[275px] space-y-1.5 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-stone-900'
                }`}>
                  {/* Header Title */}
                  <div className="flex items-center justify-between border-b pb-1 border-slate-500/30">
                    <strong className={`font-bold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-stone-900'
                    }`}>{loc.name}</strong>
                    {loc.threatScore && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        theme === 'dark'
                          ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                          : 'bg-red-100 border border-red-300 text-red-700'
                      }`}>
                        {loc.threatScore}
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-[11px] font-sans leading-tight ${
                    theme === 'dark' ? 'text-slate-300' : 'text-stone-700'
                  }`}>{loc.desc}</p>

                  {/* Route Badges with Perfect Light & Dark Theme Contrast */}
                  {loc.origin && (
                    <div className={`text-[10px] font-bold p-1.5 rounded flex items-start gap-1 ${
                      theme === 'dark'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    }`}>
                      <span className={theme === 'dark' ? 'text-emerald-400 font-extrabold' : 'text-emerald-900 font-extrabold'}>ORIGIN:</span>
                      <span className="truncate">{loc.origin}</span>
                    </div>
                  )}

                  {loc.destination && (
                    <div className={`text-[10px] font-bold p-1.5 rounded flex items-start gap-1 ${
                      theme === 'dark'
                        ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                        : 'bg-sky-100 text-sky-950 border border-sky-300'
                    }`}>
                      <span className={theme === 'dark' ? 'text-sky-400 font-extrabold' : 'text-sky-900 font-extrabold'}>DESTINATION:</span>
                      <span className="truncate">{loc.destination}</span>
                    </div>
                  )}

                  {loc.status && (
                    <div className={`text-[10px] font-bold p-1 rounded ${
                      theme === 'dark'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}>
                      STATUS: {loc.status}
                    </div>
                  )}
                  
                  {loc.capacity && (
                    <div className={`text-[10px] font-bold p-1 rounded ${
                      theme === 'dark'
                        ? 'bg-slate-800/80 text-slate-200 border border-slate-700'
                        : 'bg-stone-100 text-stone-900 border border-stone-300'
                    }`}>
                      CAPACITY: {loc.capacity}
                    </div>
                  )}
                  {loc.cargo && (
                    <div className={`text-[10px] font-bold p-1 rounded ${
                      theme === 'dark'
                        ? 'bg-slate-800/90 text-amber-300 border border-slate-700'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}>
                      CARGO: {loc.cargo}
                    </div>
                  )}
                  {loc.action && (
                    <div className={`text-[10px] font-bold p-1.5 rounded ${
                      theme === 'dark'
                        ? 'text-sky-300 bg-sky-950/80 border border-sky-500/40'
                        : 'text-blue-950 bg-blue-100 border border-blue-300'
                    }`}>
                      ACTION: {loc.action}
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
