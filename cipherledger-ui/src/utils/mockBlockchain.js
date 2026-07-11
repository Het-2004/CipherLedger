import toast from "react-hot-toast";

// Helper to calculate a simple SHA256-like hash for mock purposes
export function simpleHash(data) {
  let str = typeof data === 'string' ? data : JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex and pad
  let hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Duplicate it to look like a full 64-char SHA256 hash for aesthetics
  return (hex + hex + hex + hex + hex + hex + hex + hex).substring(0, 64);
}

export function calculateMerkleRoot(transactions) {
  if (!transactions || transactions.length === 0) {
    return simpleHash("empty");
  }
  let txHashes = transactions.map(tx => tx.id || simpleHash(JSON.stringify(tx)));
  while (txHashes.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < txHashes.length; i += 2) {
      if (i + 1 < txHashes.length) {
        nextLevel.push(simpleHash(txHashes[i] + txHashes[i + 1]));
      } else {
        // odd number of nodes: duplicate the node
        nextLevel.push(simpleHash(txHashes[i] + txHashes[i]));
      }
    }
    txHashes = nextLevel;
  }
  return txHashes[0];
}

// Initial Mock Blocks
const defaultBlocks = [
  {
    index: 0,
    timestamp: Date.now() - 3600000 * 2,
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "00003bfa861ef1c60f252bf2c938bb7a36c84c17240c5b3648589f64bf3de519",
    nonce: 49281,
    difficulty: 4,
    merkleRoot: "7a836fe9f2390ab5b49bcfbc543ab",
    transactions: [
      { id: "tx-genesis", sender: "SYSTEM", receiver: "GENESIS", amount: 1000000, timestamp: Date.now() - 3600000 * 2, status: "CONFIRMED" }
    ]
  },
  {
    index: 1,
    timestamp: Date.now() - 3600000,
    previousHash: "00003bfa861ef1c60f252bf2c938bb7a36c84c17240c5b3648589f64bf3de519",
    hash: "00007fa918bcf5cde189abf284f1839db4c83f982143ab56cf98de174fba6e21",
    nonce: 10839,
    difficulty: 4,
    merkleRoot: "1a8b94fde2e8e3d3ab2c418f7a90b39",
    transactions: [
      { id: "tx-1", sender: "CLD-SYSTEM", receiver: "CLD-ADMIN-WALLET-001", amount: 100, timestamp: Date.now() - 3600000, status: "CONFIRMED" },
      { id: "tx-2", sender: "CLD-ADMIN-WALLET-001", receiver: "CLD-DEVELOPER-02", amount: 25, timestamp: Date.now() - 3550000, status: "CONFIRMED" }
    ]
  }
];

const defaultNodes = [
  { id: "node-1", address: "34.207.112.51:8080", status: "ONLINE", latency: 12, name: "US-East Validator" },
  { id: "node-2", address: "54.37.129.213:8080", status: "ONLINE", latency: 78, name: "EU-West Anchor" },
  { id: "node-3", address: "13.127.183.170:8080", status: "ONLINE", latency: 142, name: "AP-South Peer" },
  { id: "node-4", address: "45.223.12.19:8080", status: "SYNCING", latency: 95, name: "SA-East Sync" }
];

