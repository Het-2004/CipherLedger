import axiosClient from "./axiosClient";
import { mockBlockchain } from "../utils/mockBlockchain";

export const mineBlock = async (blockData) => {
  try {
    const res = await axiosClient.post("/mining", blockData);
    return res;
  } catch (err) {
    console.warn("Mining API unavailable. Storing block in local simulation.", err);
    // Automatically generate block fields if empty
    const block = {
      index: blockData?.index ?? mockBlockchain.getBlocks().length,
      timestamp: Date.now(),
      previousHash: blockData?.previousHash ?? mockBlockchain.getBlocks().slice(-1)[0]?.hash ?? "0000",
      hash: blockData?.hash ?? "0000hash" + Math.random().toString(36).substring(2, 10),
      nonce: blockData?.nonce ?? Math.floor(Math.random() * 10000),
      difficulty: blockData?.difficulty ?? 4,
      merkleRoot: blockData?.merkleRoot ?? "0000merkle",
      transactions: blockData?.transactions ?? mockBlockchain.getPendingTransactions()
    };
    
    // Clear pending transactions since they are now in the block
    localStorage.setItem("cl_pending_txs", JSON.stringify([]));
    
    const saved = mockBlockchain.saveBlock(block);
    return { data: saved };
  }
};