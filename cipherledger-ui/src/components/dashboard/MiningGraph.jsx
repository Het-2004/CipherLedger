import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function MiningGraph() {
  const data = [
    { time: "00:00", difficulty: 4.1, blocksMined: 12 },
    { time: "04:00", difficulty: 4.2, blocksMined: 15 },
    { time: "08:00", difficulty: 4.0, blocksMined: 21 },
    { time: "12:00", difficulty: 4.5, blocksMined: 18 },
    { time: "16:00", difficulty: 4.6, blocksMined: 24 },
    { time: "20:00", difficulty: 4.8, blocksMined: 20 },
    { time: "24:00", difficulty: 4.9, blocksMined: 27 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-white/10 p-3 rounded-lg font-mono text-xs shadow-2xl">
          <p className="text-slate-400 font-bold border-b border-white/5 pb-1 mb-1.5">{label}</p>
          <p className="text-cyber-rose">Difficulty: <span className="font-bold text-slate-100">{payload[0].value}</span></p>
          <p className="text-cyber-emerald">Blocks Mined: <span className="font-bold text-slate-100">{payload[1].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cyber-glass border border-white/5 rounded-2xl p-6 w-full h-[360px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-300">MINING STATISTICS</h4>
          <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mt-0.5">Difficulty Adjustment & Blocks Found</p>
        </div>
        <div className="flex gap-4 text-[10px] font-mono font-semibold">
          <span className="flex items-center gap-1 text-cyber-rose">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-rose" /> DIFFICULTY
          </span>
          <span className="flex items-center gap-1 text-cyber-emerald">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" /> BLOCKS
          </span>
        </div>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBlocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="JetBrains Mono" />
            <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="JetBrains Mono" />
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="JetBrains Mono" />
            <Tooltip content={<CustomTooltip />} />
            <Area yAxisId="left" type="monotone" dataKey="difficulty" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorDiff)" activeDot={{ r: 4 }} />
            <Area yAxisId="right" type="monotone" dataKey="blocksMined" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocks)" activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
