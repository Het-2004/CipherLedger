import { useState } from "react";
import { simpleHash } from "../../utils/mockBlockchain";
import { formatHash } from "../../utils/formatHash";
import { Info } from "lucide-react";

export default function MerkleTree({ transactions = [] }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedLeaf, setSelectedLeaf] = useState(null);

  // Compute Merkle Tree levels
  const computeMerkleTreeLevels = () => {
    if (transactions.length === 0) {
      return [[simpleHash("empty")]];
    }

    // Leaf nodes (Level 0)
    let currentLevel = transactions.map((tx, idx) => ({
      hash: tx.id || simpleHash(JSON.stringify(tx)),
      label: `TX #${idx + 1}`,
      txId: tx.id
    }));

    const levels = [currentLevel];

    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combinedHash = simpleHash(currentLevel[i].hash + currentLevel[i + 1].hash);
          nextLevel.push({
            hash: combinedHash,
            label: `Hash(${currentLevel[i].label} + ${currentLevel[i + 1].label})`,
            leftChild: i,
            rightChild: i + 1
          });
        } else {
          // Odd node, duplicate
          const combinedHash = simpleHash(currentLevel[i].hash + currentLevel[i].hash);
          nextLevel.push({
            hash: combinedHash,
            label: `Hash(${currentLevel[i].label} + ${currentLevel[i].label})`,
            leftChild: i,
            rightChild: i
          });
        }
      }
      currentLevel = nextLevel;
      levels.push(currentLevel);
    }

    return levels;
  };

  const treeLevels = computeMerkleTreeLevels();
  const leafCount = treeLevels[0].length;
  const depth = treeLevels.length;

  // Determine if a node at (levelIndex, nodeIndex) is on the path to the root from selectedLeaf
  const isNodeOnPath = (levelIdx, nodeIdx) => {
    if (selectedLeaf === null) return false;
    let currentIdx = selectedLeaf;
    for (let l = 0; l < treeLevels.length; l++) {
      if (l === levelIdx && currentIdx === nodeIdx) return true;
      currentIdx = Math.floor(currentIdx / 2);
    }
    return false;
  };

  // Dimensions of SVG canvas
  const width = 600;
  const height = Math.max(260, depth * 70);

  // Helper to calculate node positions
  const getNodePos = (levelIdx, nodeIdx) => {
    // Top-to-bottom layout
    const levelCount = treeLevels[levelIdx].length;
    const y = height - 35 - levelIdx * 65;
    // Distribute nodes evenly horizontally
    const segmentWidth = width / (levelCount + 1);
    const x = segmentWidth * (nodeIdx + 1);
    return { x, y };
  };

  return (
    <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-4 font-mono text-[11px] select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-cyber-cyan font-bold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> MERKLE TREE EXPLORER
        </span>
        <span className="text-slate-500 text-[10px]">Click a transaction leaf to trace hash path</span>
      </div>

      <div className="relative overflow-x-auto scrollbar-thin">
        <svg width={width} height={height} className="mx-auto block">
          {/* Connection Lines */}
          {treeLevels.map((level, levelIdx) => {
            if (levelIdx === treeLevels.length - 1) return null; // Root has no parent
            return level.map((node, nodeIdx) => {
              const startPos = getNodePos(levelIdx, nodeIdx);
              const parentIdx = Math.floor(nodeIdx / 2);
              const endPos = getNodePos(levelIdx + 1, parentIdx);
              const isActive = isNodeOnPath(levelIdx, nodeIdx) && isNodeOnPath(levelIdx + 1, parentIdx);

              return (
                <line
                  key={`line-${levelIdx}-${nodeIdx}`}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  className={`transition-all duration-300 ${
                    isActive ? "stroke-cyber-cyan stroke-2" : "stroke-white/10 stroke-[1.5px]"
                  }`}
                />
              );
            });
          })}

          {/* Nodes */}
          {treeLevels.map((level, levelIdx) => {
            const isRoot = levelIdx === treeLevels.length - 1;
            const isLeaf = levelIdx === 0;

            return level.map((node, nodeIdx) => {
              const pos = getNodePos(levelIdx, nodeIdx);
              const isActive = isNodeOnPath(levelIdx, nodeIdx);
              const isHovered = hoveredNode?.level === levelIdx && hoveredNode?.index === nodeIdx;

              let nodeColorClass = "fill-slate-900 stroke-white/20";
              if (isActive) nodeColorClass = "fill-slate-900 stroke-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,0.3)]";
              if (isHovered) nodeColorClass = "fill-slate-950 stroke-cyber-purple";
              if (isRoot && !isActive) nodeColorClass = "fill-slate-900 stroke-cyber-purple/40";

              return (
                <g
                  key={`node-${levelIdx}-${nodeIdx}`}
                  className="cursor-pointer"
                  onClick={() => isLeaf && setSelectedLeaf(selectedLeaf === nodeIdx ? null : nodeIdx)}
                  onMouseEnter={() => setHoveredNode({ level: levelIdx, index: nodeIdx, node })}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isRoot ? 12 : 10}
                    className={`transition-all duration-300 ${nodeColorClass}`}
                  />
                  {isRoot && (
                    <text
                      x={pos.x}
                      y={pos.y + 3}
                      className="text-[8px] fill-cyber-purple font-bold text-center select-none pointer-events-none"
                      textAnchor="middle"
                    >
                      R
                    </text>
                  )}
                  {isLeaf && (
                    <text
                      x={pos.x}
                      y={pos.y + 3}
                      className="text-[8px] fill-cyber-cyan/70 font-bold text-center select-none pointer-events-none"
                      textAnchor="middle"
                    >
                      {nodeIdx + 1}
                    </text>
                  )}
                </g>
              );
            });
          })}
        </svg>
      </div>

      {/* Detail info box */}
      <div className="p-3 rounded-lg border border-white/5 bg-black/40 min-h-[56px] flex flex-col justify-center">
        {hoveredNode ? (
          <div>
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
              <span>{hoveredNode.node.label.toUpperCase()}</span>
              <span className="text-cyber-purple">LEVEL {hoveredNode.level}</span>
            </div>
            <span className="text-slate-300 break-all select-all font-mono text-[10px] leading-relaxed">
              {hoveredNode.node.hash}
            </span>
          </div>
        ) : (
          <div className="text-slate-500 text-center text-[10px]">
            Hover over nodes to inspect cryptographic hash hashes
          </div>
        )}
      </div>
    </div>
  );
}
