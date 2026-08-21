'use client';

import React from 'react';
import { Sun, Moon, Activity } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'cream';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className={`border-b p-4 px-6 transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-dark-card border-dark-border text-dark-text'
        : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold tracking-tight">UrjaAegis AI</h1>
          <p className={`text-xs ${theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'}`}>
            AI-Driven Energy Supply Chain Resilience & Procurement Rerouting Engine
          </p>
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
