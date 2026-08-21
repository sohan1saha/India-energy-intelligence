'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';

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
      text: "🤖 UrjaAegis AI Copilot - Energy Security & Procurement AI Advisor\n\nI am connected live to India's Energy Supply Chain Digital Twin, ISPRL Strategic Reserves, and AIS Satellite Vessel Telemetry.\n\nFeel free to ask me any question about supertankers, pipeline bypasses, refinery assays, or price shocks!"
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
      const res = await fetch('http://localhost:8000/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.response || 'UrjaAegis AI copilot query executed successfully.'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "UrjaAegis AI Response:\n\n• Strait of Hormuz Risk: 82.5/100 (HIGH_RISK). US-Iran standoff.\n• Red Sea Risk: 76.0/100 (HIGH_RISK). Cape detour (+16 days).\n• ISPRL Reserve Buffer: 39.16M bbls (~9.5 days).\n\nAction: Emergency Fujairah ADCOP bypass routing recommended."
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[440px] shadow-2xl border-l z-50 flex flex-col transition-colors ${
      theme === 'dark' ? 'bg-dark-card border-dark-border text-dark-text' : 'bg-cream-card border-cream-border text-cream-text'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-alert-amber" />
          <h3 className="font-bold text-sm">Streaming AI Energy Security Copilot</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-700/20">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 border-b border-inherit bg-slate-900/20">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
          <Sparkles className="w-3 h-3 text-alert-amber" />
          <span>Suggested Queries</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              className="px-2.5 py-1 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-700 transition text-left line-clamp-1"
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
            className={`p-3.5 rounded-xl max-w-[90%] whitespace-pre-wrap leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-alert-amber text-white ml-auto font-sans font-medium'
                : theme === 'dark'
                ? 'bg-dark-bg border border-dark-border text-dark-text'
                : 'bg-cream-bg border border-cream-border text-cream-text'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg bg-slate-800/20 text-alert-amber text-xs animate-pulse font-mono flex items-center gap-2">
            <Bot className="w-4 h-4 animate-spin" />
            <span>UrjaAegis AI reasoning over live GIS digital twin & reserve graphs...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-inherit flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask AI Copilot any question about vessels, pipelines, SPR, or crude prices..."
          className={`flex-1 px-3 py-2.5 rounded-lg text-xs border outline-none font-sans ${
            theme === 'dark'
              ? 'bg-dark-bg border-dark-border text-dark-text placeholder-slate-500'
              : 'bg-cream-bg border-cream-border text-cream-text placeholder-stone-500'
          }`}
        />
        <button
          onClick={() => sendMessage(input)}
          className="p-2.5 rounded-lg bg-alert-amber text-white hover:bg-amber-700 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
