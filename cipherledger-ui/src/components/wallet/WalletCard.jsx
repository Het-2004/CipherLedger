import { useState, useEffect } from "react";
import { sendTransaction } from "../../api/transactionApi";
import { getBalance } from "../../api/walletApi";
import { Copy, Eye, EyeOff, Send, QrCode, ArrowDownLeft, ShieldCheck, Key, RefreshCw, Layers, Users } from "lucide-react";
import toast from "react-hot-toast";
import { formatHash } from "../../utils/formatHash";
import { mockBlockchain } from "../../utils/mockBlockchain";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export default function WalletCard({ wallet, onRefresh }) {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("Standard"); // Standard, Fast, Lightning
  const [isSending, setIsSending] = useState(false);
  const [txHistory, setTxHistory] = useState([]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const loadTxHistory = async () => {
    if (!wallet) return;
    const allTxs = mockBlockchain.getTransactions();
    // Filter transactions involving this wallet
    const filtered = allTxs.filter(t => t.sender === wallet.address || t.receiver === wallet.address);
    setTxHistory(filtered.slice(0, 5));
  };

  useEffect(() => {
    loadTxHistory();
  }, [wallet]);

  const contacts = [
    { name: "Alice (Validator)", address: "CLD_ALICE9A2BF3EF56D932C1A890F" },
    { name: "Bob (Market-Maker)", address: "CLD_BOB41FD29C8B56A9D284B318" },
    { name: "Charlie (Escrow Relay)", address: "CLD_CHARLIE932E520A8D9183C90" },
    { name: "David (Anchor Node)", address: "CLD_DAVID78A3F29C1B2E3D4E5" }
  ];

  const getBalanceChartData = () => {
    if (!wallet) return [];
    let current = wallet.balance || 0;
    const points = [];
    points.push({ name: "Current", balance: current });
    
    let balanceTracker = current;
    for (let i = 0; i < txHistory.length; i++) {
      const tx = txHistory[i];
      const isSent = tx.sender === wallet.address;
      if (isSent) {
        balanceTracker += tx.amount;
      } else {
        balanceTracker -= tx.amount;
      }
      points.unshift({
        name: new Date(tx.timestamp).toLocaleTimeString().substring(0, 5),
        balance: Math.max(0, balanceTracker)
      });
    }
    
    if (points.length === 1) {
      points.unshift({ name: "Genesis", balance: Math.max(0, current - 150) });
    }
    return points;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) {
      toast.error("All transaction fields required.");
      return;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Invalid transfer amount.");
      return;
    }
    if (val > (wallet?.balance || 0)) {
      toast.error("Insufficient cryptographic balance.");
      return;
    }

    setIsSending(true);
    toast("Generating signature and processing transaction...", { icon: "✍️" });

    // play send sound if enabled
    const soundEnabled = localStorage.getItem("cl_sound_enabled") !== "false";
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Standard beep
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch(e) {}
    }

    setTimeout(async () => {
      try {
        await sendTransaction({
          sender: wallet.address,
          receiver: recipient,
          amount: val,
          fee
        });

        toast.success(`Success! Transferred ${val} CLD to receiver.`);
        setRecipient("");
        setAmount("");
        
        // Refresh wallet balance
        onRefresh();
        loadTxHistory();
      } catch (err) {
        toast.error("Transaction failed during signature checking.");
      } finally {
        setIsSending(false);
      }
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Visual holographic debit card & Keys */}
      <div className="lg:col-span-1 space-y-6">
        {/* The Card */}
        <div className="w-full h-52 rounded-2xl p-6 relative overflow-hidden select-none border border-white/10 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
          {/* Iridescent shimmer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 via-transparent to-cyber-purple/10 pointer-events-none opacity-80" />
          
          {/* Card branding */}
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Hardware Wallet Node</span>
            <Layers className="text-cyber-cyan w-5 h-5 animate-pulse" />
          </div>

          {/* Chip mockup */}
          <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-600 via-amber-400 to-yellow-700 border border-yellow-800/20 mt-6 relative shadow-md">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-yellow-900/40" />
            <div className="absolute inset-y-0 top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-yellow-900/40" />
          </div>

          {/* Address Display */}
          <div className="mt-6">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Public Address</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono font-semibold text-slate-200 tracking-wider">
                {wallet ? `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}` : "CLD-LOADING"}
              </span>
              <button
                onClick={() => copyToClipboard(wallet?.address || "", "Wallet Address")}
                className="text-slate-600 hover:text-cyber-cyan p-1 hover:bg-white/5 rounded-md transition-all border-0 bg-transparent cursor-pointer"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Balance display */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Token Balance</span>
              <span className="text-xl font-bold font-mono text-cyber-cyan">
                {wallet?.balance || 0} <span className="text-xs text-slate-400">CLD</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Value (EST)</span>
              <span className="text-xs font-mono text-slate-400">
                ${((wallet?.balance || 0) * 2.45).toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic Keys Manager */}
        <div className="cyber-glass border border-white/5 rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider border-b border-white/5 pb-2">Cryptographic Keys</h4>
          
          <div className="space-y-3 font-mono text-[10px]">
            <div>
              <span className="text-slate-500 block mb-1">Public Key</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-slate-300 break-all pr-2 max-w-[200px] truncate">{wallet?.publicKey}</span>
                <button
                  onClick={() => copyToClipboard(wallet?.publicKey || "", "Public Key")}
                  className="text-slate-500 hover:text-cyber-cyan p-1 hover:bg-white/5 rounded-md transition-all bg-transparent border-0 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-slate-500 block mb-1">Private Key (Keep Secret)</span>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-slate-300 break-all pr-2 max-w-[200px] truncate">
                  {showPrivateKey ? wallet?.privateKey : "••••••••••••••••••••••••••••••••••••"}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-slate-500 hover:text-slate-300 p-1 hover:bg-white/5 rounded-md transition-all bg-transparent border-0 cursor-pointer"
                  >
                    {showPrivateKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(wallet?.privateKey || "", "Private Key")}
                    className="text-slate-500 hover:text-cyber-cyan p-1 hover:bg-white/5 rounded-md transition-all bg-transparent border-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Balance History Line Chart */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="block text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center">
              CLD CRYPTO ASSET BALANCE HISTORY
            </span>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getBalanceChartData()} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balancePurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis tickStyle={{ fill: '#475569', fontSize: 7, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '9px', fontFamily: 'monospace' }}
                    labelStyle={{ color: '#8b5cf6' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={1} fill="url(#balancePurple)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Send Transaction Terminal */}
      <div className="lg:col-span-1">
        <div className="cyber-glass border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Funds Transfer Terminal</h4>
            
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Users className="w-3 h-3 text-cyber-purple" /> VERIFIED ADDRESS BOOK
                </label>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {contacts.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRecipient(c.address)}
                      className={`text-[8px] font-mono py-1 px-1.5 rounded bg-slate-900/60 border hover:border-cyber-purple/40 text-left truncate transition-all cursor-pointer ${
                        recipient === c.address ? "border-cyber-purple text-cyber-purple font-semibold bg-cyber-purple/5" : "border-white/5 text-slate-400"
                      }`}
                      title={c.name}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Destination Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. CLD_9A2BF3..."
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount (CLD)</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Relay Speed / Gas Fee</label>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono font-bold">
                  {["Standard", "Fast", "Lightning"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFee(f)}
                      className={`py-2 px-1 rounded-lg border transition-all ${
                        fee === f
                          ? "bg-cyber-purple/15 text-cyber-purple border-cyber-purple/25 shadow-[0_0_10px_rgba(139,92,246,0.05)]"
                          : "bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10 cursor-pointer"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-cyber-purple text-slate-100 font-bold tracking-wider py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.15)] flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50 mt-4 border border-cyber-purple/40 hover:bg-cyber-purple/90"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    SIGN & SEND TRANSFER
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 p-3 rounded-lg border border-cyber-emerald/10 bg-cyber-emerald/2 font-mono text-[9px] text-slate-400 flex gap-2">
            <ShieldCheck className="text-cyber-emerald w-4 h-4 shrink-0 mt-0.5" />
            <span>Transfers are cryptographically signed with your private key to prove identity and prevent tampering.</span>
          </div>
        </div>
      </div>

      {/* Recents Ledger Dropdown */}
      <div className="lg:col-span-1">
        <div className="cyber-glass border border-white/5 rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Recent Transfers Ledger</h4>
            
            <div className="space-y-3">
              {txHistory.length === 0 ? (
                <div className="text-center py-12 font-mono text-xs text-slate-600">
                  No transfers detected for this node address
                </div>
              ) : (
                txHistory.map((tx, idx) => {
                  const isSent = tx.sender === wallet?.address;
                  return (
                    <div key={idx} className="flex justify-between items-center font-mono text-[10px] pb-2.5 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex gap-2">
                        <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSent
                            ? "bg-cyber-rose/10 border-cyber-rose/25 text-cyber-rose"
                            : "bg-cyber-emerald/10 border-cyber-emerald/25 text-cyber-emerald"
                        }`}>
                          <ArrowDownLeft className={`w-3.5 h-3.5 ${isSent ? "rotate-180" : ""}`} />
                        </div>
                        <div>
                          <span className="text-slate-300 font-semibold block">
                            {isSent ? `TO: ${formatHash(tx.receiver)}` : `FROM: ${formatHash(tx.sender)}`}
                          </span>
                          <span className="text-[8px] text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold block ${isSent ? "text-cyber-rose" : "text-cyber-emerald"}`}>
                          {isSent ? "-" : "+"}{tx.amount} CLD
                        </span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Receive QR code display */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-white/10 flex items-center justify-center p-1 relative group shrink-0">
              <QrCode className="text-slate-900 w-full h-full" />
              <div className="absolute inset-0 bg-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs rounded-lg cursor-pointer">
                <span className="text-[8px] font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded shadow">RECEIVE</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-300 font-bold block">Receive Payments</span>
              <p className="text-[9px] font-mono text-slate-500 mt-1 leading-tight">Scan QR code or copy address to request transfers into this hardware node.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
