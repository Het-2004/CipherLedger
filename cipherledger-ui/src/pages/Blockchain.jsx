import { useState, useEffect } from "react";
import useBlocks from "../hooks/useBlocks";
import BlockList from "../components/blockchain/BlockList";
import { validateChain } from "../api/blockchainApi";
import { Search, ShieldCheck, ShieldAlert, Cpu, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { mockBlockchain } from "../utils/mockBlockchain";

export default function Blockchain() {
  const { blocks, refresh } = useBlocks();
  const [searchQuery, setSearchQuery] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validatingIndex, setValidatingIndex] = useState(-1);
  const [tamperedIndex, setTamperedIndex] = useState(-1);
  const [chainBlocks, setChainBlocks] = useState([]);

  useEffect(() => {
    setChainBlocks(blocks);
  }, [blocks]);

  // Search filtering
  const filteredBlocks = chainBlocks.filter(b => {
    const query = searchQuery.toLowerCase();
    return (
      b.index.toString().includes(query) ||
      b.hash.toLowerCase().includes(query) ||
      (b.previousHash && b.previousHash.toLowerCase().includes(query))
    );
  });

  // Run audit scan animation
  const handleValidateChain = async () => {
    if (isValidating) return;
    setIsValidating(true);
    setValidatingIndex(0);
    toast("Starting cryptographic ledger verification sweep...", {
      icon: "🔍"
    });

    let current = 0;
    const interval = setInterval(async () => {
      if (current < chainBlocks.length) {
        setValidatingIndex(current);
        current++;
      } else {
        clearInterval(interval);
        setValidatingIndex(-1);
        setIsValidating(false);

        // Run actual validator logic (which pings api/mock)
        const checkResult = await validateChain();
        const isValid = checkResult.data.valid && tamperedIndex === -1;

        if (isValid) {
          toast.success("Ledger Verification Complete. Integrity 100% Secure.", {
            duration: 4000
          });
        } else {
          toast.error("LEDGER AUDIT FAILURE: Structural link breakage detected!", {
            duration: 5000
          });
        }
      }
    }, 400); // scan speed
  };

  // Tamper simulation
  const toggleTamper = () => {
    if (tamperedIndex !== -1) {
      // Revert tamper
      setTamperedIndex(-1);
      setChainBlocks(blocks);
      toast.success("Structural linkage restored.");
      mockBlockchain.addLog("Operator restored ledger integrity.");
    } else {
      if (chainBlocks.length <= 1) {
        toast.error("Need at least 2 blocks to simulate links tampering.");
        return;
      }
      // Corrupt the hash of Block 1
      const updated = [...chainBlocks];
      updated[1] = {
        ...updated[1],
        hash: "bada55badc0debad000000000000000000000000000000000000000000000000"
      };
      setChainBlocks(updated);
      setTamperedIndex(1);
      toast.warning("Simulated block hash tampered. Linkage broken!", {
        icon: "⚠️"
      });
      mockBlockchain.addLog("CRITICAL WARNING: Tampered block #1 manually. Hash mismatch generated.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide">BLOCKCHAIN EXPLORER</h2>
          <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Immutable ledger ledger blocks registry</p>
        </div>

        <div className="flex gap-3">
          {/* Tamper Button */}
          <button
            onClick={toggleTamper}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
              tamperedIndex !== -1
                ? "bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/25 hover:bg-cyber-emerald/20"
                : "bg-cyber-rose/10 text-cyber-rose border-cyber-rose/25 hover:bg-cyber-rose/20"
            }`}
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            {tamperedIndex !== -1 ? "RECOVER INTEGRITY" : "TAMPER BLOCK HASH"}
          </button>

          {/* Audit Button */}
          <button
            onClick={handleValidateChain}
            disabled={isValidating}
            className="px-4 py-2 rounded-xl bg-cyber-cyan hover:bg-cyber-cyan/90 text-slate-950 text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 ${isValidating ? "animate-spin" : ""}`} />
            {isValidating ? "RUNNING CRYPTO SWEEP..." : "AUDIT LEDGER INTEGRITY"}
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="cyber-glass rounded-xl p-4 border border-white/5 flex items-center gap-3">
        <Search className="text-slate-500 w-5 h-5 pl-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter block ledger by index, hash, previous hash..."
          className="bg-transparent border-0 text-sm text-slate-100 focus:outline-none focus:ring-0 flex-grow font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono bg-transparent border-0 cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Block List */}
      {filteredBlocks.length === 0 ? (
        <div className="cyber-glass rounded-2xl border border-white/5 p-12 text-center text-slate-500 font-mono text-xs">
          No block nodes matched query "{searchQuery}"
        </div>
      ) : (
        <BlockList
          blocks={filteredBlocks}
          validatingIndex={validatingIndex}
          tamperedIndex={tamperedIndex}
        />
      )}
    </div>
  );
}

