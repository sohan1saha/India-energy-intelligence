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
        {/* Title & Combination Hindi + Greek Monogram Symbol (Solid Colors, No Gradients) */}
        <div className="flex items-center gap-2 select-none">
          <div className="flex items-center text-2xl font-bold tracking-tight">
            {/* Hindi Devanagari Character 'ऊ' (Urja / Energy) */}
            <span className={`font-serif leading-none ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
            }`}>
              ऊ
            </span>
            {/* Greek Character 'α' (Alpha / Aegis Shield) */}
            <span className={`font-mono text-xl font-bold leading-none -ml-0.5 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
            }`}>
              α
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />
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
