import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import NetworkChart from "../components/dashboard/NetworkChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import { getBlocks } from "../api/blockchainApi";
import { getTransactions } from "../api/transactionApi";
import { mockBlockchain } from "../utils/mockBlockchain";
import { Blocks, ArrowLeftRight, Flame, Network } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    blocks: 0,
    transactions: 0,
    difficulty: 4,
    nodes: 0,
  });

  const loadStats = async () => {
    try {
      const blockRes = await getBlocks();
      const txRes = await getTransactions();
      const nodes = mockBlockchain.getNodes().length;
      
      // Get difficulty from latest block or default to 4
      const latestBlock = blockRes.data.slice(-1)[0];
      const diff = latestBlock ? latestBlock.difficulty : 4;

      setStats({
        blocks: blockRes.data.length,
        transactions: txRes.data.length,
        difficulty: diff,
        nodes,
      });
    } catch (err) {
      console.error("Error loading dashboard stats", err);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">CONSOLE OVERVIEW</h2>
        <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Real-time status indicators & relays diagnostics</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="LATEST BLOCK"
          value={`#${stats.blocks - 1}`}
          icon={<Blocks className="w-5 h-5" />}
          trend="+1 Block"
          color="cyan"
        />
        <StatCard
          title="TRANSACTIONS"
          value={stats.transactions}
          icon={<ArrowLeftRight className="w-5 h-5" />}
          trend="+14 txs"
          color="purple"
        />
        <StatCard
          title="MINING DIFFICULTY"
          value={stats.difficulty}
          icon={<Flame className="w-5 h-5" />}
          trend="Stable"
          color="rose"
        />
        <StatCard
          title="ACTIVE PEERS"
          value={stats.nodes}
          icon={<Network className="w-5 h-5" />}
          trend="+1 Node"
          color="emerald"
        />
      </div>

      {/* Charts & System logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <NetworkChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

