import { useState } from "react";
import { formatHash } from "../../utils/formatHash";
import { Copy, Clock, Hash, ShieldAlert, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Cpu, Award } from "lucide-react";
import toast from "react-hot-toast";

export default function BlockCard({ block, isValidating, isTampered }) {
  const [expanded, setExpanded] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className={`cyber-glass rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
      isTampered 
        ? "border-cyber-rose/30 shadow-[0_0_20px_rgba(244,63,94,0.08)] bg-cyber-rose/2" 
        : isValidating
        ? "border-cyber-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.08)] bg-cyber-cyan/1"
        : "border-white/5 hover:border-cyber-cyan/20 hover:shadow-[0_0_25px_rgba(6,182,212,0.04)]"
    }`}>
      {/* Laser scanner animation overlay for validation */}
      {isValidating && (
        <div className="absolute inset-x-0 h-[2px] bg-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,1)] animate-scan pointer-events-none" />
      )}

      {/* Block Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/1">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center font-mono font-bold text-xs text-cyber-cyan">
            #{block.index}
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-100">BLOCK NODE</h4>
            <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> {new Date(block.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTampered ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyber-rose/15 text-cyber-rose border border-cyber-rose/25">
              <ShieldAlert className="w-3.5 h-3.5" /> CORRUPT
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/25">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
            </span>
          )}
        </div>
      </div>

      {/* Block Info */}
      <div className="p-5 space-y-3 font-mono text-[11px] text-slate-400">
        <div className="flex justify-between items-center group/item pb-2 border-b border-white/2">
          <span className="text-slate-500 flex items-center gap-1"><Hash className="w-3 h-3 text-cyber-cyan" /> Hash</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-200 text-xs font-semibold">{formatHash(block.hash)}</span>
            <button
              onClick={() => copyToClipboard(block.hash, "Block Hash")}
              className="text-slate-600 hover:text-cyber-cyan p-1 hover:bg-white/5 rounded-md transition-all"
              title="Copy Full Hash"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center group/item pb-2 border-b border-white/2">
          <span className="text-slate-500 flex items-center gap-1"><ChevronDown className="w-3 h-3 text-slate-600" /> Prev Hash</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px]">{formatHash(block.previousHash)}</span>
            {block.previousHash.startsWith("0000") && (
              <button
                onClick={() => copyToClipboard(block.previousHash, "Previous Hash")}
                className="text-slate-600 hover:text-cyber-cyan p-1 hover:bg-white/5 rounded-md transition-all"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1"><Cpu className="w-3 h-3 text-cyber-purple" /> Nonce</span>
            <span className="text-slate-300 font-bold">{block.nonce}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 flex items-center gap-1"><Award className="w-3 h-3 text-cyber-rose" /> Difficulty</span>
            <span className="text-cyber-cyan font-bold">{block.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Block transactions list trigger */}
      {block.transactions && block.transactions.length > 0 && (
        <div className="border-t border-white/5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/2 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-all border-0 bg-transparent cursor-pointer"
          >
            <span>Block Transactions ({block.transactions.length})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Transactions ledger drop-down */}
          {expanded && (
            <div className="px-5 pb-4 space-y-2.5 font-mono text-[10px]">
              {block.transactions.map((tx, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-white/5 bg-slate-950/40 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-cyber-purple">TX #{idx + 1}</span>
                    <span className="text-cyber-emerald font-bold">+{tx.amount} CLD</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Sender:</span>
                    <span className="text-slate-400 text-[9px]">{formatHash(tx.sender)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Receiver:</span>
                    <span className="text-slate-400 text-[9px]">{formatHash(tx.receiver)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

