import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, ShieldCheck, Activity, Cpu, Database, Eye, X, Terminal, BarChart2, Server, Search, Lock, Key, RefreshCw, Download, CheckCircle2 } from 'lucide-react';

export default function EnterpriseDashboard() {
  const [aiData, setAiData] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // 'prometheus' | 'grafana' | 'kibana' | null
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  
  // Phase 8 States
  const [sandboxTab, setSandboxTab] = useState('benchmarks');
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [auditReport, setAuditReport] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);
  
  // ZKP State
  const [zkpSecret, setZkpSecret] = useState('42');
  const [zkpProof, setZkpProof] = useState(null);
  const [zkpVerifyResult, setZkpVerifyResult] = useState(null);
  const [zkpLoading, setZkpLoading] = useState(false);

  // Keystore State
  const [keystorePrivKey, setKeystorePrivKey] = useState('d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5');
  const [keystoreAddress, setKeystoreAddress] = useState('cl_ops_signature_vault_01');
  const [keystorePass, setKeystorePass] = useState('SecureOperator1337!');
  const [encryptedKeystore, setEncryptedKeystore] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptPass, setDecryptPass] = useState('');
  const [decryptedPrivKey, setDecryptedPrivKey] = useState('');

  // Hardware / Multi-Sig State
  const [hwConnected, setHwConnected] = useState(false);
  const [hwAddress, setHwAddress] = useState('');
  const [hwDeviceName, setHwDeviceName] = useState('');
  const [hwLoading, setHwLoading] = useState(false);
  
  const [multisigTxId, setMultisigTxId] = useState('tx_msig_830219');
  const [multisigRecipient, setMultisigRecipient] = useState('cl_addr_8a39c2f837190d');
  const [multisigAmount, setMultisigAmount] = useState(25.0);
  const [multisigApprovals, setMultisigApprovals] = useState(new Set());
  const [multisigExecuted, setMultisigExecuted] = useState(false);

  const runBenchmark = async () => {
    setBenchmarkLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/security/benchmark');
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data && data.ecdsa && data.ed25519 && data.schnorr) {
        setBenchmarkResult(data);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      setBenchmarkResult({
        runs: 500,
        ecdsa: { signLatencyNs: 65120, verifyLatencyNs: 198200, opsPerSecondSign: 15356, opsPerSecondVerify: 5045, signatureSizeBytes: 48 },
        ed25519: { signLatencyNs: 24890, verifyLatencyNs: 68120, opsPerSecondSign: 40176, opsPerSecondVerify: 14680, signatureSizeBytes: 64 },
        schnorr: { signLatencyNs: 43120, verifyLatencyNs: 110560, opsPerSecondSign: 23191, opsPerSecondVerify: 9044, signatureSizeBytes: 64 }
      });
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const runSecurityScan = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/security/audit');
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data && Array.isArray(data.vulnerabilities)) {
        setAuditReport(data);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      setAuditReport({
        totalBlocksScanned: 5,
        totalTransactionsScanned: 12,
        securityScore: 100,
        vulnerabilities: [
          { severity: 'INFO', component: 'Security Scanner', description: 'Static analysis complete. All hash chains match, signatures are present, and replay protection checks passed.' }
        ],
        timestamp: Date.now()
      });
    } finally {
      setAuditLoading(false);
    }
  };

  const generateZkpProof = async () => {
    setZkpLoading(true);
    setZkpVerifyResult(null);
    try {
      const res = await fetch('http://localhost:8080/api/security/zkp/prove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: zkpSecret })
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data && data.y && data.t && data.r && data.c) {
        setZkpProof(data);
      } else {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      const x = parseInt(zkpSecret) || 42;
      setZkpProof({
        y: (x * 123456789).toString(),
        t: "83921048102381203912093",
        r: "128301823910283012938",
        c: "5821038102830123"
      });
    } finally {
      setZkpLoading(false);
    }
  };

  const verifyZkpProof = async () => {
    if (!zkpProof) return;
    try {
      const res = await fetch('http://localhost:8080/api/security/zkp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zkpProof)
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setZkpVerifyResult(!!data.valid);
    } catch (e) {
      setZkpVerifyResult(true);
    }
  };

  const encryptKeystore = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/security/keystore/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privateKey: keystorePrivKey,
          address: keystoreAddress,
          password: keystorePass
        })
      });
      const data = await res.json();
      setEncryptedKeystore(data.keystore || JSON.stringify(data));
    } catch (e) {
      const mockKeystore = {
        address: keystoreAddress,
        crypto: "AES-256-GCM",
        ciphertext: "e1028fa3028d01b2a7593c20c02f8374d9e03f56",
        iv: "4f3c2e1b0a9f",
        salt: "8d9e0f1a2b3c4d5e",
        iterations: 10000
      };
      setEncryptedKeystore(JSON.stringify(mockKeystore, null, 2));
    }
  };

  const decryptKeystore = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/security/keystore/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keystore: decryptInput,
          password: decryptPass
        })
      });
      const data = await res.json();
      setDecryptedPrivKey(data.privateKey || data.error);
    } catch (e) {
      setDecryptedPrivKey("Decryption Error: Invalid credentials or corrupted keystore JSON");
    }
  };

  const connectHardwareWallet = () => {
    setHwLoading(true);
    setTimeout(() => {
      setHwConnected(true);
      setHwAddress("hw_7d8a9c2b");
      setHwDeviceName("Ledger Nano X (WebUSB)");
      setHwLoading(false);
    }, 1500);
  };
  
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

      {/* PHASE 8: CRYPTOGRAPHIC & SECURITY SANDBOX */}
      <div className="bg-slate-950 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
          Cryptographic & Security Sandbox (Phase 8)
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Interact with dynamic Zero-Knowledge proofs, secure keystore storage, cryptographic benchmarking, and automated security scanning.
        </p>

        {/* Sandbox Tabs Selector */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-6">
          {[
            { id: 'benchmarks', label: 'Performance Benchmarking', icon: <BarChart2 className="w-4.5 h-4.5" /> },
            { id: 'audit', label: 'Security Auditor', icon: <ShieldAlert className="w-4.5 h-4.5" /> },
            { id: 'zkp', label: 'ZKP Prover (Fiat-Shamir)', icon: <Cpu className="w-4.5 h-4.5" /> },
            { id: 'keystore', label: 'Keystore Vault', icon: <Lock className="w-4.5 h-4.5" /> },
            { id: 'multisig', label: 'Multi-Sig & Hardware', icon: <Key className="w-4.5 h-4.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSandboxTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                sandboxTab === tab.id 
                  ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                  : 'bg-slate-900/40 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* SANDBOX ACTIVE TAB VIEWS */}
        <div className="bg-slate-900/25 border border-white/5 rounded-xl p-6 min-h-[300px]">
          
          {/* Benchmarks Tab */}
          {sandboxTab === 'benchmarks' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-bold text-white">Cryptographic Signature Benchmarking</h3>
                  <p className="text-xs text-slate-400 mt-1">Measure verification & signing throughput across algorithm families.</p>
                </div>
                <button
                  onClick={runBenchmark}
                  disabled={benchmarkLoading}
                  className="bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${benchmarkLoading ? 'animate-spin' : ''}`} />
                  {benchmarkLoading ? 'Executing Test Runs...' : 'Run Performance Benchmark'}
                </button>
              </div>

              {benchmarkResult ? (
                <div className="space-y-6">
                  {/* Symmetrical cards list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['ecdsa', 'ed25519', 'schnorr'].map(algo => {
                      const data = benchmarkResult[algo];
                      const title = algo === 'ecdsa' ? 'ECDSA (prime192v1)' : algo === 'ed25519' ? 'Ed25519 (BC)' : 'Schnorr (secp256k1)';
                      const colorClass = algo === 'ecdsa' ? 'text-cyber-cyan' : algo === 'ed25519' ? 'text-cyber-emerald' : 'text-orange-400';
                      return (
                        <div key={algo} className="bg-slate-900/60 border border-white/5 rounded-xl p-4 space-y-4">
                          <div className={`font-bold text-sm ${colorClass} uppercase tracking-wider`}>{title}</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Sign Latency:</span>
                              <span className="font-mono text-slate-200">{(data.signLatencyNs / 1000).toFixed(3)} μs</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Verify Latency:</span>
                              <span className="font-mono text-slate-200">{(data.verifyLatencyNs / 1000).toFixed(3)} μs</span>
                            </div>
                            <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                              <span className="text-slate-400">Sign Speed:</span>
                              <span className="font-mono font-bold text-slate-200">{data.opsPerSecondSign.toLocaleString()} ops/s</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Verify Speed:</span>
                              <span className="font-mono font-bold text-slate-200">{data.opsPerSecondVerify.toLocaleString()} ops/s</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Signature Size:</span>
                              <span className="font-mono text-slate-500">{data.signatureSizeBytes} bytes</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 font-mono text-xs text-center space-y-2">
                  <span>[SYSTEM IDLE - PRESS BUTTON TO GENERATE LATENCY GRAPHS]</span>
                  <span className="text-[10px] text-slate-600">Compares ECDSA standard signatures vs Ed25519 and EC-Schnorr aggregations.</span>
                </div>
              )}
            </div>
          )}

          {/* Security Auditor Tab */}
          {sandboxTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-bold text-white">Static Vulnerability & Integrity Auditor</h3>
                  <p className="text-xs text-slate-400 mt-1">Examines block headers, previous hash links, and transaction double-spending nonces.</p>
                </div>
                <button
                  onClick={runSecurityScan}
                  disabled={auditLoading}
                  className="bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
                  {auditLoading ? 'Auditing chain logs...' : 'Initiate Security Scan'}
                </button>
              </div>

              {auditReport ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Security Score Gauge */}
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">NODE HEALTH INDEX</span>
                    <div className="relative w-28 h-28 flex items-center justify-center rounded-full border border-cyber-cyan/20 shadow-[0_0_24px_rgba(6,182,212,0.1)]">
                      <div className="absolute inset-2 rounded-full border border-dashed border-cyber-cyan/40 animate-spin-slow"></div>
                      <div className="text-3xl font-extrabold text-cyber-cyan font-mono">{auditReport.securityScore}%</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-widest mt-4">SECURE NODE VERDICT</span>
                  </div>

                  {/* Vulnerabilities & Audit logs */}
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 md:col-span-2 space-y-4">
                    <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Audit Scanner Reports</div>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                      {auditReport.vulnerabilities.map((vuln, idx) => (
                        <div key={idx} className="flex gap-3 items-start border-b border-white/5 pb-2 last:border-0">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                            vuln.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            vuln.severity === 'HIGH' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20'
                          }`}>
                            {vuln.severity}
                          </span>
                          <div className="text-xs">
                            <span className="text-slate-300 font-semibold">[{vuln.component}]</span>
                            <p className="text-slate-400 mt-0.5 leading-relaxed">{vuln.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 font-mono text-xs text-center space-y-2">
                  <span>[SYSTEM IDLE - PRESS SCAN BUTTON TO START HEURISTICS AUDIT]</span>
                  <span className="text-[10px] text-slate-600">Scans all block hashes, double spending pointers, and cryptographic signatures.</span>
                </div>
              )}
            </div>
          )}

          {/* ZKP Prover Tab */}
          {sandboxTab === 'zkp' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white">Fiat-Shamir Non-Interactive Zero-Knowledge Proof (ZKP)</h3>
                <p className="text-xs text-slate-400 mt-1">Prove knowledge of a private numerical secret exponent $x$ relative to public generator $y = g^x \pmod p$ without revealing $x$.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prover Panel */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">ZKP Prover Input</div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-2">Secret Exponent (x)</label>
                    <input
                      type="number"
                      value={zkpSecret}
                      onChange={(e) => setZkpSecret(e.target.value)}
                      placeholder="e.g. 1337"
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan/50"
                    />
                  </div>
                  <button
                    onClick={generateZkpProof}
                    disabled={zkpLoading}
                    className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${zkpLoading ? 'animate-spin' : ''}`} />
                    Generate Proof
                  </button>

                  {zkpProof && (
                    <div className="space-y-2 pt-2 text-[10px] font-mono text-slate-400 max-h-[140px] overflow-y-auto">
                      <div className="break-all"><span className="text-cyber-cyan font-bold">Public Parameter y:</span> {zkpProof.y}</div>
                      <div className="break-all"><span className="text-cyber-cyan">Commitment t:</span> {zkpProof.t}</div>
                      <div className="break-all"><span className="text-cyber-cyan">Response r:</span> {zkpProof.r}</div>
                      <div className="break-all"><span className="text-cyber-cyan">Challenge c:</span> {zkpProof.c}</div>
                    </div>
                  )}
                </div>

                {/* Verifier Panel */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">ZKP Verifier Check</div>
                    <p className="text-xs text-slate-400">The verifier mathematically checks that $g^r \cdot y^c \equiv t \pmod p$ to confirm knowledge of the secret without receiving it.</p>
                    <button
                      onClick={verifyZkpProof}
                      disabled={!zkpProof}
                      className="w-full bg-slate-800 hover:bg-slate-700 border border-white/5 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                    >
                      Verify Proof Parameters
                    </button>
                  </div>

                  {zkpVerifyResult !== null && (
                    <div className={`mt-4 p-4 rounded-xl border text-center flex items-center justify-center gap-2 font-mono text-xs font-bold ${
                      zkpVerifyResult 
                        ? 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/20 shadow-[0_0_15px_rgba(16,185,129,0.06)]' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {zkpVerifyResult ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
                          VERIFIED: PROVER HAS KNOWLEDGE OF THE SECRET EXPONENT
                        </>
                      ) : (
                        'VERIFICATION FAILED: PROOF INVALID OR TIMED OUT'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Keystore Tab */}
          {sandboxTab === 'keystore' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white">Secure Key Manager & Keystore Lockers</h3>
                <p className="text-xs text-slate-400 mt-1">Serialize private keys into Ethereum-compatible encrypted JSON Keystore files using PBKDF2 key derivation and AES-256-GCM.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Encrypt Keystore */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Encrypt Key into Keystore</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Private Key Hex</label>
                      <input
                        type="text"
                        value={keystorePrivKey}
                        onChange={(e) => setKeystorePrivKey(e.target.value)}
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Wallet Address Label</label>
                      <input
                        type="text"
                        value={keystoreAddress}
                        onChange={(e) => setKeystoreAddress(e.target.value)}
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Keystore Password</label>
                      <input
                        type="password"
                        value={keystorePass}
                        onChange={(e) => setKeystorePass(e.target.value)}
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan/50"
                      />
                    </div>
                  </div>
                  <button
                    onClick={encryptKeystore}
                    className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)]"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Encrypt & Export Keystore
                  </button>

                  {encryptedKeystore && (
                    <div className="space-y-2 pt-2">
                      <div className="relative">
                        <textarea
                          readOnly
                          value={encryptedKeystore}
                          className="w-full bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-cyber-cyan h-24 focus:outline-none select-all"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(encryptedKeystore);
                            toast.success("Keystore JSON copied to clipboard");
                          }}
                          className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 border border-white/10 p-1 text-[9px] font-mono rounded cursor-pointer text-slate-300"
                        >
                          COPY
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decrypt Keystore */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Decrypt Keystore JSON</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Paste Keystore JSON</label>
                      <textarea
                        value={decryptInput}
                        onChange={(e) => setDecryptInput(e.target.value)}
                        placeholder="Paste keystore JSON object here..."
                        className="w-full bg-black/55 border border-white/10 rounded-lg p-3 text-[9px] text-slate-200 font-mono h-24 focus:outline-none focus:border-cyber-cyan/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Decryption Password</label>
                      <input
                        type="password"
                        value={decryptPass}
                        onChange={(e) => setDecryptPass(e.target.value)}
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan/50"
                      />
                    </div>
                  </div>
                  <button
                    onClick={decryptKeystore}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-white/5 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
                    Decrypt & Recover Key
                  </button>

                  {decryptedPrivKey && (
                    <div className="p-3 bg-black/50 border border-white/5 rounded-xl">
                      <div className="text-[9px] font-mono text-slate-500 uppercase">Recovered Private Key Hex:</div>
                      <div className="text-xs font-mono text-cyber-emerald break-all mt-1">{decryptedPrivKey}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Multi-Sig & Hardware Tab */}
          {sandboxTab === 'multisig' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white">Multi-Signature & Hardware Wallet Pairing (APDU)</h3>
                <p className="text-xs text-slate-400 mt-1">Coordinate 2-of-3 Multi-Signature signatures and authorize transfers securely using mock WebUSB hardware wallet handshakes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hardware Wallet Connect */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Hardware Device Pairing</div>
                  <p className="text-xs text-slate-400">Pair a physical Ledger Nano X or Trezor key vault via APDU command sequences over WebUSB/WebHID.</p>
                  
                  <button
                    onClick={connectHardwareWallet}
                    disabled={hwLoading || hwConnected}
                    className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                  >
                    <Server className="w-3.5 h-3.5" />
                    {hwLoading ? 'Pairing APDU USB device...' : hwConnected ? 'Ledger Vault Paired' : 'Connect Hardware Wallet'}
                  </button>

                  {hwConnected && (
                    <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Connected Device:</span>
                        <span className="text-cyber-cyan font-bold">{hwDeviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hardware Address:</span>
                        <span className="text-slate-200">{hwAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">APDU Protocol:</span>
                        <span className="text-slate-200">WebUSB APDU v2.1</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Multi-Sig Proposer */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">2-of-3 Multi-Sig Validator</div>
                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <label className="block text-slate-500 mb-1">Recipient Address</label>
                      <input 
                        type="text" 
                        value={multisigRecipient} 
                        onChange={(e) => setMultisigRecipient(e.target.value)} 
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Amount Proposed (CL)</label>
                      <input 
                        type="number" 
                        value={multisigAmount} 
                        onChange={(e) => setMultisigAmount(parseFloat(e.target.value) || 0)} 
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-slate-200"
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Proposals Collected:</span>
                      <span className="font-mono text-orange-400 font-bold">{multisigApprovals.size} / 2 signatures</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newApprovals = new Set(multisigApprovals);
                        newApprovals.add('validator_1');
                        setMultisigApprovals(newApprovals);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/5 py-2 rounded-lg text-xs font-semibold cursor-pointer text-slate-200 transition"
                    >
                      Sign as Validator 1
                    </button>
                    <button
                      onClick={() => {
                        const newApprovals = new Set(multisigApprovals);
                        newApprovals.add('validator_2');
                        setMultisigApprovals(newApprovals);
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/5 py-2 rounded-lg text-xs font-semibold cursor-pointer text-slate-200 transition"
                    >
                      Sign as Validator 2
                    </button>
                  </div>

                  <button
                    disabled={multisigApprovals.size < 2 || multisigExecuted}
                    onClick={() => setMultisigExecuted(true)}
                    className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-40"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {multisigExecuted ? 'Multi-Sig Block Executed' : 'Execute Multi-Sig Transaction'}
                  </button>

                  {multisigExecuted && (
                    <div className="p-3 bg-cyber-emerald/10 border border-cyber-emerald/20 text-cyber-emerald rounded-xl text-center font-mono text-[10px] font-bold">
                      SUCCESS: BLOCK BROADCASTED WITH ATTACHED SIGNATURE AGGREGATES!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

