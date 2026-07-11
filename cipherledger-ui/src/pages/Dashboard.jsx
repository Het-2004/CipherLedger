import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import NetworkChart from "../components/dashboard/NetworkChart";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import MiningGraph from "../components/dashboard/MiningGraph";
import NetworkHealth from "../components/dashboard/NetworkHealth";
import { getBlocks } from "../api/blockchainApi";
import { getTransactions } from "../api/transactionApi";
import { mockBlockchain } from "../utils/mockBlockchain";
import { Blocks, ArrowLeftRight, Flame, Network } from "lucide-react";
import { motion } from "framer-motion";

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
      const latestBlock = blockRes.data.length > 0 ? blockRes.data[blockRes.data.length - 1] : null;
      const diff = latestBlock?.difficulty ?? 4;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      className="space-y-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">CONSOLE OVERVIEW</h2>
        <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Real-time status indicators & relays diagnostics</p>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="LATEST BLOCK"
          value={`#${stats.blocks - 1 < 0 ? 0 : stats.blocks - 1}`}
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
      </motion.div>

      {/* Charts & System logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <NetworkChart />
        </motion.div>
        <motion.div variants={itemVariants}>
          <NetworkHealth />
        </motion.div>
      </div>

      {/* Lower Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <MiningGraph />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActivityFeed />
        </motion.div>
      </div>
    </motion.div>
  );
}

