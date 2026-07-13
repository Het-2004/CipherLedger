import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Cpu, Database, Eye, X, Terminal, BarChart2, Server, Search } from 'lucide-react';

export default function EnterpriseDashboard() {
  const [aiData, setAiData] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // 'prometheus' | 'grafana' | 'kibana' | null
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  
  // Grafana mock state
  const [grafanaStats, setGrafanaStats] = useState({
    hashrate: 450,
    mempoolSize: 8,
    activePeers: 3,
    blocksMined: 42,
    cpuUsage: 12.5,
    memoryUsage: 356 // MB
  });
  
  // Real-time updates for Grafana simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setGrafanaStats(prev => ({
        hashrate: Math.max(100, Math.min(1000, prev.hashrate + (Math.random() * 40 - 20))),
        mempoolSize: Math.max(0, Math.min(50, prev.mempoolSize + (Math.random() > 0.6 ? 1 : -1))),
        activePeers: Math.max(1, Math.min(10, prev.activePeers + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        blocksMined: prev.blocksMined + (Math.random() > 0.95 ? 1 : 0),
        cpuUsage: Math.max(2, Math.min(95, prev.cpuUsage + (Math.random() * 10 - 5))),
        memoryUsage: Math.max(250, Math.min(1024, prev.memoryUsage + (Math.random() * 20 - 10)))
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Kibana mock logs generator
  useEffect(() => {
    const initialLogs = [
      { id: 1, timestamp: new Date(Date.now() - 600000).toISOString(), level: 'INFO', module: 'P2P', msg: 'P2P Server listening on port 9000' },
      { id: 2, timestamp: new Date(Date.now() - 500000).toISOString(), level: 'INFO', module: 'SECURITY', msg: 'JWT Filter initialized' },
      { id: 3, timestamp: new Date(Date.now() - 400000).toISOString(), level: 'INFO', module: 'BLOCKCHAIN', msg: 'Genesis block verified and saved to MongoDB' },
      { id: 4, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'WARN', module: 'SECURITY', msg: 'AI Threat Alert: Suspicious network activity from IP 192.168.1.201' },
      { id: 5, timestamp: new Date(Date.now() - 200000).toISOString(), level: 'INFO', module: 'VM', msg: 'Smart Contract cx12af82e deployed successfully' },
      { id: 6, timestamp: new Date(Date.now() - 100000).toISOString(), level: 'INFO', module: 'MINING', msg: 'Block #1 mined. Nonce: 93821048' },
    ];
    setLogs(initialLogs);

    const timer = setInterval(() => {
      const levels = ['INFO', 'INFO', 'WARN', 'ERROR'];
      const modules = ['MINING', 'P2P', 'SECURITY', 'VM', 'TRANSACTION'];
      const messages = {
        MINING: ['Block proposed by validator', 'Dynamic difficulty adjusted to 4', 'Suggested optimal nonce range generated'],
        P2P: ['New peer connection established', 'Gossip block message broadcasted', 'Ping reply received from seed-node'],
        SECURITY: ['Failed authentication attempt from admin', 'AI Fraud Alert: Transaction value limit exceeded', 'Token refreshed for user session'],
        VM: ['Smart Contract state synchronized', 'CLVM execute: PUSH 10, ADD finished', 'Gas limit check succeeded'],
        TRANSACTION: ['Transaction added to mempool', 'UTXO input validated successfully', 'Transaction broadcast to peer network']
      };

      const randomModule = modules[Math.floor(Math.random() * modules.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomMsgList = messages[randomModule];
      const randomMsg = randomMsgList[Math.floor(Math.random() * randomMsgList.length)];

      setLogs(prev => [
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          level: randomLevel,
          module: randomModule,
          msg: randomMsg
        },
        ...prev.slice(0, 49) // Keep last 50 logs
      ]);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/api/ai/dashboard')
      .then(res => res.json())
      .then(data => setAiData(data))
      .catch(err => console.error("Error fetching AI data", err));
  }, []);

  const filteredLogs = logs.filter(log => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch && !log.msg.toLowerCase().includes(logSearch.toLowerCase()) && !log.module.toLowerCase().includes(logSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in text-white relative">
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
              {aiData?.aiSystemStatus || 'ONLINE'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Threat Detection */}
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
              <span className="font-mono text-slate-200">{aiData?.networkThreats?.ipAddress || '192.168.1.146'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">Threat Score</span>
              <span className={`font-mono font-bold ${(aiData?.networkThreats?.threatScore || 41.29) > 90 ? 'text-red-500' : 'text-cyber-emerald'}`}>
                {(aiData?.networkThreats?.threatScore || 41.29).toFixed(2)} / 100
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verdict</span>
              {aiData?.networkThreats?.isMalicious ? (
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
              <span className="font-mono text-slate-200">{aiData?.miningOptimization?.suggestedStartingNonce || '4643571849063359000'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Efficiency Gain Estimate</span>
              <span className="font-mono text-cyber-emerald font-bold">+{aiData?.miningOptimization?.efficiencyGainEstimate || '13.65%'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise SIEM Dashboard Links */}
      <div className="bg-slate-950 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-400" />
          Enterprise Observability (SIEM)
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          CipherLedger exposes standard Prometheus metrics and JSON Audit Logs. 
          Click on any observability stack below to run the **In-App Interactive Simulator**, or run <code className="bg-black text-cyber-cyan px-2 py-1 rounded">docker-compose -f docker-compose.monitoring.yml up -d</code> to start the actual containerized services.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('prometheus')} 
            className="flex flex-col text-left p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition hover:border-cyber-cyan/30"
          >
            <span className="font-bold text-lg text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyber-cyan" />
              Prometheus Metrics
            </span>
            <span className="text-xs text-slate-500 mt-1">Simulate raw JVM & Block Actuator feed</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('grafana')} 
            className="flex flex-col text-left p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition hover:border-cyber-cyan/30"
          >
            <span className="font-bold text-lg text-orange-400 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-orange-400" />
              Grafana Dashboard
            </span>
            <span className="text-xs text-slate-500 mt-1">Interactive network hashrate & nodes visual charts</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('kibana')} 
            className="flex flex-col text-left p-4 rounded-xl border border-white/5 bg-black/50 hover:bg-white/5 transition hover:border-cyber-cyan/30"
          >
            <span className="font-bold text-lg text-blue-400 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              Kibana (ELK) Logs
            </span>
            <span className="text-xs text-slate-500 mt-1">Real-time audit log stream & query searcher</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE OBSERVABILITY SIMULATOR MODAL */}
      {activeTab && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Database className="w-6 h-6 text-cyber-cyan animate-pulse" />
                <div>
                  <h3 className="font-bold text-lg text-white">Observability Stack Simulator</h3>
                  <p className="text-xs text-slate-400">Simulating live production analytics for CipherLedger node</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab(null)}
                className="text-slate-400 hover:text-white transition p-1 hover:bg-white/5 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex border-b border-white/5 bg-slate-900/20 px-4">
              <button 
                onClick={() => setActiveTab('prometheus')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${activeTab === 'prometheus' ? 'border-cyber-cyan text-cyber-cyan' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Prometheus Metrics
              </button>
              <button 
                onClick={() => setActiveTab('grafana')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${activeTab === 'grafana' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Grafana Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('kibana')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition ${activeTab === 'kibana' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Kibana Logs
              </button>
            </div>

            {/* Modal Main Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-sans">
              
              {/* Prometheus View */}
              {activeTab === 'prometheus' && (
                <div className="space-y-6">
                  <div className="bg-slate-900/40 p-4 border border-white/5 rounded-xl">
                    <h4 className="font-bold text-white mb-2">JVM & Micrometer Prometheus Registry Feed</h4>
                    <p className="text-xs text-slate-400">
                      Standard Spring Boot Actuator scraping endpoint. In production, Prometheus calls `/actuator/prometheus` to pull these raw values.
                    </p>
                  </div>
                  
                  <div className="bg-slate-900 border border-white/10 rounded-xl p-4 font-mono text-xs text-cyber-cyan overflow-x-auto max-h-[50vh] space-y-2">
                    <div># HELP jvm_memory_used_bytes The amount of used memory</div>
                    <div># TYPE jvm_memory_used_bytes gauge</div>
                    <div className="text-slate-200">{"jvm_memory_used_bytes{area=\"heap\",id=\"G1 Survivor Space\"} 2.4518E7"}</div>
                    <div className="text-slate-200">{"jvm_memory_used_bytes{area=\"heap\",id=\"G1 Old Gen\"} 1.4820E8"}</div>
                    <div className="text-slate-200">{"jvm_memory_used_bytes{area=\"nonheap\",id=\"Metaspace\"} 5.2409E7"}</div>
                    
                    <div className="pt-2"># HELP jvm_threads_live_threads The current number of live threads</div>
                    <div># TYPE jvm_threads_live_threads gauge</div>
                    <div className="text-slate-200">jvm_threads_live_threads {Math.floor(25 + Math.random() * 5)}</div>
                    
                    <div className="pt-2"># HELP cipherledger_mining_hashrate_hps Estimated network hashing speed</div>
                    <div># TYPE cipherledger_mining_hashrate_hps gauge</div>
                    <div className="text-slate-200">cipherledger_mining_hashrate_hps {grafanaStats.hashrate.toFixed(2)}</div>
                    
                    <div className="pt-2"># HELP cipherledger_mempool_size Total unconfirmed transactions</div>
                    <div># TYPE cipherledger_mempool_size gauge</div>
                    <div className="text-slate-200">cipherledger_mempool_size {grafanaStats.mempoolSize}</div>

                    <div className="pt-2"># HELP system_cpu_usage The "recent cpu usage" for the whole system</div>
                    <div># TYPE system_cpu_usage gauge</div>
                    <div className="text-slate-200">system_cpu_usage { (grafanaStats.cpuUsage / 100).toFixed(4) }</div>
                  </div>
                </div>
              )}

              {/* Grafana View */}
              {activeTab === 'grafana' && (
                <div className="space-y-6">
                  {/* Top Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">HASHRATE (h/s)</span>
                      <span className="text-2xl font-bold text-cyber-cyan mt-1">{grafanaStats.hashrate.toFixed(1)}</span>
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">MEMPOOL SIZE</span>
                      <span className="text-2xl font-bold text-orange-400 mt-1">{grafanaStats.mempoolSize} txs</span>
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">ACTIVE PEERS</span>
                      <span className="text-2xl font-bold text-cyber-emerald mt-1">{grafanaStats.activePeers} nodes</span>
                    </div>
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex flex-col">
                      <span className="text-xs text-slate-400 font-mono">BLOCKS MINED</span>
                      <span className="text-2xl font-bold text-white mt-1">{grafanaStats.blocksMined}</span>
                    </div>
                  </div>

                  {/* Mid Chart Simulation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-white/10 rounded-xl p-5">
                      <h4 className="text-xs font-mono text-slate-400 mb-4">JVM PERFORMANCE MONITOR</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>CPU Usage</span>
                            <span className="font-mono font-bold text-cyber-cyan">{grafanaStats.cpuUsage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-cyber-cyan h-full transition-all duration-1000" style={{ width: `${grafanaStats.cpuUsage}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>JVM Heap Allocations</span>
                            <span className="font-mono font-bold text-orange-400">{grafanaStats.memoryUsage.toFixed(0)} MB</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-orange-400 h-full transition-all duration-1000" style={{ width: `${(grafanaStats.memoryUsage / 1024) * 100}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono text-slate-400 mb-2">P2P NETWORK TOPOLOGY</h4>
                        <p className="text-xs text-slate-400">Dynamically tracking active peer node handshakes</p>
                      </div>
                      
                      <div className="flex items-center justify-around py-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 border border-cyber-cyan flex items-center justify-center text-xs font-bold text-cyber-cyan">SEED</div>
                          <span className="text-[10px] text-slate-500 mt-1">Port 9000</span>
                        </div>
                        <div className="w-12 h-[1px] border-t border-dashed border-slate-700 animate-pulse"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-cyber-emerald/20 border border-cyber-emerald flex items-center justify-center text-xs font-bold text-cyber-emerald">MINER1</div>
                          <span className="text-[10px] text-slate-500 mt-1">Port 9001</span>
                        </div>
                        <div className="w-12 h-[1px] border-t border-dashed border-slate-700 animate-pulse"></div>
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center text-xs font-bold text-orange-400">MINER2</div>
                          <span className="text-[10px] text-slate-500 mt-1">Port 9002</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kibana View */}
              {activeTab === 'kibana' && (
                <div className="space-y-4">
                  {/* Kibana Filters */}
                  <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900 border border-white/10 p-4 rounded-xl">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search logs (e.g. Alert, mined, VM...)"
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan/50 w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                      {['ALL', 'INFO', 'WARN', 'ERROR'].map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setLogFilter(lvl)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${logFilter === lvl ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logs Table */}
                  <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
                    <div className="max-h-[50vh] overflow-y-auto font-mono text-xs">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-slate-950 border-b border-white/10 text-slate-400">
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Level</th>
                            <th className="p-3">Module</th>
                            <th className="p-3">Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.length > 0 ? (
                            filteredLogs.map(log => (
                              <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition">
                                <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    log.level === 'ERROR' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    log.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-green-500/20 text-green-400 border border-green-500/30'
                                  }`}>
                                    {log.level}
                                  </span>
                                </td>
                                <td className="p-3 text-cyber-cyan font-bold">{log.module}</td>
                                <td className="p-3 text-slate-300">{log.msg}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="p-8 text-center text-slate-500">No logs found matching criteria</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 p-4 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
              <span>Simulation Rate: 1 tick / 3.0s</span>
              <span className="font-mono">STATUS: SIMULATION ACTIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

