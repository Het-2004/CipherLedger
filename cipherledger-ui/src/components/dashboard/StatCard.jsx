import { motion } from "framer-motion";

export default function StatCard({ title, value, icon, trend, color = "cyan" }) {
  // Determine color theme for boundaries
  const borderColors = {
    cyan: "border-cyber-cyan/10 hover:border-cyber-cyan/35 text-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.02)]",
    purple: "border-cyber-purple/10 hover:border-cyber-purple/35 text-cyber-purple shadow-[0_0_15px_rgba(139,92,246,0.02)]",
    emerald: "border-cyber-emerald/10 hover:border-cyber-emerald/35 text-cyber-emerald shadow-[0_0_15px_rgba(16,185,129,0.02)]",
    rose: "border-cyber-rose/10 hover:border-cyber-rose/35 text-cyber-rose shadow-[0_0_15px_rgba(244,63,94,0.02)]"
  };

  const bgGlows = {
    cyan: "bg-cyber-cyan/5",
    purple: "bg-cyber-purple/5",
    emerald: "bg-cyber-emerald/5",
    rose: "bg-cyber-rose/5"
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`cyber-glass rounded-2xl p-6 border transition-all duration-300 relative group overflow-hidden ${borderColors[color]}`}
    >
      {/* Background card accent glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -mr-8 -mt-8 ${bgGlows[color]}`} />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight text-slate-100 mt-2 font-mono">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl border border-white/5 bg-white/3 text-slate-300 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-4 text-[10px] font-mono">
          <span className={`px-2 py-0.5 rounded-full ${trend.includes("+") ? "bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/20" : "bg-cyber-rose/15 text-cyber-rose border border-cyber-rose/20"}`}>
            {trend}
          </span>
          <span className="text-slate-500">vs last hour</span>
        </div>
      )}
    </motion.div>
  );
}

