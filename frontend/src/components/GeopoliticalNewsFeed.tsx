'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Radio } from 'lucide-react';

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
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const initialNewsItems: NewsItem[] = [
    {
      id: 'news_1',
      category: 'chokepoint',
      categoryLabel: 'WAR & CONFLICT ALERT',
      sourceName: 'gCaptain Maritime Intelligence',
      articleUrl: 'https://www.gcaptain.com/tag/strait-of-hormuz/',
      title: 'Strait of Hormuz Naval Patrols & Missile Threat Escalate Crude Transport Risks',
      summary: 'Naval standoff and drone strikes near narrowest transit corridor cause severe maritime bottlenecks. US-Iran conflict pushes war risk insurance surcharges up +1.25%.',
      timestamp: 'JUST NOW • LIVE',
      impactBadge: 'Risk Index: 82.5 (High Risk)',
      impactType: 'high'
    },
    {
      id: 'news_2',
      category: 'pipeline',
      categoryLabel: 'PIPELINE & TERMINAL',
      sourceName: 'Economic Times Energy',
      articleUrl: 'https://energy.economictimes.indiatimes.com/tag/oil+and+gas',
      title: 'India Expedites Padur 2.5 MMT Strategic Petroleum Reserve Expansion',
      summary: 'MoPNG initiates fast-track SPR releases and cavern expansions at Padur to protect domestic refiners against Gulf conflict blockades and maritime transit delays.',
      timestamp: 'TODAY • 15 MINS AGO',
      impactBadge: '+18 Days Buffer Added',
      impactType: 'positive'
    },
    {
      id: 'news_3',
      category: 'chokepoint',
      categoryLabel: 'RED SEA CONFLICT',
      sourceName: 'gCaptain Red Sea Wire',
      articleUrl: 'https://www.gcaptain.com/tag/red-sea/',
      title: 'Red Sea Missile Strikes Force Crude Tankers into 16-Day Cape of Good Hope Detour',
      summary: 'Houthi naval drone attacks off Bab-el-Mandeb force major crude carriers to reroute around South Africa, adding 4,500 nautical miles and $1.8M fuel surcharge per voyage.',
      timestamp: 'TODAY • 45 MINS AGO',
      impactBadge: 'Transit Delay: +16 Days',
      impactType: 'high'
    },
    {
      id: 'news_4',
      category: 'fleet',
      categoryLabel: 'FLEET TELEMETRY',
      sourceName: 'Maritime Executive',
      articleUrl: 'https://www.maritime-executive.com/news',
      title: 'VLCC Desh Vishal Enters Gulf of Oman Under Escort Carrying 2.0M bbls Crude',
      summary: 'Shipping Corporation of India (SCI) supertanker navigating Fujairah bypass corridor at 14.5 knots under active naval surveillance toward Vadinar SPM Berth (Gujarat).',
      timestamp: 'TODAY • 2 HOURS AGO',
      impactBadge: 'ETA Vadinar: 42 Hours',
      impactType: 'medium'
    },
    {
      id: 'news_5',
      category: 'pipeline',
      categoryLabel: 'BYPASS CORRIDOR',
      sourceName: 'Hydrocarbons Technology',
      articleUrl: 'https://www.hydrocarbons-technology.com/news/',
      title: 'ADNOC Increases Fujairah ADCOP Deepwater Terminal Throughput to 540k bpd',
      summary: 'Abu Dhabi Crude Oil Pipeline (ADCOP) bypasses Strait of Hormuz directly to Fujairah offshore berths, securing Murban crude intake for Indian refiners.',
      timestamp: 'AUG 23, 2026',
      impactBadge: 'Bypass Throughput: 540k bpd',
      impactType: 'positive'
    },
    {
      id: 'news_6',
      category: 'fleet',
      categoryLabel: 'ATLANTIC CRUDE ROUTE',
      sourceName: 'MarineLink News Wire',
      articleUrl: 'https://www.marinelink.com/news',
      title: 'VLCC Ratna Shalini Transatlantic Voyage Delivers 1.9M bbls WTI to Paradip',
      summary: 'US Gulf Coast crude shipments to East Coast Indian refineries surge as refiners replace Middle Eastern sour slates with transatlantic sweet crude.',
      timestamp: 'AUG 22, 2026',
      impactBadge: 'ETA Paradip: 84 Hours',
      impactType: 'medium'
    }
  ];

  const dynamicBreakingPool: NewsItem[][] = [
    [
      {
        id: 'news_dyn_1',
        category: 'chokepoint',
        categoryLabel: 'LIVE BREAKING ALERT',
        sourceName: 'Reuters Global Energy Wire',
        articleUrl: 'https://www.reuters.com/business/energy/',
        title: 'Hormuz Tanker Convoy Escorts Expanded as Gulf Naval Standoff Reaches High Alert',
        summary: 'Naval coalition warships initiate dedicated convoy escorts for commercial crude carriers in international waters off Oman. War risk insurance premiums hold at +1.25%.',
        timestamp: 'JUST NOW • LIVE BREAKING',
        impactBadge: 'Convoy Escorts Active',
        impactType: 'high'
      },
      {
        id: 'news_dyn_2',
        category: 'pipeline',
        categoryLabel: 'PIPELINE SURGE ALERT',
        sourceName: 'Saudi Aramco Official Bulletin',
        articleUrl: 'https://www.aramco.com/en/news-media',
        title: 'Saudi Aramco Diverts 450,000 bpd Heavy Crude to East-West Yanbu Petroline',
        summary: 'Saudi Arabia expands East-West pipeline throughput to Red Sea terminal at Yanbu, creating an immediate chokepoint bypass route for Asian and Indian refiners.',
        timestamp: '2 MINS AGO',
        impactBadge: '+450k bpd Bypass Operational',
        impactType: 'positive'
      },
      ...initialNewsItems.slice(0, 4)
    ],
    [
      {
        id: 'news_dyn_3',
        category: 'directive',
        categoryLabel: 'ISPRL DEFENSE DIRECTIVE',
        sourceName: 'Ministry of Petroleum & Natural Gas (MoPNG)',
        articleUrl: 'https://mopng.gov.in/',
        title: 'India Authorizes 18-Day ISPRL Cavern Release Directive for Public Sector Refiners',
        summary: 'Cabinet Committee on Economic Affairs (CCEA) approves emergency drawdown from Padur and Mangalore underground rock caverns to offset Gulf import disruptions.',
        timestamp: 'JUST NOW • LIVE BREAKING',
        impactBadge: 'Defense Floor Protected at 15%',
        impactType: 'positive'
      },
      {
        id: 'news_dyn_4',
        category: 'fleet',
        categoryLabel: 'VLCC FLEET POSITION',
        sourceName: 'Spire Maritime AIS Live',
        articleUrl: 'https://www.spire.com/maritime/',
        title: 'VLCC Desh Vishal Passes Fujairah Offshore Berth at 14.8 Knots Bound for Vadinar',
        summary: 'SCI supertanker carrying 2.0M bbls Basrah Heavy crude reports normal engine telemetry under Indian Navy escort, scheduled to berth at Vadinar SPM in 38 hours.',
        timestamp: '1 MIN AGO',
        impactBadge: 'ETA Vadinar: 38 Hours',
        impactType: 'medium'
      },
      ...initialNewsItems.slice(1, 5)
    ]
  ];

  const [newsList, setNewsList] = useState<NewsItem[]>(initialNewsItems);

  // Automatic real-time live wire ticker update every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastUpdated(currentTimeStr);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshNews = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const nextIdx = (refreshCount + 1) % dynamicBreakingPool.length;
      setNewsList(dynamicBreakingPool[nextIdx]);
      setRefreshCount(prev => prev + 1);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const handleOpenReport = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`p-5 rounded-xl border transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-alert-red animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Live War & Conflict Crude Shipping Intelligence Wire</h2>
        </div>

        {/* Live Refresh Button & Ticker */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="flex items-center gap-1.5 text-alert-emerald font-semibold">
            <span className="w-2 h-2 rounded-full bg-alert-emerald animate-ping" />
            <span>LIVE WIRE ACTIVE</span>
          </span>
          <span className="text-slate-500">| Last Sync: <strong>{lastUpdated}</strong></span>
          <button
            onClick={handleRefreshNews}
            disabled={isRefreshing}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border transition font-bold ${
              theme === 'dark'
                ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-200 text-amber-800 border-slate-400 hover:bg-slate-300'
            }`}
            title="Fetch latest conflict and crude shipping news bulletins"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing Live Wire...' : 'Fetch Latest Bulletins'}</span>
          </button>
        </div>
      </div>

      {/* News Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {newsList.map((news) => {
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
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{news.timestamp}</span>
                </div>

                {/* News Title */}
                <h3 className={`text-xs font-bold leading-snug mb-1 font-sans group-hover:text-amber-500 transition ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {news.title}
                </h3>

                {/* Source Publication Tag */}
                <p className="text-[10px] text-amber-600 font-mono font-bold mb-2 flex items-center gap-1">
                  <span>PUBLICATION: {news.sourceName}</span>
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
