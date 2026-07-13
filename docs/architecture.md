# 🏛 CipherLedger Architecture

CipherLedger adopts a modular, microservice-friendly monolithic design ensuring high throughput and resilience.

## Core Components

1. **P2P Network Layer**: Built on raw WebSockets and TCP sockets, the P2P layer ensures near-instantaneous block and transaction propagation across the network.
2. **Transaction Pool (Mempool)**: Validates and temporarily stores unconfirmed transactions. Includes anti-spam and double-spend detection filters.
3. **Consensus Engine**: A highly abstract layer allowing the blockchain to operate using different consensus algorithms without modifying the core state machine.
4. **CipherLedger Virtual Machine (CLVM)**: The execution environment for smart contracts. It operates in a sandboxed, memory-restricted state to prevent infinite loops (halting problem) and malicious execution.
5. **Storage Layer**: Pluggable storage interfaces. Supports lightweight JSON storage for development and robust SQL/NoSQL databases for production.

## System Flow
1. Users submit transactions (standard transfers or smart contract invocations) via the REST API or WebSockets using the SDKs.
2. Transactions are validated cryptographically and pushed to the Mempool.
3. The Active Consensus Engine (e.g., PoW Miners or PoS Validators) bundles transactions into a Block.
4. The block is verified, executed by the CLVM if necessary, and appended to the immutable Ledger.
5. The new state is broadcasted to the P2P network.
