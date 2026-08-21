'use client';

import React from 'react';
import { FileText, Download, X, Check } from 'lucide-react';

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
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(tenderJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative z-[10000] ${
        theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-alert-amber" />
            <div>
              <h3 className="font-bold text-sm">Executable MoPNG / IOCL Emergency Tender Spec</h3>
              <p className="text-[11px] text-slate-500">Official Procurement & Cargo Rerouting Payload</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {/* Directive Text */}
          <div className={`p-3 rounded-lg border text-alert-amber border-alert-amber/30 bg-alert-amber/10`}>
            <p className="font-bold mb-1 text-[11px]">DIRECTIVE SUMMARY:</p>
            <p className="text-[11px] font-sans">{tenderText || "EMERGENCY DIRECTIVE: Dispatch 3 VLCCs to Fujairah ADCOP terminal (UAE) and 2 VLCCs to Yanbu Red Sea terminal. Initiate 240,000 bpd drawdown from Padur & Mangalore ISPRL caverns immediately."}</p>
          </div>

          {/* JSON Payload Code Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-slate-500 text-[11px]">
              <span>TENDER JSON PAYLOAD (ERP / EDI READY)</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-alert-amber hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Payload!' : 'Copy Payload'}</span>
              </button>
            </div>
            <pre className={`p-3 rounded-lg border overflow-x-auto text-[11px] leading-relaxed ${
              theme === 'dark' ? 'bg-dark-bg border-dark-border text-slate-300' : 'bg-cream-bg border-cream-border text-stone-800'
            }`}>
              {tenderJson || `{
  "tender_id": "MoPNG/EMERGENCY/2026-08/STRAT-1",
  "issuer": "Ministry of Petroleum & Natural Gas / IOCL Chartering",
  "total_volume_bpd": 1200000,
  "target_delivery_ports": ["Vadinar (Gujarat)", "Mundra (Gujarat)", "Mangalore (Karnataka)"],
  "allocations": [
    {
      "source_country": "UAE (ADCOP Pipeline Bypass)",
      "supplier_name": "ADNOC",
      "crude_grade": "Murban Sweet",
      "volume_bpd": 540000,
      "landed_cost_usd_bbl": 84.5
    }
  ]
}`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Status: Verified for Refiner Slate Compatibility</span>
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
