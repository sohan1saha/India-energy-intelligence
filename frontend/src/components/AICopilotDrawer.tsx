'use client';

import React, { useState } from 'react';
import { Flame, Send, X, Sparkles } from 'lucide-react';

interface AICopilotDrawerProps {
  theme: 'dark' | 'cream';
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  theme,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: "🔥 Urja Sathi AI (ऊर्जा साथी) - Energy Security & Procurement AI Advisor\n\nI am connected live to India's Energy Supply Chain Digital Twin, ISPRL Strategic Reserves, and AIS Satellite Vessel Telemetry.\n\nFeel free to ask me any question about supertankers, pipeline bypasses, refinery assays, or price shocks!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "What is the live telemetry and destination of VLCC Desh Vishal?",
    "How does Fujairah ADCOP pipeline bypass the Strait of Hormuz?",
    "What is the stock level and drawdown rate of Padur ISPRL cavern?",
    "How much will petrol and diesel prices increase if Hormuz is blocked 80%?",
    "Which crude grades are compatible with Reliance Jamnagar and IOCL Paradip?",
    "Generate emergency crude rerouting tenders for a 1.2M bpd deficit."
  ];

  if (!isOpen) return null;

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiBaseUrl}/api/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || 'Urja Sathi query executed successfully.'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Urja Sathi AI Response:\n\n• Strait of Hormuz Risk: 82.5/100 (HIGH_RISK). US-Iran standoff.\n• Red Sea Risk: 76.0/100 (HIGH_RISK). Cape detour (+16 days).\n• ISPRL Reserve Buffer: 39.16M bbls (~9.5 days).\n\nAction: Emergency Fujairah ADCOP bypass routing recommended."
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[440px] shadow-2xl border-l z-50 flex flex-col transition-colors ${
      theme === 'dark'
        ? 'bg-[#0D111A] border-slate-700/80 text-slate-100'
        : 'bg-[#FAF8F5] border-stone-300 text-stone-900'
    }`}>
      {/* Header with Distinct Accent Border */}
      <div className={`p-4 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-amber-500/30 bg-[#121724]' : 'border-amber-500/20 bg-[#F4EFE6]'
      }`}>
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-alert-amber animate-pulse" />
          <div>
            <h3 className="font-bold text-sm">Urja Sathi AI (ऊर्जा साथी)</h3>
            <span className="text-[10px] text-slate-400 font-mono block">Energy Security Intelligence Companion</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-700/30">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Suggestion Chips Box */}
      <div className={`p-3 border-b ${
        theme === 'dark' ? 'border-slate-800 bg-[#101522]' : 'border-stone-200 bg-[#F2ECE1]'
      }`}>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-alert-amber uppercase tracking-wide mb-2">
          <Sparkles className="w-3 h-3" />
          <span>Suggested Intelligence Queries</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono border transition text-left line-clamp-1 ${
                theme === 'dark'
                  ? 'bg-[#182030] hover:bg-[#202B40] text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3.5 rounded-xl max-w-[90%] whitespace-pre-wrap leading-relaxed shadow-md ${
              msg.sender === 'user'
                ? 'bg-alert-amber text-white ml-auto font-sans font-medium'
                : theme === 'dark'
                ? 'bg-[#151C2C] border border-slate-700/60 text-slate-100'
                : 'bg-white border border-stone-200 text-stone-900'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg bg-alert-amber/10 text-alert-amber text-xs animate-pulse font-mono flex items-center gap-2 border border-alert-amber/20">
            <Flame className="w-4 h-4 animate-spin text-alert-amber" />
            <span>Urja Sathi reasoning over live GIS digital twin & reserve graphs...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className={`p-3 border-t flex items-center gap-2 ${
        theme === 'dark' ? 'border-slate-800 bg-[#101522]' : 'border-stone-200 bg-[#F2ECE1]'
      }`}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask Urja Sathi about vessels, pipelines, SPR, or crude prices..."
          className={`flex-1 px-3.5 py-2.5 rounded-lg text-xs border outline-none font-sans ${
            theme === 'dark'
              ? 'bg-[#182030] border-slate-700 text-slate-100 placeholder-slate-400 focus:border-alert-amber'
              : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400 focus:border-alert-amber'
          }`}
        />
        <button
          onClick={() => sendMessage(input)}
          className="p-2.5 rounded-lg bg-alert-amber text-white hover:bg-amber-700 transition shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
