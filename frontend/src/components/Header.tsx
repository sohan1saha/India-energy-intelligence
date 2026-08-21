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
        {/* Title & Premium Custom SVG Aegis Energy Shield Emblem */}
        <div className="flex items-center gap-3.5">
          <div className="relative group flex items-center justify-center cursor-pointer select-none">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-cyan-500 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
            
            {/* High-Definition Aegis Shield + UA Monogram Icon */}
            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center border shadow-xl transition ${
              theme === 'dark' ? 'bg-slate-950 border-amber-500/60' : 'bg-slate-900 border-amber-400'
            }`}>
              <svg className="w-6 h-6 drop-shadow" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ua-gold-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="ua-shield-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Aegis Defense Shield Contour */}
                <path
                  d="M16 3L5 7.5V15C5 22.2 9.7 28.6 16 30.5C22.3 28.6 27 22.2 27 15V7.5L16 3Z"
                  fill="url(#ua-shield-bg-grad)"
                  stroke="url(#ua-gold-cyan-grad)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />

                {/* Integrated U + A Monogram Energy Vectors */}
                <path
                  d="M10.5 11V16.5C10.5 18.8 12.2 20.5 14.2 20.5C15.2 20.5 16 20.1 16.5 19.5M21.5 11V21.5M16.5 15.5H21.5"
                  stroke="url(#ua-gold-cyan-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Strategic Energy Pulse Core */}
                <circle cx="16.5" cy="11.5" r="1.5" fill="#F59E0B" className="animate-ping" />
                <circle cx="16.5" cy="11.5" r="1.2" fill="#FBBF24" />
              </svg>
            </div>
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
