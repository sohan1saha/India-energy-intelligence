'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Activity, Clock } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'cream';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const time24 = `${hours}:${minutes}:${seconds}`;
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
      const dateStr = now.toLocaleDateString('en-GB', options).toUpperCase();
      
      setTimeString(`${time24}  |  ${dateStr}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`border-b p-4 px-6 transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-dark-card border-dark-border text-dark-text'
        : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Custom Alphabetical Monogram Emblem */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Outer Glowing Gradient Ring */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-cyan-500 p-[1.5px] shadow-lg shadow-amber-500/20">
              <div className={`w-full h-full rounded-[10.5px] flex items-center justify-center font-mono font-black text-xs tracking-tighter ${
                theme === 'dark' ? 'bg-slate-950' : 'bg-slate-900'
              }`}>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 bg-clip-text text-transparent font-black tracking-tighter text-[13px]">
                  UA
                </span>
              </div>
            </div>
            {/* Live Shield Pulse Dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse border-2 border-slate-950" />
          </div>

          <h1 className="text-xl font-bold tracking-tight">UrjaAegis AI</h1>
        </div>

        {/* Middle: Live 24-Hour Time, Day & Date */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg border font-mono text-xs font-bold transition ${
            theme === 'dark'
              ? 'bg-dark-bg border-dark-border text-amber-400'
              : 'bg-cream-bg border-cream-border text-amber-800'
          }`}>
            <Clock className="w-4 h-4 text-alert-amber animate-pulse" />
            <span>{timeString || '00:00:00  |  LOADING...'}</span>
          </div>
        </div>

        {/* Status Indicator & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-medium ${
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
          }`}>
            <Activity className="w-4 h-4 text-alert-amber animate-pulse" />
            <span>ISPRL Buffer: <strong>9.5 Days</strong></span>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition ${
              theme === 'dark'
                ? 'bg-dark-bg border-dark-border text-amber-400 hover:bg-dark-border'
                : 'bg-cream-bg border-cream-border text-slate-700 hover:bg-cream-border'
            }`}
            title="Toggle Flat Dark / Warm Cream Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
