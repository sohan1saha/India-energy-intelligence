'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Map Pins
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const portIcon = createCustomIcon('#0284C7'); // Cyan
const chokepointIcon = createCustomIcon('#DC2626'); // Red Alert
const tankerIcon = createCustomIcon('#D97706'); // Amber
const sprIcon = createCustomIcon('#059669'); // Emerald

export default function LiveLeafletMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[480px] bg-slate-900 rounded-lg flex items-center justify-center text-xs text-slate-400 font-mono">
        Loading Full-Width Live GIS Maritime Map...
      </div>
    );
  }

  // Key GIS Locations
  const locations = [
    { name: "Strait of Hormuz (Chokepoint)", pos: [26.56, 56.25], type: "chokepoint", desc: "45% of India crude transit. Threat: 82.5/100" },
    { name: "Bab-el-Mandeb / Red Sea", pos: [12.58, 43.33], type: "chokepoint", desc: "Red Sea Attack Zone. Threat: 76.0/100" },
    { name: "Vadinar SPM (Gujarat)", pos: [22.45, 69.66], type: "port", desc: "Reliance & Nayara Refinery Import Terminal" },
    { name: "Mundra Port (Gujarat)", pos: [22.75, 69.70], type: "port", desc: "Mundra-Panipat Crude Pipeline Origin" },
    { name: "JNPT / Nhava Sheva (Mumbai)", pos: [18.95, 72.95], type: "port", desc: "Major West Coast Energy & Freight Port" },
    { name: "Padur ISPRL Cavern", pos: [13.25, 74.78], type: "spr", desc: "Strategic Petroleum Reserve: 2.50 MMT (18.37M bbls)" },
    { name: "Mangalore ISPRL Cavern", pos: [12.91, 74.85], type: "spr", desc: "Strategic Petroleum Reserve: 1.50 MMT (11.02M bbls)" },
    { name: "Visakhapatnam ISPRL Cavern", pos: [17.68, 83.21], type: "spr", desc: "Strategic Petroleum Reserve: 1.33 MMT (9.77M bbls)" },
    { name: "Paradip SPM (Odisha)", pos: [20.26, 86.67], type: "port", desc: "IOCL Refinery East Coast Deepwater SPM" },
    { name: "VLCC Desh Vishal (Tanker)", pos: [24.50, 58.20], type: "tanker", desc: "Carrying 2.0M bbls Basrah Crude (At Sea)" },
    { name: "VLCC Swarna Kamal (Tanker)", pos: [15.10, 71.40], type: "tanker", desc: "Carrying 2.0M bbls Murban Crude bound for Vadinar" }
  ];

  // Route Lines
  const hormuzToVadinar: [number, number][] = [[26.56, 56.25], [24.50, 58.20], [22.45, 69.66]];
  const fujairahToMangalore: [number, number][] = [[25.18, 56.36], [15.10, 71.40], [12.91, 74.85]];

  return (
    <div className="w-full h-[480px] rounded-lg overflow-hidden border border-slate-700/50 shadow-inner relative z-0">
      <MapContainer
        center={[18.0, 68.0]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full relative z-0"
      >
        {/* Dark Mode CartoDB Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Shipping Route Lines */}
        <Polyline positions={hormuzToVadinar} color="#EF4444" weight={2.5} dashArray="6, 12" />
        <Polyline positions={fujairahToMangalore} color="#0284C7" weight={2.5} dashArray="6, 12" />

        {/* Map Markers */}
        {locations.map((loc, idx) => {
          const icon = loc.type === 'chokepoint' ? chokepointIcon
            : loc.type === 'spr' ? sprIcon
            : loc.type === 'tanker' ? tankerIcon
            : portIcon;

          return (
            <Marker key={idx} position={loc.pos as [number, number]} icon={icon}>
              <Popup className="custom-popup">
                <div className="font-sans text-xs p-1">
                  <strong className="block text-slate-900">{loc.name}</strong>
                  <span className="text-slate-600 font-mono text-[10px]">{loc.desc}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
