'use client';

import React from 'react';

interface CorridorRisk {
  id: string;
  name: string;
  code: string;
  risk_score: number;
  status: string;
  daily_vessel_count: number;
  transit_delay_days: number;
  war_risk_insurance_pct: number;
  threat_description: string;
}

interface RiskRadarProps {
  theme: 'dark' | 'cream';
  corridors: CorridorRisk[];
}

export const RiskRadar: React.FC<RiskRadarProps> = ({ theme, corridors }) => {
  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <h2 className="text-sm font-bold uppercase tracking-wider">Geopolitical Risk Intelligence Agent</h2>
        <span className="px-2 py-0.5 text-xs font-medium rounded bg-alert-amber/10 text-alert-amber border border-alert-amber/20 font-mono">
          Live Threat Index
        </span>
      </div>

      {/* Corridor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {corridors.map((c) => {
          const isHigh = c.risk_score >= 70;
          const isElevated = c.risk_score >= 35 && c.risk_score < 70;
          
          const statusBadge = isHigh
            ? 'bg-alert-red/10 text-alert-red border-alert-red/30'
            : isElevated
            ? 'bg-alert-amber/10 text-alert-amber border-alert-amber/30'
            : 'bg-alert-emerald/10 text-alert-emerald border-alert-emerald/30';

          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-lg border transition ${
                theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs truncate">{c.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border font-mono ${statusBadge}`}>
                  {c.risk_score}/100
                </span>
              </div>

              {/* Threat Description */}
              <p className={`text-[11px] leading-relaxed mb-3 line-clamp-2 ${
                theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'
              }`}>
                {c.threat_description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-inherit font-mono">
                <div>
                  <span className="block text-slate-500">Delay</span>
                  <span className="font-bold">+{c.transit_delay_days} Days</span>
                </div>
                <div>
                  <span className="block text-slate-500">Insurance</span>
                  <span className="font-bold">+{c.war_risk_insurance_pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
