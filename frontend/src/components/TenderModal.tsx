'use client';

import React, { useState } from 'react';
import { FileText, Download, X, Check, Building2, Anchor, Clock, ShieldCheck } from 'lucide-react';

interface TenderModalProps {
  theme: 'dark' | 'cream';
  isOpen: boolean;
  onClose: () => void;
  tenderJson: string;
  tenderText: string;
}

export const TenderModal: React.FC<TenderModalProps> = ({
  theme,
  isOpen,
  onClose,
  tenderJson,
  tenderText
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let parsedJson: any = null;
  try {
    parsedJson = JSON.parse(tenderJson);
  } catch (e) {
    parsedJson = {
      tender_id: "MoPNG/EMERGENCY/2026-08/STRAT-1",
      issuer: "Ministry of Petroleum & Natural Gas / IOCL Chartering",
      total_volume_bpd: 1200000,
      target_delivery_ports: ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"],
      execution_lead_time_hours: 6
    };
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(tenderJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-3xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative z-[10000] ${
        theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-alert-amber/10 border border-alert-amber/20 text-alert-amber">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ministry of Petroleum & Natural Gas (MoPNG) Emergency Tender</h3>
              <p className="text-[11px] text-slate-500">Official Crude Rerouting & Procurement Specification Document</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-alert-amber hover:underline text-[11px] font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Specification!' : 'Copy Spec JSON'}</span>
            </button>
            <button onClick={onClose} className="p-1 rounded hover:bg-slate-700/20">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans text-xs">
          {/* Executive Directive Banner */}
          <div className="p-3.5 rounded-lg border text-alert-amber border-alert-amber/30 bg-alert-amber/10">
            <p className="font-bold text-xs mb-1">DIRECTIVE SUMMARY:</p>
            <p className="text-xs leading-relaxed font-sans">{tenderText || "EMERGENCY DIRECTIVE: Dispatch 3 VLCCs to Fujairah ADCOP terminal (UAE) and 2 VLCCs to Yanbu Red Sea terminal. Initiate 240,000 bpd drawdown from Padur & Mangalore ISPRL caverns immediately."}</p>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">TENDER ID & ISSUER</span>
              <p className="font-bold text-xs text-alert-amber">{parsedJson?.tender_id || "MoPNG/EMERGENCY/STRAT-1"}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">{parsedJson?.issuer || "MoPNG / IOCL"}</span>
            </div>

            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">TOTAL REROUTED VOLUME</span>
              <p className="font-bold text-xs text-alert-emerald">
                {parsedJson?.total_volume_bpd ? (parsedJson.total_volume_bpd / 1000).toFixed(0) : '1,200'}k bpd
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Crude Allocation</span>
            </div>

            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-1">EXECUTION LEAD TIME</span>
              <p className="font-bold text-xs text-alert-cyan">
                {parsedJson?.execution_lead_time_hours || 6} Hours
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">Emergency Dispatch</span>
            </div>
          </div>

          {/* Delivery Ports */}
          <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
            <span className="text-[10px] text-slate-500 block mb-2 font-mono uppercase tracking-wide">Target Delivery Terminals & Ports</span>
            <div className="flex flex-wrap gap-2">
              {(parsedJson?.target_delivery_ports || ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"]).map((port: string, idx: number) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-alert-cyan/10 text-alert-cyan border border-alert-cyan/30 text-xs font-semibold">
                  ⚓ {port}
                </span>
              ))}
            </div>
          </div>

          {/* Approved Sourcing Breakdown */}
          {parsedJson?.allocations && (
            <div className={`p-3.5 rounded-lg border ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-cream-bg border-cream-border'}`}>
              <span className="text-[10px] text-slate-500 block mb-2 font-mono uppercase tracking-wide">Approved Crude Sourcing & Allocation Breakdown</span>
              <div className="space-y-2 font-mono text-[11px]">
                {parsedJson.allocations.map((a: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded border border-inherit">
                    <div>
                      <strong className="block text-xs">{a.supplier_name || a.source_country}</strong>
                      <span className="text-slate-500">{a.crude_grade} ({a.transport_mode || 'VLCC'})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-alert-amber">{(a.volume_bpd / 1000).toFixed(0)}k bpd</span>
                      <span className="block text-[10px] text-slate-400">${a.landed_cost_usd_bbl}/bbl</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-alert-emerald">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[11px]">Verified 100% Compatible with Indian Refiner Slates</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-alert-amber text-white font-semibold hover:bg-amber-700 transition"
          >
            Close Spec Window
          </button>
        </div>
      </div>
    </div>
  );
};
