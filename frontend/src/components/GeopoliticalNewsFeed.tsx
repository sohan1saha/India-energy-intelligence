'use client';

import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  category: 'chokepoint' | 'fleet' | 'pipeline' | 'directive';
  categoryLabel: string;
  sourceName: string;
  articleUrl: string;
  title: string;
  summary: string;
  timestamp: string;
  impactBadge: string;
  impactType: 'high' | 'medium' | 'positive';
}

interface GeopoliticalNewsFeedProps {
  theme: 'dark' | 'cream';
  onSelectLocation?: (locationId: string) => void;
}

export const GeopoliticalNewsFeed: React.FC<GeopoliticalNewsFeedProps> = ({
  theme
}) => {
  const newsItems: NewsItem[] = [
    {
      id: 'news_1',
      category: 'chokepoint',
      categoryLabel: 'CHOKEPOINT ALERT',
      sourceName: 'Reuters Energy',
      articleUrl: 'https://www.reuters.com/business/energy/',
      title: 'Strait of Hormuz Naval Patrols Intensify; GPS Spoofing Reported Off Qeshm Island',
      summary: 'Iranian Revolutionary Guard Corps (IRGC) fast patrol boats deployed near the narrowest transit corridor. US-Iran standoff has raised war risk insurance surcharges by +1.25%.',
      timestamp: '12 MINS AGO',
      impactBadge: 'Risk Index: 82.5 (High Risk)',
      impactType: 'high'
    },
    {
      id: 'news_2',
      category: 'pipeline',
      categoryLabel: 'PIPELINE & TERMINAL',
      sourceName: 'S&P Global Commodity Insights',
      articleUrl: 'https://www.spglobal.com/commodityinsights/en/market-insights/latest-news/oil',
      title: 'ADNOC Increases Fujairah ADCOP Deepwater Terminal Offloading Throughput to 540k bpd',
      summary: 'Abu Dhabi Crude Oil Pipeline (ADCOP) bypasses Strait of Hormuz to Fujairah terminal on the Gulf of Oman, ensuring uninterrupted Murban crude loading for Indian VLCCs.',
      timestamp: '28 MINS AGO',
      impactBadge: 'Bypass Throughput: 540k bpd',
      impactType: 'positive'
    },
    {
      id: 'news_3',
      category: 'fleet',
      categoryLabel: 'FLEET TELEMETRY',
      sourceName: 'Maritime Executive',
      articleUrl: 'https://www.maritime-executive.com/',
      title: 'VLCC Desh Vishal Enters Gulf of Oman Corridor Under Active AIS Surveillance',
      summary: 'Shipping Corporation of India (SCI) supertanker carrying 2.0M bbls Basrah Heavy crude maintaining 14.5 knots course toward Vadinar SPM Berth (Gujarat).',
      timestamp: '45 MINS AGO',
      impactBadge: 'ETA Vadinar: 48 Hours',
      impactType: 'medium'
    },
    {
      id: 'news_4',
      category: 'directive',
      categoryLabel: 'GOVT DIRECTIVE',
      sourceName: 'Economic Times Energy',
      articleUrl: 'https://economictimes.indiatimes.com/industry/energy/oil-gas',
      title: 'MoPNG Authorizes 240,000 bpd Emergency Drawdown from Padur Strategic Cavern',
      summary: 'Ministry of Petroleum & Natural Gas activates subsea pipeline discharge from ISPRL Padur cavern to Mangalore Refinery (MRPL) to offset Middle East import delays.',
      timestamp: '1 HOUR AGO',
      impactBadge: '+18 Days Buffer Added',
      impactType: 'positive'
    },
    {
      id: 'news_5',
      category: 'chokepoint',
      categoryLabel: 'CHOKEPOINT ALERT',
      sourceName: 'Bloomberg Energy',
      articleUrl: 'https://www.bloomberg.com/energy',
      title: 'Red Sea Transit Rerouting Forces Tankers into 16-Day Cape of Good Hope Detour',
      summary: 'Houthi anti-ship missile threats off Bab-el-Mandeb force major tankers around South Africa. Durban and Port Louis bunkering hubs report severe berth congestion.',
      timestamp: '2 HOURS AGO',
      impactBadge: 'Transit Delay: +16 Days',
      impactType: 'high'
    },
    {
      id: 'news_6',
      category: 'fleet',
      categoryLabel: 'FLEET TELEMETRY',
      sourceName: 'MarineTraffic News',
      articleUrl: 'https://www.marinetraffic.com/en/maritime-news',
      title: 'VLCC Ratna Shalini Approaching East Coast via Transatlantic Cape Route',
      summary: 'Great Eastern Shipping tanker carrying 1.9M bbls US WTI Midland crude navigating Indian Ocean corridor toward Paradip SPM Berth (Odisha).',
      timestamp: '3 HOURS AGO',
      impactBadge: 'ETA Paradip: 96 Hours',
      impactType: 'medium'
    }
  ];

  const handleOpenReport = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-inherit">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-alert-amber/10 border border-alert-amber/30 text-alert-amber">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider">Live Geopolitical & Maritime News Wire</h2>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">Click any news card or hover button to open official news reports</p>
          </div>
        </div>
      </div>

      {/* News Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {newsItems.map((news) => {
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
              onClick={() => handleOpenReport(news.articleUrl)}
              className={`p-4 rounded-lg border transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                theme === 'dark'
                  ? 'bg-dark-bg border-dark-border hover:border-slate-500 hover:shadow-lg'
                  : 'bg-cream-bg border-cream-border hover:border-slate-500 hover:shadow-lg'
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
                <h3 className={`text-xs font-bold leading-snug mb-1 font-sans group-hover:text-amber-500 transition ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {news.title}
                </h3>

                {/* Source Publication Tag */}
                <p className="text-[10px] text-slate-500 font-mono font-bold mb-2 flex items-center gap-1">
                  <span>SOURCE: {news.sourceName}</span>
                </p>

                {/* Summary */}
                <p className={`text-[11px] leading-relaxed mb-3 line-clamp-3 font-sans ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  {news.summary}
                </p>
              </div>

              {/* Hover-Only Action Button */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReport(news.articleUrl);
                  }}
                  className={`flex items-center justify-center gap-1.5 w-full py-1.5 rounded text-xs font-mono font-bold transition border ${
                    theme === 'dark'
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
                      : 'bg-slate-200 text-slate-950 border-slate-400 hover:bg-slate-300'
                  }`}
                >
                  <span>Read Full Article on {news.sourceName}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>

              {/* Card Footer: Impact Badge */}
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
                <span className="text-[10px] text-slate-500 font-mono group-hover:text-amber-500 transition flex items-center gap-1">
                  <span>Open Report ↗</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
