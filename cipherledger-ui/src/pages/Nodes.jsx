import { useState, useEffect } from "react";
import { Activity, Plus, Cpu, RefreshCw, CheckCircle } from "lucide-react";
import { mockBlockchain } from "../utils/mockBlockchain";
import toast from "react-hot-toast";
import LiveWorldMap from "../components/nodes/LiveWorldMap";

export default function Nodes() {
  const [nodes, setNodes] = useState([]);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchNodes = () => {
    setNodes(mockBlockchain.getNodes());
  };

  useEffect(() => {
    fetchNodes();
    // Latency fluctuation simulation
    const interval = setInterval(() => {
      setNodes(prev =>
        prev.map(n => ({
          ...n,
          latency: Math.max(5, n.latency + Math.floor(Math.random() * 9) - 4)
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAddNode = async (e) => {
    e.preventDefault();
    if (!address || !name) {
      toast.error("Both node address and label are required.");
      return;
    }

    setConnecting(true);
    toast("Establishing TCP handshake with peer node...", { icon: "🤝" });

    setTimeout(() => {
      try {
        const added = mockBlockchain.addNode({ address, name });
        fetchNodes();
        setSelectedNode(added);
        toast.success(`Connected to node [${name}] successfully!`);
        setAddress("");
        setName("");
      } catch (err) {
        toast.error("Failed to connect: Connection timed out.");
      } finally {
        setConnecting(false);
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wide font-mono">NETWORK PEER TOPOLOGY</h2>
          <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Decentralized P2P node connections</p>
        </div>
        <button
          onClick={fetchNodes}
          className="px-3.5 py-1.5 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 font-mono text-[10px] text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> REFRESH MAP
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real Live-Map Visualizer */}
        <div className="lg:col-span-2 cyber-glass border border-white/5 rounded-2xl p-4 relative overflow-hidden h-[420px]">
          <LiveWorldMap
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        </div>

        {/* Node details and Add Node card */}
        <div className="space-y-6">
          {/* Node Details */}
          <div className="cyber-glass border border-white/5 rounded-2xl p-6 min-h-[190px] flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Selected Peer Details</h4>
              {selectedNode ? (
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Label:</span>
                    <span className="text-slate-200 font-semibold">{selectedNode.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Endpoint Address:</span>
                    <span className="text-slate-300 font-semibold">{selectedNode.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ping Rountrip:</span>
                    <span className={`font-bold ${selectedNode.latency > 100 ? "text-cyber-rose" : "text-cyber-emerald"}`}>
                      {selectedNode.latency} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-bold ${selectedNode.status === "ONLINE" ? "text-cyber-emerald" : "text-cyber-cyan animate-pulse"}`}>
                      {selectedNode.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-600 font-mono text-xs">
                  Click on map markers to view configuration parameters
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-2.5 py-1 text-[10px] font-mono text-slate-500 hover:text-slate-300 bg-transparent border-0 cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>

          {/* Add Node Register */}
          <div className="cyber-glass border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Register Peer Node</h4>

            <form onSubmit={handleAddNode} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Peer Address / Port</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 192.168.1.150:8080"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">Peer Label</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. US-West Validator"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-100 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan/30 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={connecting}
                className="w-full bg-cyber-cyan text-slate-950 font-bold tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 cursor-pointer text-xs disabled:opacity-50"
              >
                {connecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    CONNECT PEER NODE
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Nodes list table */}
      <div className="cyber-glass border border-white/5 rounded-2xl p-6">
        <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-cyber-cyan" /> Network Peers Table Registry
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-white/5 pb-2">
                <th className="pb-3 font-semibold">PEER ID</th>
                <th className="pb-3 font-semibold">LABEL</th>
                <th className="pb-3 font-semibold">ENDPOINT IP ADDRESS</th>
                <th className="pb-3 font-semibold">PING LATENCY</th>
                <th className="pb-3 font-semibold text-right">SYNC STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="text-slate-300">
                <td className="py-3.5 font-bold text-cyber-cyan">node-host</td>
                <td>Local Host Console (Active)</td>
                <td>127.0.0.1:8080</td>
                <td className="text-cyber-emerald font-semibold">0 ms (Host)</td>
                <td className="text-right py-3.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/25">
                    <CheckCircle className="w-3.5 h-3.5" /> HOST
                  </span>
                </td>
              </tr>
              {nodes.map((node) => (
                <tr key={node.id} className="text-slate-300 hover:bg-white/1 transition-all">
                  <td className="py-3.5 font-semibold text-slate-400">{node.id}</td>
                  <td>{node.name}</td>
                  <td>{node.address}</td>
                  <td className={node.latency > 100 ? "text-cyber-rose" : "text-cyber-emerald"}>
                    {node.latency} ms
                  </td>
                  <td className="text-right py-3.5">
                    {node.status === "ONLINE" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/25">
                        <CheckCircle className="w-3.5 h-3.5" /> SYNCED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/25 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> SYNCING
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
