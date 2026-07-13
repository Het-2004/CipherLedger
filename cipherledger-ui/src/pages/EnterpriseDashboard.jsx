import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Cpu, Database, Eye } from 'lucide-react';

export default function EnterpriseDashboard() {
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/ai/dashboard')
      .then(res => res.json())
      .then(data => setAiData(data))
      .catch(err => console.error("Error fetching AI data", err));
  }, []);

  return (
    <div className="p-8 space-y-8 animate-fade-in text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-cyber-cyan" />
            AI & Enterprise SIEM
          </h1>
          <p className="text-slate-400 mt-2">Real-time heuristics, threat detection, and Prometheus metrics.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-mono">SYSTEM STATUS</span>
            <span className="text-sm text-cyber-emerald font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse"></span>
              {aiData?.aiSystemStatus || 'LOADING...'}
            </span>
          </div>
        </div>
      </div>

      {aiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AI Network Threats */}
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyber-cyan/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
              <Activity className="w-24 h-24 text-cyber-cyan" />
            </div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyber-cyan" />
              AI Threat Detection
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Scanned IP</span>
                <span className="font-mono text-slate-200">{aiData.networkThreats.ipAddress}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Threat Score</span>
                <span className={`font-mono font-bold ${aiData.networkThreats.threatScore > 90 ? 'text-red-500' : 'text-cyber-emerald'}`}>
                  {aiData.networkThreats.threatScore.toFixed(2)} / 100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verdict</span>
                {aiData.networkThreats.isMalicious ? (
                  <span className="text-red-500 flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> Malicious</span>
                ) : (
                  <span className="text-cyber-emerald flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Clean</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Mining Optimization */}
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-cyber-cyan/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
              <Cpu className="w-24 h-24 text-cyber-emerald" />
            </div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyber-emerald" />
              AI Mining Optimization
            </h2>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Suggested Start Nonce</span>
                <span className="font-mono text-slate-200">{aiData.miningOptimization.suggestedStartingNonce}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Efficiency Gain Estimate</span>
                <span className="font-mono text-cyber-emerald font-bold">+{aiData.miningOptimization.efficiencyGainEstimate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise SIEM Links */}
      <div className="mt-12 bg-slate-900 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-400" />
          Enterprise Observability (SIEM)
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          CipherLedger exposes standard Prometheus metrics and JSON Audit Logs. 
          Run <code className="bg-black text-cyber-cyan px-2 py-1 rounded">docker-compose -f docker-compose.monitoring.yml up -d</code> to spin up the local observability stack.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="http://localhost:8080/actuator/prometheus" target="_blank" rel="noreferrer" className="flex flex-col p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition">
            <span className="font-bold text-lg text-white">Prometheus Metrics</span>
            <span className="text-xs text-slate-500 mt-1">Raw Spring Boot Actuator feed</span>
          </a>
          <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="flex flex-col p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition">
            <span className="font-bold text-lg text-orange-400">Grafana Dashboard</span>
            <span className="text-xs text-slate-500 mt-1">Port 3000 (admin/admin)</span>
          </a>
          <a href="http://localhost:5601" target="_blank" rel="noreferrer" className="flex flex-col p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition">
            <span className="font-bold text-lg text-blue-400">Kibana (ELK) Logs</span>
            <span className="text-xs text-slate-500 mt-1">Port 5601 for AI JSON Audit events</span>
          </a>
        </div>
      </div>
    </div>
  );
}
