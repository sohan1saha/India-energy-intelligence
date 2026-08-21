'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Animated Leaflet HTML DivIcons
const createRadarIcon = (color: string, label: string, isAlert: boolean = false) => {
  const pulseHtml = isAlert
    ? `<span class="absolute -inset-1.5 rounded-full bg-red-500/40 animate-ping"></span>`
    : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${pulseHtml}
        <div style="background-color: ${color};" class="w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-125">
          <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div class="absolute left-5 bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap shadow-md hidden group-hover:block z-20">
          ${label}
        </div>
      </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

const chokepointIcon = createRadarIcon('#EF4444', 'CRITICAL THREAT ZONE', true);
const tankerIcon = createRadarIcon('#F59E0B', 'LIVE AIS SUPERTANKER', false);
const sprIcon = createRadarIcon('#10B981', 'ISPRL RESERVE CAVERN', false);
const portIcon = createRadarIcon('#0284C7', 'DEEPWATER SPM BERTH', false);

export default function LiveLeafletMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [vesselTicks, setVesselTicks] = useState<number>(0);

  // Dynamic AIS Telemetry Drift Simulation for Real-Time Vessel Tracking
  useEffect(() => {
    // Reset stale Leaflet instance IDs on React hot-reload
    const container = L.DomUtil.get('leaflet-map-root');
    if (container !== null) {
      (container as any)._leaflet_id = null;
    }
    setIsMounted(true);

    // Live AIS telemetry drift ticker every 3 seconds
    const interval = setInterval(() => {
      setVesselTicks(prev => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[520px] bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
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

  // Key GIS Locations (12 total: 2 Chokepoints, 3 Live Tankers, 3 Caverns, 4 SPM Ports)
  const locations = [
    {
      name: "Strait of Hormuz (Chokepoint)",
      pos: [26.56, 56.25],
      type: "chokepoint",
      status: "HIGH_RISK",
      threatScore: "82.5/100",
      volume: "1.89M bpd Transit",
      desc: "Elevated US-Iran standoff, naval patrols, mine/missile threats along Iranian coast.",
      action: "Initiate Fujairah ADCOP Bypass"
    },
    {
      name: "Bab-el-Mandeb & Red Sea",
      pos: [12.58, 43.33],
      type: "chokepoint",
      status: "HIGH_RISK",
      threatScore: "76.0/100",
      volume: "1.12M bpd Transit",
      desc: "Continuous Houthi drone/missile zone. Cape of Good Hope rerouting active (+16 days).",
      action: "Reroute via Yanbu Petroline"
    },
    {
      name: "Vadinar SPM Berth (Gujarat)",
      pos: [22.45, 69.66],
      type: "port",
      status: "OPERATIONAL",
      capacity: "55.0M bbls Storage",
      desc: "Deepwater Single Point Mooring serving Reliance Jamnagar & Nayara Refineries."
    },
    {
      name: "Mundra Port Crude Terminal",
      pos: [22.75, 69.70],
      type: "port",
      status: "OPERATIONAL",
      capacity: "Mundra-Panipat Pipeline Origin",
      desc: "Key import terminal feeding IOCL Panipat refinery complex (15 MMT)."
    },
    {
      name: "JNPT / Nhava Sheva (Mumbai)",
      pos: [18.95, 72.95],
      type: "port",
      status: "OPERATIONAL",
      capacity: "West Coast Freight Hub",
      desc: "BPCL Mumbai & HPCL Mumbai refinery crude intake terminal."
    },
    {
      name: "Padur ISPRL Cavern",
      pos: [13.25, 74.78],
      type: "spr",
      status: "READY (100%)",
      capacity: "2.50 MMT (18.37M bbls)",
      desc: "Strategic Petroleum Reserve underground rock cavern. Subsea pipeline to MRPL."
    },
    {
      name: "Mangalore ISPRL Cavern",
      pos: [12.91, 74.85],
      type: "spr",
      status: "READY (80%)",
      capacity: "1.50 MMT (11.02M bbls)",
      desc: "Strategic Petroleum Reserve cavern connected to Mangalore Refinery (MRPL)."
    },
    {
      name: "Visakhapatnam ISPRL Cavern",
      pos: [17.68, 83.21],
      type: "spr",
      status: "READY (90%)",
      capacity: "1.33 MMT (9.77M bbls)",
      desc: "East Coast Strategic Petroleum Reserve linked to HPCL Visakh refinery."
    },
    {
      name: "Paradip SPM Berth (Odisha)",
      pos: [20.26, 86.67],
      type: "port",
      status: "OPERATIONAL",
      capacity: "24.0M bbls Storage",
      desc: "IOCL Paradip 15 MMT refinery deepwater crude offloading SPM."
    },
    {
      name: "VLCC Desh Vishal (Live AIS)",
      pos: [deshLat, deshLng],
      type: "tanker",
      status: "14.5 Knots • Heading 124°",
      cargo: "2.0M bbls Basrah Heavy",
      desc: "MMSI 419001234 • Indian Flag (SCI) • Live GPS Telemetry Active.",
      action: "Destination: Vadinar SPM (ETA Aug 24)"
    },
    {
      name: "VLCC Swarna Kamal (Live AIS)",
      pos: [swarnaLat, swarnaLng],
      type: "tanker",
      status: "13.8 Knots • Heading 142°",
      cargo: "2.0M bbls Murban Sweet",
      desc: "MMSI 419005678 • SCI Fleet • ADCOP Bypassed Cargo in Transit.",
      action: "Destination: Mangalore SPM (ETA Aug 25)"
    },
    {
      name: "VLCC Ratna Shalini (Live AIS)",
      pos: [ratnaLat, ratnaLng],
      type: "tanker",
      status: "15.1 Knots • Heading 022°",
      cargo: "1.9M bbls WTI Midland",
      desc: "MMSI 419009876 • Great Eastern Fleet • Transatlantic Sourcing Route.",
      action: "Destination: Paradip SPM (ETA Aug 26)"
    }
  ];

  // Primary & Alternative Routes
  const hormuzCorridor: [number, number][] = [[26.56, 56.25], [deshLat, deshLng], [22.45, 69.66]];
  const adcopBypassRoute: [number, number][] = [[25.18, 56.36], [swarnaLat, swarnaLng], [12.91, 74.85]];
  const eastCoastLane: [number, number][] = [[ratnaLat, ratnaLng], [17.68, 83.21], [20.26, 86.67]];

  return (
    <div id="leaflet-map-root" className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl relative z-0">
      <MapContainer
        key="leaflet-map-instance"
        center={[19.5, 67.5]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full relative z-0"
      >
        {/* CartoDB High-Contrast Dark Basemap */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Shipping Route Lines */}
        <Polyline positions={hormuzCorridor} color="#EF4444" weight={3} dashArray="8, 12" />
        <Polyline positions={adcopBypassRoute} color="#0284C7" weight={3} dashArray="6, 10" />
        <Polyline positions={eastCoastLane} color="#10B981" weight={2.5} dashArray="4, 8" />

        {/* Map Markers */}
        {locations.map((loc, idx) => {
          const icon = loc.type === 'chokepoint' ? chokepointIcon
            : loc.type === 'spr' ? sprIcon
            : loc.type === 'tanker' ? tankerIcon
            : portIcon;

          return (
            <Marker key={idx} position={loc.pos as [number, number]} icon={icon}>
              <Popup className="custom-dark-popup">
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
                      Live Telemetry: {loc.status}
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
