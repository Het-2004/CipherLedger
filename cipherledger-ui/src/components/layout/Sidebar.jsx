import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Blocks,
  Pickaxe,
  Wallet,
  Network,
  Cpu,
  Terminal,
  Activity,
  FileText,
  Key,
  Search,
  ShieldAlert
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      url: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Blockchain Explorer",
      url: "/blocks",
      icon: <Blocks className="w-5 h-5" />,
    },
    {
      name: "Transactions History",
      url: "/transactions",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Mining Operations",
      url: "/mining",
      icon: <Pickaxe className="w-5 h-5" />,
    },
    {
      name: "Explorer",
      url: "/explorer",
      icon: <Search className="w-5 h-5" />,
    },
    {
      name: "Hardware Wallet",
      url: "/wallet",
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      name: "Network Nodes",
      url: "/nodes",
      icon: <Network className="w-5 h-5" />,
    },
    {
      name: "Crypto Playground",
      url: "/crypto-playground",
      icon: <Key className="w-5 h-5" />,
    },
    {
      name: "Smart Contracts",
      url: "/contracts",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Token Engine",
      url: "/tokens",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      name: "NFT Platform",
      url: "/nfts",
      icon: <Network className="w-5 h-5" />,
    },
    {
      name: "AI & Enterprise SIEM",
      url: "/enterprise",
      icon: <ShieldAlert className="w-5 h-5" />,
    },
  ];


  return (
    <div
      className="w-72 shrink-0 min-h-screen bg-slate-950 border-r border-white/5 p-6 flex flex-col justify-between select-none relative z-20"
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Branding Title */}
        <div className="flex items-center gap-3 mb-10 pl-2 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse-slow">
            <Terminal className="text-cyber-cyan w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-slate-200">CIPHER CONSOLE</h2>
            <p className="text-[10px] font-mono text-slate-500 font-bold tracking-widest uppercase">Decentralized UI</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {links.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.name}
                to={item.url}
                className={`
                  flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden font-medium text-sm
                  ${isActive 
                    ? "bg-cyber-cyan/5 text-cyber-cyan border border-cyber-cyan/20 shadow-[0_0_20px_rgba(6,182,212,0.03)]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"}
                `}
              >
                {/* Visual Active Glowing Strip */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-cyber-cyan rounded-r-md shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
                
                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-cyber-cyan" : "text-slate-400 group-hover:text-slate-200"}`}>
                  {item.icon}
                </span>
                
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Stats Card */}
      <div className="rounded-xl border border-white/5 bg-white/2 p-4 font-mono text-[10px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2 mb-2 font-semibold">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyber-emerald animate-pulse" /> SYSTEM LOGS
          </span>
          <span className="text-cyber-emerald">OK</span>
        </div>
        <div className="flex justify-between">
          <span>PEER CONNECTION</span>
          <span className="text-slate-300">SECURE</span>
        </div>
        <div className="flex justify-between">
          <span>CPU USAGE</span>
          <span className="text-slate-300">4.2%</span>
        </div>
        <div className="flex justify-between">
          <span>HASH RATE</span>
          <span className="text-slate-300">0.0 H/s</span>
        </div>
      </div>
    </div>
  );
}

