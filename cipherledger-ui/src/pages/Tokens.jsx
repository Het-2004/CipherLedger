import React, { useState } from 'react';
import { Activity, Plus, ArrowRight, Flame, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tokens() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [creator, setCreator] = useState("GENESIS");

  const [mintSymbol, setMintSymbol] = useState("CLD");
  const [mintTo, setMintTo] = useState("");
  const [mintAmount, setMintAmount] = useState("");

  const [transferSymbol, setTransferSymbol] = useState("CLD");
  const [transferFrom, setTransferFrom] = useState("GENESIS");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: tokenSymbol, name: tokenName, creator, initialSupply: parseFloat(initialSupply), decimals: 18 })
      });
      if (res.ok) toast.success(`Token ${tokenSymbol} created successfully!`);
      else toast.error("Failed to create token");
    } catch {
      toast.error("Network error");
    }
  };

  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tokens/${mintSymbol}/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: mintTo, amount: parseFloat(mintAmount) })
      });
      if (res.ok) toast.success(`Minted ${mintAmount} ${mintSymbol}`);
      else toast.error("Failed to mint");
    } catch {
      toast.error("Network error");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tokens/${transferSymbol}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: transferFrom, to: transferTo, amount: parseFloat(transferAmount) })
      });
      if (res.ok) toast.success(`Transferred ${transferAmount} ${transferSymbol}`);
      else toast.error("Transfer failed");
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-32">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
          <Activity className="text-cyber-cyan w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-light text-slate-200 tracking-tight">Token <span className="font-semibold text-cyber-cyan">Engine</span></h1>
          <p className="text-sm font-mono text-slate-500 mt-1 uppercase tracking-widest">ERC-20 Multi-Asset Ledger</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Token */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <Plus className="w-4 h-4 text-cyber-cyan" /> Deploy New Asset
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input type="text" placeholder="Name (e.g. Bitcoin)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={tokenName} onChange={e => setTokenName(e.target.value)} />
            <input type="text" placeholder="Symbol (e.g. BTC)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value.toUpperCase())} />
            <input type="number" placeholder="Initial Supply" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={initialSupply} onChange={e => setInitialSupply(e.target.value)} />
            <input type="text" placeholder="Creator Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={creator} onChange={e => setCreator(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 rounded-xl text-sm font-medium transition-all">Create Token</button>
          </form>
        </div>

        {/* Mint Token */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <Droplets className="w-4 h-4 text-cyber-cyan" /> Mint Tokens
          </h2>
          <form onSubmit={handleMint} className="space-y-4">
            <input type="text" placeholder="Symbol (e.g. CLD)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintSymbol} onChange={e => setMintSymbol(e.target.value.toUpperCase())} />
            <input type="text" placeholder="To Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintTo} onChange={e => setMintTo(e.target.value)} />
            <input type="number" placeholder="Amount" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintAmount} onChange={e => setMintAmount(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">Mint</button>
          </form>
        </div>

        {/* Transfer Token */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <ArrowRight className="w-4 h-4 text-cyber-cyan" /> Transfer Asset
          </h2>
          <form onSubmit={handleTransfer} className="space-y-4">
            <input type="text" placeholder="Symbol (e.g. CLD)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={transferSymbol} onChange={e => setTransferSymbol(e.target.value.toUpperCase())} />
            <input type="text" placeholder="From Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={transferFrom} onChange={e => setTransferFrom(e.target.value)} />
            <input type="text" placeholder="To Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={transferTo} onChange={e => setTransferTo(e.target.value)} />
            <input type="number" placeholder="Amount" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">Transfer</button>
          </form>
        </div>

      </div>
    </div>
  );
}
