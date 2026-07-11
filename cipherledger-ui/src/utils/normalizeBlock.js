/**
 * Normalize a block object from the backend API to the shape
 * expected by all frontend components.
 *
 * Backend Block.java fields:
 *   id, index, previousHash, hash, nonce, timestamp, transactions[]
 *
 * Backend Transaction.java fields:
 *   transactionId, sender (PublicKey), receiver (PublicKey), amount, signature
 *
 * Frontend expects:
 *   index, previousHash (string, never null), hash, nonce, timestamp (number),
 *   difficulty (number), merkleRoot (string),
 *   transactions[]: { id, sender (string), receiver (string), amount, timestamp, status }
 */

function normalizeTransaction(tx, blockTimestamp) {
  // Backend Transaction has transactionId, sender (PublicKey object), receiver, amount
  // PublicKey serializes to something like { algorithm: "EC", format: "X.509", encoded: "..." }
  // or as a string representation. We extract a displayable string.
  const senderStr =
    typeof tx.sender === "string"
      ? tx.sender
      : tx.sender?.encoded
        ? "PK-" + btoa(String.fromCharCode(...new Uint8Array(tx.sender.encoded.slice(0, 8)))).replace(/[^a-zA-Z0-9]/g, "").substring(0, 20)
        : tx.sender?.toString?.() ?? "UNKNOWN";

  const receiverStr =
    typeof tx.receiver === "string"
      ? tx.receiver
      : tx.receiver?.encoded
        ? "PK-" + btoa(String.fromCharCode(...new Uint8Array(tx.receiver.encoded.slice(0, 8)))).replace(/[^a-zA-Z0-9]/g, "").substring(0, 20)
        : tx.receiver?.toString?.() ?? "UNKNOWN";

  return {
    id: tx.transactionId || tx.id || "tx-" + Math.random().toString(36).substring(2, 9),
    sender: senderStr,
    receiver: receiverStr,
    amount: tx.amount ?? 0,
    timestamp: tx.timestamp ?? blockTimestamp ?? Date.now(),
    status: tx.status || "CONFIRMED"
  };
}

export function normalizeBlock(block, idx) {
  return {
    index: block.index ?? idx ?? 0,
    previousHash: block.previousHash ?? "0000000000000000000000000000000000000000000000000000000000000000",
    hash: block.hash ?? "",
    nonce: block.nonce ?? 0,
    timestamp: typeof block.timestamp === "number" ? block.timestamp : new Date(block.timestamp).getTime() || Date.now(),
    difficulty: block.difficulty ?? 4,
    merkleRoot: block.merkleRoot ?? "",
    transactions: Array.isArray(block.transactions)
      ? block.transactions.map(tx => normalizeTransaction(tx, block.timestamp))
      : []
  };
}

export function normalizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((b, i) => normalizeBlock(b, i));
}
