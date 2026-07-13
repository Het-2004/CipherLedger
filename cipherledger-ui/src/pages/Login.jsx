import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { login, register } from "../api/authApi";
import { Terminal, Key, User, Activity } from "lucide-react";
import toast from "react-hot-toast";
import BrandMark from "../components/brand/BrandMark";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLogs, setBootLogs] = useState([]);

  // Mock terminal boot log lines
  const bootLines = [
    "Initializing CipherLedger security client v1.0.0...",
    "Establishing handshake with local relays on port 8080...",
    "Relay unavailable. Activating local cryptographic sandbox...",
    "Generating local RSA-4096 key pair...",
    "Entropy pool loaded: 100% (secure source active).",
    "Ready for operator authentication. Enter credentials."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLines.length) {
        setBootLogs(prev => [...prev, bootLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("All security credentials required.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const res = await register({ username, password });
        if (res.data.success) {
          toast.success(res.data.message || "Registration completed. Access granted.");
          setIsRegister(false);
        } else {
          toast.error("Registration failed.");
        }
      } else {
        const res = await login({ username, password });
        setUser(res.data);
        toast.success(`Access authorized. Welcome, Operator ${res.data.username}.`);
      }
    } catch (err) {
      toast.error("Authentication failed. Internal server sandbox override failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-xl shadow-2xl relative">
      {/* Glow highlight */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Branding */}
      <div className="flex flex-col items-center mb-8">
        <BrandMark title="CipherLedger" subtitle="Gateway" size="lg" showText={false} />
        <h2 className="text-xl font-bold tracking-wider text-slate-100">CIPHERLEDGER GATEWAY</h2>
        <p className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-widest mt-1">Operator Authorization</p>
      </div>

      {/* Terminal log output */}
      <div className="bg-black/40 border border-white/5 rounded-xl p-4 h-36 overflow-y-auto mb-6 font-mono text-[10px] text-slate-400 space-y-1.5 scrollbar-thin">
        <div className="flex items-center gap-1.5 text-slate-500 border-b border-white/5 pb-1 mb-1.5 font-bold uppercase">
          <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" /> Security Boot log
        </div>
        {bootLogs.map((log, idx) => (
          <div key={idx} className="flex gap-1.5 items-start">
            <span className="text-cyber-cyan font-bold select-none">&gt;</span>
            <span className="leading-tight">{log}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username / ID</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-slate-500 w-4.5 h-4.5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. cipher_ops_1"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Security Phrase / Password</label>
          <div className="relative">
            <Key className="absolute left-3 top-3.5 text-slate-500 w-4.5 h-4.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyber-cyan hover:bg-cyber-cyan/90 text-slate-950 font-bold tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Terminal className="w-4 h-4" />
              {isRegister ? "REGISTER AS OPERATOR" : "AUTHENTICATE SESSION"}
            </>
          )}
        </button>
      </form>

      {/* Switch modes */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-xs font-mono text-slate-400 hover:text-cyber-cyan underline transition-all bg-transparent border-0 cursor-pointer"
        >
          {isRegister ? "Already registered? Authenticate here" : "Initialize new terminal operator account"}
        </button>
      </div>
    </div>
  );
}

