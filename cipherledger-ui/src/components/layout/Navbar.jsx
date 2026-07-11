import { useState, useContext, useEffect } from "react";
import { Bell, Volume2, VolumeX, LogOut, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { mockBlockchain } from "../../utils/mockBlockchain";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("cl_sound_enabled") !== "false";
  });
  const [logs, setLogs] = useState([]);
  const [backendActive, setBackendActive] = useState(false);

  // Check if Spring Boot backend is active
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/blockchain");
        setBackendActive(res.ok);
      } catch (e) {
        setBackendActive(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync logs for notifications
  useEffect(() => {
    const updateLogs = () => {
      setLogs(mockBlockchain.getLogs().slice(-5).reverse());
    };
    updateLogs();
    const logInterval = setInterval(updateLogs, 3000);
    return () => clearInterval(logInterval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("cl_sound_enabled", String(next));
  };

  return (
    <div
      className="h-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-md flex items-center justify-between px-8 relative z-20"
    >
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg tracking-wider text-slate-100 flex items-center gap-2">
          <Cpu className="text-cyber-cyan w-5 h-5 animate-pulse" />
          CIPHER<span className="text-cyber-cyan font-bold">LEDGER</span>
          <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
        </h1>

        {/* Network Connection Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border bg-slate-900/60 transition-all duration-300">
          {backendActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
              <span className="text-cyber-emerald">LIVE BACKEND</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
              <span className="text-cyber-cyan">SANDBOX SIMULATOR</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="text-slate-400 hover:text-cyber-cyan p-2 rounded-lg bg-white/5 border border-white/5 transition-all"
          title={soundEnabled ? "Disable UI Sound Effects" : "Enable UI Sound Effects"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notifications Alert Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="text-slate-400 hover:text-cyber-cyan p-2 rounded-lg bg-white/5 border border-white/5 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {logs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyber-rose animate-ping-slow" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">System Alerts</span>
                <span className="text-[10px] text-cyber-cyan font-mono bg-cyber-cyan/10 px-2 py-0.5 rounded-full">Live Feed</span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center py-4 text-xs font-mono text-slate-500">
                    No recent events logged
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex gap-2 text-xs font-mono border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className="text-slate-300 break-words">{log.msg}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Block */}
        {user && (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-300">{user.username}</div>
              <div className="text-[10px] font-mono text-cyber-cyan font-semibold uppercase tracking-wider">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-cyber-rose p-2 rounded-lg bg-white/5 border border-white/5 hover:border-cyber-rose/20 transition-all"
              title="Log Out Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
