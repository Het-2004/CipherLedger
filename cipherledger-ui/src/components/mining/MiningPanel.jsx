import { useState, useEffect, useRef } from "react";
import { getBlocks } from "../../api/blockchainApi";
import { mineBlock } from "../../api/miningApi";
import { Zap, Play, Square, Award, Compass, Cpu, CheckCircle } from "lucide-react";
import { simpleHash, mockBlockchain } from "../../utils/mockBlockchain";
import toast from "react-hot-toast";

export default function MiningPanel() {
  const [isMining, setIsMining] = useState(false);
  const [difficulty, setDifficulty] = useState(4);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [hashRate, setHashRate] = useState(0);
  const [minedBlocks, setMinedBlocks] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  
  const terminalEndRef = useRef(null);
  const miningIntervalRef = useRef(null);
  const speedRef = useRef(100); // ms per tick

  const addTerminalLog = (msg) => {
    setTerminalLogs(prev => {
      const updated = [...prev, msg];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Clean up mining loop on unmount
  useEffect(() => {
    return () => {
      if (miningIntervalRef.current) clearInterval(miningIntervalRef.current);
    };
  }, []);

  const handleStartMining = async () => {
    if (isMining) {
      // Stop mining
      setIsMining(false);
      if (miningIntervalRef.current) {
        clearInterval(miningIntervalRef.current);
        miningIntervalRef.current = null;
      }
      addTerminalLog("Mining operation suspended by operator.");
      mockBlockchain.addLog("Mining suspended.");
      setHashRate(0);
      return;
    }

    setIsMining(true);
    addTerminalLog(`Starting CPU Mining Core. Target difficulty: ${difficulty} (${"0".repeat(difficulty)}...)`);
    mockBlockchain.addLog(`Mining started at difficulty ${difficulty}.`);
    
    // Fetch latest block to get previous hash
    const blockRes = await getBlocks();
    const blocksList = blockRes.data;
    const prevBlock = blocksList.slice(-1)[0];
    const prevHash = prevBlock ? prevBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const nextIndex = blocksList.length;

    let currentNonce = 0;
    const targetPrefix = "0".repeat(difficulty);
    const startTime = Date.now();

    // Hashing loop (non-blocking batches)
    miningIntervalRef.current = setInterval(async () => {
      const batchSize = 150;
      let matched = false;
      let matchedHash = "";
      
      const elapsed = (Date.now() - startTime) / 1000;
      const computedHashRate = Math.floor(currentNonce / elapsed);
      setHashRate(computedHashRate || 1200);

      // Perform a batch of hashes in one tick
      for (let i = 0; i < batchSize; i++) {
        const payload = nextIndex + prevHash + currentNonce + difficulty;
        const currentHash = simpleHash(payload);
        
        if (currentHash.startsWith(targetPrefix)) {
          matched = true;
          matchedHash = currentHash;
          break;
        }
        currentNonce++;
      }

      setNonce(currentNonce);
      
      if (matched) {
        // Stop the loop
        setIsMining(false);
        clearInterval(miningIntervalRef.current);
        miningIntervalRef.current = null;
        setHash(matchedHash);
        setHashRate(0);

        addTerminalLog(`BLOCK SOLVED! Nonce: ${currentNonce} | Hash: ${matchedHash}`);
        
        // play sound if enabled
        const soundEnabled = localStorage.getItem("cl_sound_enabled") !== "false";
        if (soundEnabled) {
          try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(660, audioCtx.currentTime); // high ping
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch(e) {}
        }

        toast.success(`Success! Block #${nextIndex} discovered in ${((Date.now() - startTime)/1000).toFixed(2)}s`);
        
        // POST to backend API (or fallback)
        try {
          const minedRes = await mineBlock({
            index: nextIndex,
            previousHash: prevHash,
            hash: matchedHash,
            nonce: currentNonce,
            difficulty,
            timestamp: new Date().toISOString()
          });
          setMinedBlocks(prev => prev + 1);
          mockBlockchain.addLog(`SUCCESS: Discovered Block #${nextIndex}. Hash: ${matchedHash.substring(0, 16)}...`);
        } catch (e) {
          console.error(e);
        }
      } else {
        const samplePayload = nextIndex + prevHash + currentNonce + difficulty;
        const sampleHash = simpleHash(samplePayload);
        setHash(sampleHash);
        addTerminalLog(`Nonce: ${currentNonce} | Hash: ${sampleHash.substring(0, 32)}...`);
      }
    }, 80);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">MINING CONTROL OPERATIONS</h2>
        <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Proof of Work hashing reactor controls</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hashing Visualizer Reactor Core */}
        <div className="cyber-glass border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[350px]">
          {/* Reactor ring */}
          <div className="relative w-44 h-44 rounded-full border border-white/10 flex items-center justify-center">
            {/* Spinning ring outer */}
            <div className={`absolute inset-1 rounded-full border-2 border-dashed border-cyber-cyan/35 ${isMining ? "animate-spin" : ""}`} style={{ animationDuration: '6s' }} />
            {/* Spinning ring inner */}
            <div className={`absolute inset-4 rounded-full border-t-2 border-b-2 border-cyber-purple/50 ${isMining ? "animate-spin" : ""}`} style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
            
            {/* Center Core */}
            <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center bg-slate-950/60 border ${
              isMining 
                ? "border-cyber-cyan shadow-[0_0_30px_rgba(6,182,212,0.25)]" 
                : "border-white/5"
            }`}>
              <Cpu className={`w-8 h-8 ${isMining ? "text-cyber-cyan animate-pulse" : "text-slate-500"}`} />
              <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider mt-2">
                {isMining ? "MINING" : "STANDBY"}
              </span>
              {isMining && (
                <span className="text-[11px] font-mono font-bold text-cyber-cyan mt-1">
                  {hashRate} H/s
                </span>
              )}
            </div>
          </div>

          <div className="text-center mt-6 w-full space-y-1">
            <h3 className="text-sm font-bold text-slate-200">Local Mining Engine</h3>
            <p className="text-xs text-slate-500 font-mono">Discovered Blocks: <span className="text-cyber-emerald font-bold">{minedBlocks}</span></p>
          </div>
        </div>

        {/* Console logs and statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Setup controllers */}
          <div className="cyber-glass border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Target Parameters</h4>
            
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-sm text-slate-300 font-semibold flex items-center gap-1.5"><Award className="w-4.5 h-4.5 text-cyber-rose" /> Mine Difficulty</span>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Adjust required zero bits prefix for PoW target</p>
                </div>
                <div className="flex items-center gap-2">
                  {[3, 4, 5].map((d) => (
                    <button
                      key={d}
                      onClick={() => !isMining && setDifficulty(d)}
                      disabled={isMining}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                        difficulty === d
                          ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/25"
                          : "bg-slate-900/60 text-slate-400 border-white/5 hover:border-white/10 cursor-pointer disabled:opacity-50"
                      }`}
                    >
                      D-{d} ({"0".repeat(d)}...)
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleStartMining}
                className={`w-full py-3.5 px-4 rounded-xl font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                  isMining
                    ? "bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/25 hover:bg-cyber-rose/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
                    : "bg-cyber-cyan text-slate-950 hover:bg-cyber-cyan/90 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                }`}
              >
                {isMining ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    SUSPEND MINING ENGINE
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    RUN CRYPTO CORE MINER
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Running Terminal log output */}
          <div className="cyber-glass border border-white/5 rounded-2xl p-6 h-60 flex flex-col">
            <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-3 border-b border-white/5 pb-2">Hash Output Stream</h4>
            <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1.5 pr-2 scrollbar-thin">
              {terminalLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600">
                  Mining engine idle. Press Start to initiate.
                </div>
              ) : (
                terminalLogs.map((log, index) => (
                  <div key={index} className="flex gap-1.5">
                    <span className="text-cyber-cyan font-bold">&gt;</span>
                    <span className={log.includes("SOLVED") ? "text-cyber-emerald font-bold" : ""}>{log}</span>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

