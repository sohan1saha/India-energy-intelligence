'use client';

import React from 'react';
import { ShieldAlert, Sun, Moon, FileText, Activity } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'cream';
  toggleTheme: () => void;
  onOpenTenderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onOpenTenderModal }) => {
  return (
    <header className={`border-b p-4 px-6 transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-dark-card border-dark-border text-dark-text'
        : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-alert-amber/10 border border-alert-amber/30 text-alert-amber">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">UrjaAegis AI</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-alert-red/10 text-alert-red border border-alert-red/30">
                🇮🇳 India National Energy Command
              </span>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-dark-muted' : 'text-cream-muted'}`}>
              AI-Driven Energy Supply Chain Resilience & Procurement Rerouting Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${
            theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'
          }`}>
            <Activity className="w-4 h-4 text-alert-amber animate-pulse" />
            <span>ISPRL Buffer: <strong>9.5 Days</strong></span>
          </div>

          {/* Emergency Tender Export */}
          <button
            onClick={onOpenTenderModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-alert-amber text-white text-xs font-semibold hover:bg-amber-700 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Tender Spec</span>
          </button>

          {/* Theme Toggle Button */}
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
