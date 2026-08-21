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
        {/* Title & Pure Crisp Alphabetical Monogram (No Shapes Covering the Letters) */}
        <div className="flex items-center gap-1.5 font-mono select-none">
          <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 bg-clip-text text-transparent drop-shadow">
            UA
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-2" />
          <h1 className="text-xl font-bold tracking-tight font-sans">UrjaAegis AI</h1>
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
