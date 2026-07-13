# ⚖️ Consensus Mechanisms

CipherLedger is unique in its ability to support multiple consensus algorithms, catering to different network topologies—from public permissionless networks to private enterprise consortiums.

## Supported Algorithms

### 1. Proof of Work (PoW)
- **Use Case**: Public, permissionless networks.
- **Mechanism**: Miners compete to find a cryptographic nonce that satisfies the dynamic difficulty target.
- **Security**: Heavily resistant to Sybil attacks, relying on computational expenditure.

### 2. Proof of Stake (PoS)
- **Use Case**: Eco-friendly public networks.
- **Mechanism**: Validators are chosen to forge the next block based on the size of their staked tokens and the coin age.
- **Benefits**: Eliminates the massive energy consumption of PoW while maintaining high decentralization.

### 3. Delegated Proof of Stake (DPoS)
- **Use Case**: High-throughput decentralized networks.
- **Mechanism**: Token holders vote for a fixed number of "Delegates" who secure the network on their behalf.
- **Benefits**: Extremely fast block times and high transactions per second (TPS).

### 4. Practical Byzantine Fault Tolerance (PBFT)
- **Use Case**: Private Enterprise and Consortium blockchains.
- **Mechanism**: A multi-phase voting process (Pre-prepare, Prepare, Commit) among known, permissioned nodes.
- **Benefits**: Absolute finality (no forks), rapid consensus, ideal for trusted enterprise environments.

*To switch consensus mechanisms, update the `blockchain.consensus.type` property in `application.properties`.*
