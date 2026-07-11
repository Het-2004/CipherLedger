import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, Search, FileText, RefreshCw, Layers } from "lucide-react";
import { mockBlockchain } from "../utils/mockBlockchain";
import { formatHash } from "../utils/formatHash";
import toast from "react-hot-toast";

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWallet, setCurrentWallet] = useState("");

  const loadTxs = () => {
    setTxs(mockBlockchain.getTransactions());
    const address = localStorage.getItem("cl_current_wallet");
    if (address) setCurrentWallet(address);
  };

  useEffect(() => {
    loadTxs();
    const interval = setInterval(loadTxs, 3000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredTxs = txs.filter(t => {
    const query = searchQuery.toLowerCase();
    const txId = (t.id || t.transactionId || "").toLowerCase();
    const txSender = (typeof t.sender === "string" ? t.sender : "").toLowerCase();
    const txReceiver = (typeof t.receiver === "string" ? t.receiver : "").toLowerCase();
    return (
      txId.includes(query) ||
      txSender.includes(query) ||
      txReceiver.includes(query) ||
      (t.amount ?? 0).toString().includes(query)
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">LEDGER TRANSACTIONS HISTORY</h2>
          <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Audit log of all registered digital asset transfers</p>
        </div>
        <button
          onClick={loadTxs}
          className="px-3.5 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 font-mono text-[10px] text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REFRESH LEDGER
        </button>
      </div>

      {/* Search Filter */}
      <div className="cyber-glass rounded-xl p-4 border border-white/5 flex items-center gap-3">
        <Search className="text-slate-500 w-5 h-5 pl-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter ledger by transaction ID, sender address, receiver address..."
          className="bg-transparent border-0 text-sm text-slate-100 focus:outline-none focus:ring-0 flex-grow font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono bg-transparent border-0 cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="cyber-glass border border-white/5 rounded-2xl p-6">
        <div className="overflow-x-auto">
          {filteredTxs.length === 0 ? (
            <div className="text-center py-12 font-mono text-xs text-slate-600 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
              <p>No transaction logs matched query "{searchQuery}"</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-white/5 pb-2">
                  <th className="pb-3 font-semibold">TRANSACTION ID</th>
                  <th className="pb-3 font-semibold">SENDER ADDRESS</th>
                  <th className="pb-3 font-semibold">RECEIVER ADDRESS</th>
                  <th className="pb-3 font-semibold">AMOUNT (CLD)</th>
                  <th className="pb-3 font-semibold">TIMESTAMP</th>
                  <th className="pb-3 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTxs.map((tx, idx) => {
                  const txId = tx.id || tx.transactionId || `tx-${idx}`;
                  const txSender = typeof tx.sender === "string" ? tx.sender : "UNKNOWN";
                  const txReceiver = typeof tx.receiver === "string" ? tx.receiver : "UNKNOWN";
                  const isHostSender = txSender === currentWallet;
                  const isHostReceiver = txReceiver === currentWallet;
                  
                  return (
                    <tr key={txId} className="text-slate-300 hover:bg-white/1 transition-all">
                      <td className="py-3.5 text-cyber-cyan font-bold flex items-center gap-1.5">
                        <span className="truncate max-w-[80px]">{txId}</span>
                        <button
                          onClick={() => copyToClipboard(txId, "Tx ID")}
                          className="text-slate-600 hover:text-cyber-cyan p-0.5 hover:bg-white/5 rounded transition-all bg-transparent border-0 cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        </button>
                      </td>
                      <td className={isHostSender ? "text-cyber-cyan font-semibold" : ""}>
                        <span className="truncate max-w-[120px] inline-block align-middle">{txSender}</span>
                      </td>
                      <td className={isHostReceiver ? "text-cyber-cyan font-semibold" : ""}>
                        <span className="truncate max-w-[120px] inline-block align-middle">{txReceiver}</span>
                      </td>
                      <td className="font-bold py-3.5">
                        <span className={txSender === "SYSTEM" || txSender === "CLD-SYSTEM" ? "text-cyber-emerald" : isHostSender ? "text-cyber-rose" : "text-cyber-emerald"}>
                          {tx.amount} CLD
                        </span>
                      </td>
                      <td className="text-slate-500 font-normal">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="text-right py-3.5">
                        {tx.status === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/25">
                            CONFIRMED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25 animate-pulse">
                            PENDING
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

