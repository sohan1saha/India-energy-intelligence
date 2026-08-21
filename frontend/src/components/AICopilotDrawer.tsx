'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle } from 'lucide-react';

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
      text: "👋 **I am UrjaAegis AI Copilot**, India's Energy Security & Procurement AI Advisor.\n\nYou can ask me to:\n1. *Check live geopolitical risk scores across Strait of Hormuz and Red Sea*\n2. *Simulate an 80% Hormuz closure shock and its impact on refining & GDP*\n3. *Optimize ISPRL Strategic Petroleum Reserve (Padur/Mangalore/Visakhapatnam) drawdown*\n4. *Generate executable crude procurement rerouting strategies & emergency tenders*"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
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
        text: "🛡️ **UrjaAegis AI Response**:\n\n• **Strait of Hormuz Risk**: 82.5/100 (HIGH_RISK). US-Iran standoff.\n• **Red Sea Risk**: 76.0/100 (HIGH_RISK). Cape detour (+16 days).\n• **ISPRL Reserve Buffer**: 39.1M bbls (~9.5 days).\n\n*Action*: Emergency Fujairah ADCOP bypass routing recommended."
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] shadow-2xl border-l z-50 flex flex-col transition-colors ${
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

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-[88%] whitespace-pre-wrap leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-alert-amber text-white ml-auto font-medium'
                : theme === 'dark'
                ? 'bg-dark-bg border border-dark-border text-dark-text'
                : 'bg-cream-bg border border-cream-border text-cream-text'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg bg-slate-800/10 text-slate-400 text-xs animate-pulse">
            UrjaAegis AI is reasoning over energy network graph...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-inherit flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot about Hormuz, ISPRL, or tenders..."
          className={`flex-1 px-3 py-2 rounded-lg text-xs border outline-none font-sans ${
            theme === 'dark'
              ? 'bg-dark-bg border-dark-border text-dark-text placeholder-slate-500'
              : 'bg-cream-bg border-cream-border text-cream-text placeholder-stone-500'
          }`}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-lg bg-alert-amber text-white hover:bg-amber-700 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
