import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  ArrowRight,
  UserCheck,
  Minimize2
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function GlobalAiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am the CipherLedger AI Agent. I monitor transactions, detect anomalies, audit contracts, and scan peers. Type 'help' to review my functional keywords!" }
  ]);
  const [userInput, setUserInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setUserInput("");
    setChatLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "ai", text: data.response }]);
    } catch (e) {
      // Simulated Chat Response if backend offline
      setTimeout(() => {
        let responseText = "Standard simulated fallback message. Type 'help' for assistant tools.";
        const normalized = userText.toLowerCase();
        if (normalized.includes("help")) {
          responseText = "Welcome to the CipherLedger AI Platform Assistant! I can help you with:\n\n- **Fraud Detection**: e.g., 'check fraud for amount 500000'\n- **Smart Contract Audit**: e.g., 'audit contract code: uint x = 5;'\n- **Network Threats**: e.g., 'is IP 203.0.113.5 secure?'\n- **Anomalies**: e.g., 'detect anomalies' or 'get network status'";
        } else if (normalized.includes("fraud") || normalized.includes("check transaction") || normalized.includes("risk")) {
          responseText = "AI Transaction analysis complete (Simulated). Amount: **150,000.00 CLD**. Risk Score: **88.5%**. Status: 🚨 HIGH RISK (POTENTIAL FRAUD).";
        } else if (normalized.includes("audit") || normalized.includes("contract") || normalized.includes("vulnerability")) {
          responseText = "I can execute structural reviews of contract code. Please paste your Solidity/Rust contract payload in the Scanner tab. Typical vulnerabilities checked include **Reentrancy attacks**, **infinite loops**, and **unchecked call returns**.";
        } else if (normalized.includes("ip") || normalized.includes("threat") || normalized.includes("peer")) {
          responseText = "Query IP [185.220.101.4] analyzed. Threat classification: **SUSPICIOUS (Possible Exit Relay Node)**. Threat Score: **72%**.";
        } else if (normalized.includes("anomaly") || normalized.includes("status") || normalized.includes("health")) {
          responseText = "AI Anomaly Detection indicates the consensus layer is operating optimally. Mainnet block-times are averaging **12.4 seconds** with normal hashrate variance.";
        }
        setChatMessages(prev => [...prev, { sender: "ai", text: responseText }]);
      }, 500);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-cyber-cyan hover:bg-cyber-cyan/90 text-slate-950 p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer group"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          {/* Unread dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-bounce" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[480px] bg-slate-950/95 border border-cyber-cyan/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8),0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-xl">
          {/* Header */}
          <div className="bg-slate-900/80 border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4.5 h-4.5 text-cyber-cyan animate-pulse" />
              <span className="text-xs font-bold text-slate-200">CipherLedger AI Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Actions List (Compact chips) */}
          <div className="bg-slate-900/30 border-b border-white/5 px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
            {[
              { label: "Help Menu", query: "help" },
              { label: "Check Fraud Risk", query: "check fraud risk" },
              { label: "Consensus Status", query: "get network status" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setUserInput(chip.query)}
                className="bg-slate-900 border border-white/5 hover:border-cyber-cyan/30 rounded-full px-2.5 py-1 text-[9px] text-slate-400 hover:text-cyber-cyan transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[11px] scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-2 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 h-6.5 w-6.5 flex items-center justify-center border ${
                  msg.sender === 'user' 
                    ? 'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple' 
                    : 'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan'
                }`}>
                  {msg.sender === 'user' ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className={`p-3 rounded-xl border leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-cyber-purple/5 border-cyber-purple/20 text-slate-200' 
                    : 'bg-slate-900 border-white/5 text-slate-300'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2">
                <div className="p-1.5 rounded-lg shrink-0 h-6.5 w-6.5 flex items-center justify-center border bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-xl border bg-slate-900 border-white/5 text-slate-500 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-cyber-cyan" />
                  Analyzing ledger...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="bg-slate-950 border-t border-white/5 p-3 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyber-cyan/50"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="bg-cyber-cyan hover:bg-cyber-cyan/90 text-slate-950 px-3.5 rounded-xl flex items-center justify-center cursor-pointer transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
