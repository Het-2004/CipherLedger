import { useEffect, useState, useRef } from "react";
import { Terminal, ShieldCheck, Database, RefreshCw } from "lucide-react";
import { mockBlockchain } from "../../utils/mockBlockchain";

export default function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const bottomRef = useRef(null);

  const fetchLogs = () => {
    setLogs(mockBlockchain.getLogs());
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="cyber-glass border border-white/5 p-6 rounded-2xl w-full flex flex-col h-[300px]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Terminal className="text-cyber-cyan w-4 h-4" /> LEDGER OPERATION SYSTEM LOGS
        </h4>
        <button
          onClick={fetchLogs}
          className="p-1.5 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-slate-500 hover:text-slate-300 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-2 pr-2 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Database className="w-6 h-6 text-slate-600 animate-pulse" />
            <span>Initializing database ledger logs...</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex gap-2.5 leading-relaxed py-0.5 border-b border-white/2 hover:bg-white/1 last:border-0">
              <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
              <span className="text-slate-500 shrink-0 select-none">SYS:</span>
              <span className={`break-words ${
                log.msg.includes("Failure") || log.msg.includes("broken")
                  ? "text-cyber-rose font-semibold"
                  : log.msg.includes("SECURE") || log.msg.includes("success") || log.msg.includes("mined")
                  ? "text-cyber-emerald font-semibold"
                  : "text-slate-300"
              }`}>
                {log.msg}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

