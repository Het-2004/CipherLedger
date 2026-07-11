import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function NetworkChart() {
  const data = [
    { name: "09:00", transactions: 120, hashrate: 32 },
    { name: "09:10", transactions: 150, hashrate: 35 },
    { name: "09:20", transactions: 240, hashrate: 34 },
    { name: "09:30", transactions: 180, hashrate: 38 },
    { name: "09:40", transactions: 310, hashrate: 41 },
    { name: "09:50", transactions: 290, hashrate: 40 },
    { name: "10:00", transactions: 420, hashrate: 45 },
    { name: "10:10", transactions: 380, hashrate: 44 },
    { name: "10:20", transactions: 510, hashrate: 48 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-white/10 p-3 rounded-lg font-mono text-xs shadow-2xl">
          <p className="text-slate-400 font-bold border-b border-white/5 pb-1 mb-1.5">{label}</p>
          <p className="text-cyber-cyan">TX Pool: <span className="font-bold text-slate-100">{payload[0].value} txs</span></p>
          <p className="text-cyber-purple">Hashrate: <span className="font-bold text-slate-100">{payload[1].value} GH/s</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cyber-glass border border-white/5 rounded-2xl p-6 w-full h-[360px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-300">NETWORK DYNAMICS</h4>
          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-0.5">Real-time Transaction Pool & Hashrate</p>
        </div>
        <div className="flex gap-4 text-[10px] font-mono font-semibold">
          <span className="flex items-center gap-1 text-cyber-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" /> TRANSACTIONS
          </span>
          <span className="flex items-center gap-1 text-cyber-purple">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple" /> HASHRATE
          </span>
        </div>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="JetBrains Mono" />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="JetBrains Mono" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="transactions" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTx)" activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="hashrate" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorHash)" activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

