'use client';

import React, { useState } from 'react';
import { Newspaper, ExternalLink, MapPin, Radio, ShieldAlert, Anchor, Database } from 'lucide-react';

interface NewsItem {
  id: string;
  category: 'chokepoint' | 'fleet' | 'pipeline' | 'directive';
  categoryLabel: string;
  title: string;
  summary: string;
  timestamp: string;
  locationId: string;
  locationName: string;
  impactBadge: string;
  impactType: 'high' | 'medium' | 'positive';
}

interface GeopoliticalNewsFeedProps {
  theme: 'dark' | 'cream';
  onSelectLocation?: (locationId: string) => void;
}

export const GeopoliticalNewsFeed: React.FC<GeopoliticalNewsFeedProps> = ({
  theme,
  onSelectLocation
}) => {
  const [filter, setFilter] = useState<'all' | 'chokepoint' | 'fleet' | 'pipeline'>('all');

  const newsItems: NewsItem[] = [
    {
      id: 'news_1',
      category: 'chokepoint',
      categoryLabel: 'CHOKEPOINT ALERT',
      title: 'Strait of Hormuz Naval Patrols Intensify; GPS Spoofing Reported Off Qeshm Island',
      summary: 'Iranian Revolutionary Guard Corps (IRGC) fast patrol boats deployed near the narrowest transit corridor. US-Iran standoff has raised war risk insurance surcharges by +1.25%.',
      timestamp: '12 MINS AGO',
      locationId: 'hormuz',
      locationName: 'Strait of Hormuz',
      impactBadge: 'Risk Index: 82.5 (High Risk)',
      impactType: 'high'
    },
    {
      id: 'news_2',
      category: 'pipeline',
      categoryLabel: 'PIPELINE & TERMINAL',
      title: 'ADNOC Increases Fujairah ADCOP Deepwater Terminal Offloading Throughput to 540k bpd',
      summary: 'Abu Dhabi Crude Oil Pipeline (ADCOP) bypasses Strait of Hormuz to Fujairah terminal on the Gulf of Oman, ensuring uninterrupted Murban crude loading for Indian VLCCs.',
      timestamp: '28 MINS AGO',
      locationId: 'fujairah',
      locationName: 'Fujairah ADCOP Terminal',
      impactBadge: 'Bypass Throughput: 540k bpd',
      impactType: 'positive'
    },
    {
      id: 'news_3',
      category: 'fleet',
      categoryLabel: 'FLEET TELEMETRY',
      title: 'VLCC Desh Vishal Enters Gulf of Oman Corridor Under Active AIS Surveillance',
      summary: 'Shipping Corporation of India (SCI) supertanker carrying 2.0M bbls Basrah Heavy crude maintaining 14.5 knots course toward Vadinar SPM Berth (Gujarat).',
      timestamp: '45 MINS AGO',
      locationId: 'desh_vishal',
      locationName: 'VLCC Desh Vishal',
      impactBadge: 'ETA Vadinar: 48 Hours',
      impactType: 'medium'
    },
    {
      id: 'news_4',
      category: 'directive',
      categoryLabel: 'GOVT DIRECTIVE',
      title: 'MoPNG Authorizes 240,000 bpd Emergency Drawdown from Padur Strategic Cavern',
      summary: 'Ministry of Petroleum & Natural Gas activates subsea pipeline discharge from ISPRL Padur cavern to Mangalore Refinery (MRPL) to offset Middle East import delays.',
      timestamp: '1 HOUR AGO',
      locationId: 'padur',
      locationName: 'Padur ISPRL Cavern',
      impactBadge: '+18 Days Buffer Added',
      impactType: 'positive'
    },
    {
      id: 'news_5',
      category: 'chokepoint',
      categoryLabel: 'CHOKEPOINT ALERT',
      title: 'Red Sea Transit Rerouting Forces Tankers into 16-Day Cape of Good Hope Detour',
      summary: 'Houthi anti-ship missile threats off Bab-el-Mandeb force major tankers around South Africa. Durban and Port Louis bunkering hubs report severe berth congestion.',
      timestamp: '2 HOURS AGO',
      locationId: 'cape_gh',
      locationName: 'Cape of Good Hope',
      impactBadge: 'Transit Delay: +16 Days',
      impactType: 'high'
    },
    {
      id: 'news_6',
      category: 'fleet',
      categoryLabel: 'FLEET TELEMETRY',
      title: 'VLCC Ratna Shalini Approaching East Coast via Transatlantic Cape Route',
      summary: 'Great Eastern Shipping tanker carrying 1.9M bbls US WTI Midland crude navigating Indian Ocean corridor toward Paradip SPM Berth (Odisha).',
      timestamp: '3 HOURS AGO',
      locationId: 'ratna_shalini',
      locationName: 'VLCC Ratna Shalini',
      impactBadge: 'ETA Paradip: 96 Hours',
      impactType: 'medium'
    }
  ];

  const filteredNews = filter === 'all' ? newsItems : newsItems.filter(item => item.category === filter);

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-inherit">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-alert-amber/10 border border-alert-amber/30 text-alert-amber">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Live Geopolitical & Maritime News Wire</h2>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">Real-time intelligence bulletins affecting Indian crude supply corridors & supertankers</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded border transition ${
              filter === 'all'
                ? 'bg-alert-amber text-slate-950 font-bold border-alert-amber'
                : theme === 'dark'
                ? 'bg-dark-bg border-dark-border text-slate-400 hover:text-white'
                : 'bg-cream-bg border-cream-border text-slate-700 hover:text-slate-900 font-semibold'
            }`}
          >
            All Bulletins
          </button>
          <button
            onClick={() => setFilter('chokepoint')}
            className={`px-2.5 py-1 rounded border transition ${
              filter === 'chokepoint'
                ? 'bg-alert-red text-white font-bold border-alert-red'
                : theme === 'dark'
                ? 'bg-dark-bg border-dark-border text-slate-400 hover:text-white'
                : 'bg-cream-bg border-cream-border text-slate-700 hover:text-slate-900 font-semibold'
            }`}
          >
            Chokepoints
          </button>
          <button
            onClick={() => setFilter('fleet')}
            className={`px-2.5 py-1 rounded border transition ${
              filter === 'fleet'
                ? 'bg-alert-cyan text-slate-950 font-bold border-alert-cyan'
                : theme === 'dark'
                ? 'bg-dark-bg border-dark-border text-slate-400 hover:text-white'
                : 'bg-cream-bg border-cream-border text-slate-700 hover:text-slate-900 font-semibold'
            }`}
          >
            Tanker Fleet
          </button>
          <button
            onClick={() => setFilter('pipeline')}
            className={`px-2.5 py-1 rounded border transition ${
              filter === 'pipeline'
                ? 'bg-alert-emerald text-slate-950 font-bold border-alert-emerald'
                : theme === 'dark'
                ? 'bg-dark-bg border-dark-border text-slate-400 hover:text-white'
                : 'bg-cream-bg border-cream-border text-slate-700 hover:text-slate-900 font-semibold'
            }`}
          >
            SPR & Pipelines
          </button>
        </div>
      </div>

      {/* News Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredNews.map((news) => {
          const isHigh = news.impactType === 'high';
          const isPositive = news.impactType === 'positive';

          const categoryBadgeClass = isHigh
            ? 'bg-red-500/10 text-red-500 border-red-500/30'
            : isPositive
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-500 border-amber-500/30';

          return (
            <div
              key={news.id}
              className={`p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border hover:border-slate-600'
                  : 'bg-cream-bg border-cream-border hover:border-slate-500'
              }`}
            >
              <div>
                {/* News Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold border ${categoryBadgeClass}`}>
                    {news.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{news.timestamp}</span>
                </div>

                {/* News Title */}
                <h3 className={`text-xs font-bold leading-snug mb-2 font-sans ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {news.title}
                </h3>

                {/* Summary */}
                <p className={`text-[11px] leading-relaxed mb-3 line-clamp-3 font-sans ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  {news.summary}
                </p>
              </div>

              {/* Card Footer: Impact & Map Trigger */}
              <div className="pt-2.5 border-t border-inherit flex items-center justify-between text-xs font-mono">
                <span className={`text-[10px] font-bold ${
                  isHigh
                    ? theme === 'dark' ? 'text-red-400' : 'text-red-700'
                    : isPositive
                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-800'
                    : theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                }`}>
                  {news.impactBadge}
                </span>

                {onSelectLocation && (
                  <button
                    onClick={() => onSelectLocation(news.locationId)}
                    className="flex items-center gap-1 text-[10px] font-bold text-alert-amber hover:underline transition"
                    title={`Focus map on ${news.locationName}`}
                  >
                    <MapPin className="w-3 h-3 text-alert-amber" />
                    <span>View on Map 📍</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
