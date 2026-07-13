# 🪐 CipherLedger

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Supported-green)

CipherLedger is a next-generation, high-performance blockchain ecosystem engineered for enterprise-grade scalability, security, and developer flexibility. Designed from the ground up in Java, it features a custom Virtual Machine (CLVM), multi-consensus support, native NFT & Token engines, and comprehensive SDKs for seamless integration.

## ✨ Key Features

- **Multi-Consensus Architecture**: Hot-swappable consensus engines including Proof of Work (PoW), Proof of Stake (PoS), Delegated PoS (DPoS), and Practical Byzantine Fault Tolerance (PBFT).
- **CipherLedger Virtual Machine (CLVM)**: A custom, lightweight Turing-complete virtual machine for executing robust smart contracts securely.
- **Native Digital Assets**: Built-in support for custom fungible tokens and Non-Fungible Tokens (NFTs) with an integrated marketplace engine.
- **Enterprise Ready**: Full Docker and Kubernetes deployment configurations, alongside Prometheus & Grafana monitoring stacks out of the box.
- **Rich Developer Tooling**: Includes full-fledged Java and JavaScript SDKs, simplifying integration with web and backend applications.
- **Comprehensive Ecosystem**:
  - `cipherledger-ui`: A sleek React-based block explorer and enterprise dashboard.
  - `cipherledger-wallet-extension`: A browser extension wallet for secure key management and transaction signing.
  - `cipherledger-java-sdk` & `cipherledger-js-sdk`: Official client libraries.

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Maven 3.8+
- Node.js 18+ (for UI and JS SDK)
- Docker & docker-compose (for containerized deployments)

### Running Locally

1. **Build the Backend Core**:
   ```bash
   mvn clean install
   ```
2. **Start the Node**:
   ```bash
   mvn spring-boot:run
   ```
3. **Run the UI Explorer**:
   ```bash
   cd cipherledger-ui
   npm install
   npm run dev
   ```

### Docker Deployment
To spin up a complete environment including monitoring:
```bash
docker-compose -f docker-compose.multi-node.yml -f docker-compose.monitoring.yml up -d
```

## 📚 Documentation

Dive deep into the architecture and subsystems of CipherLedger by exploring our comprehensive documentation folder (`/docs`):

- [Architecture Overview](docs/architecture.md)
- [Consensus Mechanisms](docs/consensus.md)
- [Smart Contracts & CLVM](docs/smart_contracts.md)
- [Tokens & NFTs](docs/nfts_and_tokens.md)
- [Deployment Guide](docs/deployment.md)
- [API Reference](docs/api_reference.md)

## 🛡 Security & Cryptography
CipherLedger relies on state-of-the-art cryptographic primitives:
- **Hashing**: SHA-256 for blocks and transactions.
- **Signatures**: ECDSA (secp256k1) for wallet generation and transaction signing.
- **Encoding**: Base58Check encoding for wallet addresses.
- **Data Integrity**: Merkle Trees for efficient block state verification.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an Issue. Make sure to update tests as appropriate.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