export const mockBlockchain = {
  getBlocks() {
    const data = localStorage.getItem("cl_blocks");
    if (!data) {
      localStorage.setItem("cl_blocks", JSON.stringify(defaultBlocks));
      return defaultBlocks;
    }
    return JSON.parse(data);
  },

  saveBlock(block) {
    const blocks = this.getBlocks();
    
    // Bundle pending transactions if not provided
    if (!block.transactions || block.transactions.length === 0) {
      const pending = this.getPendingTransactions();
      block.transactions = pending.map(t => ({ ...t, status: "CONFIRMED" }));
      localStorage.setItem("cl_pending_txs", JSON.stringify([]));
    }
    
    // Calculate merkle root
    block.merkleRoot = calculateMerkleRoot(block.transactions);
    
    blocks.push(block);
    localStorage.setItem("cl_blocks", JSON.stringify(blocks));
    this.addLog(`Block #${block.index} saved to local ledger. Hash: ${block.hash.substring(0, 16)}...`);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cl_block_mined", { detail: block }));
    }
    
    return block;
  },

  getTransactions() {
    const blocks = this.getBlocks();
    const txs = [];
    blocks.forEach(b => {
      if (b.transactions) {
        b.transactions.forEach(t => txs.push(t));
      }
    });
    // Add pending txs
    const pending = this.getPendingTransactions();
    return [...pending, ...txs].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getPendingTransactions() {
    const data = localStorage.getItem("cl_pending_txs");
    return data ? JSON.parse(data) : [];
  },

  addTransaction(tx) {
    const pending = this.getPendingTransactions();
    const newTx = {
      id: "tx-" + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      status: "PENDING",
      ...tx
    };
    pending.push(newTx);
    localStorage.setItem("cl_pending_txs", JSON.stringify(pending));
    this.addLog(`Transaction received. Sent ${tx.amount} CLD to ${tx.receiver.substring(0, 12)}...`);
    return newTx;
  },

  getWallet(address) {
    const wallets = JSON.parse(localStorage.getItem("cl_wallets") || "{}");
    if (wallets[address]) {
      // Calculate balance by scanning ledger
      let balance = wallets[address].balance || 100;
      const blocks = this.getBlocks();
      blocks.forEach(b => {
        if (b.transactions) {
          b.transactions.forEach(t => {
            if (t.sender === address) balance -= t.amount;
            if (t.receiver === address) balance += t.amount;
          });
        }
      });
      // Subtract pending transfers out
      const pending = this.getPendingTransactions();
      pending.forEach(t => {
        if (t.sender === address) balance -= t.amount;
      });

      return {
        ...wallets[address],
        balance
      };
    }
    return null;
  },

  createWallet() {
    const privateKey = "prv_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const publicKey = "pub_" + simpleHash(privateKey).substring(0, 40);
    const address = "CLD_" + simpleHash(publicKey).substring(0, 24).toUpperCase();
    
    const wallets = JSON.parse(localStorage.getItem("cl_wallets") || "{}");
    const wallet = { address, publicKey, privateKey, balance: 500 };
    wallets[address] = wallet;
    localStorage.setItem("cl_wallets", JSON.stringify(wallets));
    localStorage.setItem("cl_current_wallet", address);
    this.addLog(`New holographic wallet initialized: ${address.substring(0, 12)}...`);
    return wallet;
  },

  getCurrentWallet() {
    const address = localStorage.getItem("cl_current_wallet");
    if (!address) {
      const w = this.createWallet();
      return w;
    }
    return this.getWallet(address) || this.createWallet();
  },

  getNodes() {
    const data = localStorage.getItem("cl_nodes");
    if (!data) {
      localStorage.setItem("cl_nodes", JSON.stringify(defaultNodes));
      return defaultNodes;
    }
    return JSON.parse(data);
  },

  addNode(node) {
    const nodes = this.getNodes();
    const newNode = {
      id: "node-" + Math.random().toString(36).substring(2, 9),
      latency: Math.floor(Math.random() * 150) + 10,
      status: "ONLINE",
      ...node
    };
    nodes.push(newNode);
    localStorage.setItem("cl_nodes", JSON.stringify(nodes));
    this.addLog(`Registered peer node [${node.name || node.address}]`);
    return newNode;
  },

  addLog(msg) {
    const logs = JSON.parse(localStorage.getItem("cl_logs") || "[]");
    const newLog = {
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      msg
    };
    logs.push(newLog);
    // Keep last 100 logs
    if (logs.length > 100) logs.shift();
    localStorage.setItem("cl_logs", JSON.stringify(logs));
  },

  getLogs() {
    return JSON.parse(localStorage.getItem("cl_logs") || "[]");
  },

  validateChain() {
    const blocks = this.getBlocks();
    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i];
      const previousBlock = blocks[i - 1];

      // Recompute hash for verification
      const computedHash = simpleHash(
        currentBlock.index + 
        currentBlock.timestamp + 
        currentBlock.previousHash + 
        currentBlock.nonce + 
        currentBlock.merkleRoot
      );

      // Check if hash matches
      if (currentBlock.hash !== computedHash) {
        this.addLog(`Verification Failure: Block #${currentBlock.index} hash mismatch!`);
        return false;
      }

      // Check linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        this.addLog(`Verification Failure: Link broken between #${currentBlock.index} and #${previousBlock.index}`);
        return false;
      }
    }
    this.addLog("Blockchain audit complete. System integrity is 100% SECURE.");
    return true;
  }
};

// Start background simulation of real-world transaction broadcasts
if (typeof window !== "undefined") {
  const simulateTransactions = () => {
    const wallets = ["CLD_ALICE_NODE", "CLD_BOB_MARKET", "CLD_CHARLIE_ESCROW", "CLD_DAVID_ANCHOR"];
    const senders = ["CLD-SYSTEM-REWARD", "CLD-LIQUIDITY-POOL", ...wallets];
    const receivers = ["CLD-STAKING-VAULT", ...wallets];
    
    setInterval(() => {
      const sender = senders[Math.floor(Math.random() * senders.length)];
      let receiver = receivers[Math.floor(Math.random() * receivers.length)];
      while (sender === receiver) {
        receiver = receivers[Math.floor(Math.random() * receivers.length)];
      }
      const amount = Math.floor(Math.random() * 95) + 5;
      
      const pending = mockBlockchain.getPendingTransactions();
      if (pending.length < 6) {
        const tx = {
          sender,
          receiver,
          amount
        };
        const added = mockBlockchain.addTransaction(tx);
        
        // Dispatch Custom Event to notify active pages instantly
        const event = new CustomEvent("cl_mempool_update", { detail: added });
        window.dispatchEvent(event);
      }
    }, 18000); // simulated transaction broadcasts every 18 seconds
  };
  
  setTimeout(simulateTransactions, 5000);
}
