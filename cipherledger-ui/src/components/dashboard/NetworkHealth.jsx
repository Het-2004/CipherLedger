import { Activity, Server, Zap, ShieldCheck } from "lucide-react";

export default function NetworkHealth() {
  const metrics = [
    { label: "Active Nodes", value: "12/12", icon: <Server className="w-4 h-4" />, status: "good" },
    { label: "Avg Latency", value: "45ms", icon: <Zap className="w-4 h-4" />, status: "good" },
    { label: "Consensus Health", value: "100%", icon: <ShieldCheck className="w-4 h-4" />, status: "good" },
    { label: "Network Load", value: "32%", icon: <Activity className="w-4 h-4" />, status: "normal" }
  ];

  return (
    <div className="cyber-glass border border-white/5 rounded-2xl p-6 w-full h-full flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-semibold text-slate-300">NETWORK HEALTH</h4>
        <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-0.5">System Stability Metrics</p>
      </div>

      <div className="space-y-4 mt-6 flex-1">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyber-cyan/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-900 border ${metric.status === 'good' ? 'border-cyber-emerald/50 text-cyber-emerald group-hover:bg-cyber-emerald/10' : 'border-cyber-cyan/50 text-cyber-cyan group-hover:bg-cyber-cyan/10'} transition-all`}>
                {metric.icon}
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">{metric.label}</span>
            </div>
            <span className="text-sm font-bold text-slate-100">{metric.value}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 p-3 border border-cyber-emerald/20 bg-cyber-emerald/5 rounded-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
        </span>
        <span className="text-[10px] font-mono font-bold text-cyber-emerald uppercase tracking-wider">All Systems Nominal</span>
      </div>
    </div>
  );
}
