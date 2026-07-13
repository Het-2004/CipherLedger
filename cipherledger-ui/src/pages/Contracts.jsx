import React, { useState, useEffect } from 'react';
import { FileText, Play, Server, Loader2, Code2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contracts() {
  const [code, setCode] = useState("function execute() {\n  return 'Hello Smart Contract!';\n}");
  const [creator, setCreator] = useState("GENESIS");
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [deploying, setDeploying] = useState(false);
  
  const [execId, setExecId] = useState("");
  const [execMethod, setExecMethod] = useState("execute");
  const [execResult, setExecResult] = useState(null);

  const handleDeploy = async (e) => {
    e.preventDefault();
    setDeploying(true);
    try {
      const res = await fetch('/api/contracts/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, creatorAddress: creator })
      });
      if (res.ok) {
        const contract = await res.json();
        toast.success(`Contract deployed: ${contract.contractId.substring(0, 8)}...`);
        setDeployedContracts(prev => [...prev, contract]);
      } else {
        toast.error("Failed to deploy contract");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setDeploying(false);
    }
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setExecuting(true);
    try {
      const res = await fetch('/api/contracts/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId: execId, method: execMethod, args: [] })
      });
      if (res.ok) {
        const text = await res.text();
        setExecResult(text);
        toast.success("Execution successful");
      } else {
        toast.error("Execution failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-32">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
          <FileText className="text-cyber-cyan w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-light text-slate-200 tracking-tight">Smart <span className="font-semibold text-cyber-cyan">Contracts</span></h1>
          <p className="text-sm font-mono text-slate-500 mt-1 uppercase tracking-widest">Write & Deploy Code to the Blockchain</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Deploy Contract Form */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code2 className="w-24 h-24 text-cyber-cyan" />
          </div>
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <Server className="w-4 h-4 text-cyber-cyan" /> Deploy New Contract
          </h2>
          <form onSubmit={handleDeploy} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">Javascript Code</label>
              <textarea 
                className="w-full h-40 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-slate-300 focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/50 transition-all outline-none resize-none"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">Creator Address</label>
              <input 
                type="text" 
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/50 transition-all outline-none"
                value={creator}
                onChange={e => setCreator(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={deploying}
              className="w-full py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Deploy to Network
            </button>
          </form>
        </div>

        {/* Execute Contract Form */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Play className="w-24 h-24 text-cyber-cyan" />
          </div>
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <Play className="w-4 h-4 text-cyber-cyan" /> Execute Contract
          </h2>
          <form onSubmit={handleExecute} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">Contract ID</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none"
                value={execId}
                onChange={e => setExecId(e.target.value)}
                placeholder="Hash..."
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">Method Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none"
                value={execMethod}
                onChange={e => setExecMethod(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={executing}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
              Run Method
            </button>
          </form>

          {execResult && (
            <div className="mt-6">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">Result</label>
              <div className="bg-slate-950 border border-white/10 rounded-xl p-4 text-cyber-cyan font-mono text-sm break-all">
                {execResult}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Deployed Contracts */}
      <div className="cyber-glass rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
          <Server className="w-4 h-4 text-cyber-cyan" /> Recently Deployed
        </h2>
        {deployedContracts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-sm">No contracts deployed this session.</div>
        ) : (
          <div className="space-y-4">
            {deployedContracts.map((contract, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono mb-1">CONTRACT ID</div>
                  <div className="text-sm text-slate-300 font-mono break-all">{contract.contractId}</div>
                </div>
                <button 
                  onClick={() => {
                    setExecId(contract.contractId);
                    toast.success("ID Copied to execution form");
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
