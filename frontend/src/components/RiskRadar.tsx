'use client';

import React from 'react';

interface CorridorRisk {
  id?: string;
  name: string;
  code: string;
  risk_score?: number;
  threat_score?: number;
  status?: string;
  daily_vessel_count?: number;
  transit_delay_days?: number;
  war_risk_insurance_pct?: number;
  war_insurance_surcharge_pct?: number;
  threat_description?: string;
  status_summary?: string;
}

interface RiskRadarProps {
  theme: 'dark' | 'cream';
  corridors: CorridorRisk[];
  selectedNodeId: string | null;
  onSelectCorridor: (codeId: string) => void;
}

export const RiskRadar: React.FC<RiskRadarProps> = ({
  theme,
  corridors,
  selectedNodeId,
  onSelectCorridor
}) => {
  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-inherit">
        <h2 className="text-sm font-bold uppercase tracking-wider">Geopolitical Risk Intelligence Agent</h2>
      </div>

      {/* Corridor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {corridors.map((c, index) => {
          const codeId = c.code ? c.code.toLowerCase() : `corridor_${index}`;
          const isSelected = selectedNodeId === codeId;
          const score = c.risk_score ?? c.threat_score ?? 0;
          const insurance = c.war_risk_insurance_pct ?? c.war_insurance_surcharge_pct ?? 0;
          const delay = c.transit_delay_days ?? 0;
          const description = c.threat_description || c.status_summary || '';

          const isHigh = score >= 70;
          const isElevated = score >= 35 && score < 70;
          
          const statusBadge = isHigh
            ? 'bg-alert-red/10 text-alert-red border-alert-red/30'
            : isElevated
            ? 'bg-alert-amber/10 text-alert-amber border-alert-amber/30'
            : 'bg-alert-emerald/10 text-alert-emerald border-alert-emerald/30';

          return (
            <div
              key={c.id || codeId || index}
              onClick={() => onSelectCorridor(codeId)}
              className={`p-3.5 rounded-lg border cursor-pointer transition ${
                isSelected
                  ? 'border-alert-amber bg-alert-amber/10 shadow-lg ring-2 ring-alert-amber'
                  : theme === 'dark'
                  ? 'bg-dark-bg border-dark-border hover:border-slate-500'
                  : 'bg-cream-bg border-cream-border hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 font-semibold text-xs truncate">
                  <span>{c.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-alert-amber animate-pulse" />}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border font-mono ${statusBadge}`}>
                  {score}/100
                </span>
              </div>

              {/* Threat Description */}
              {description && (
                <p className={`text-[11px] leading-relaxed mb-3 line-clamp-2 ${
                  theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'
                }`}>
                  {description}
                </p>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-inherit font-mono">
                <div>
                  <span className="block text-slate-500">Delay</span>
                  <span className="font-bold text-alert-amber">+{delay} Days</span>
                </div>
                <div>
                  <span className="block text-slate-500">Insurance</span>
                  <span className="font-bold text-alert-red">+{insurance}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
