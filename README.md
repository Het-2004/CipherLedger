<div align="center">

<br/>

```
 ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗
██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗
██║     ██║██████╔╝███████║█████╗  ██████╔╝
██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗
╚██████╗██║██║     ██║  ██║███████╗██║  ██║
 ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
      L E D G E R  —  Enterprise Blockchain
```

<br/>

<p>
  <strong>A next-generation, enterprise-grade blockchain ecosystem<br/>engineered for performance, security, and developer excellence.</strong>
</p>

<br/>

<!-- BADGES -->
<p>
  <a href="https://github.com/Het-2004/CipherLedger/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License"/>
  </a>
  <img src="https://img.shields.io/badge/Java-21-f97316?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6db33f?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Kubernetes-Supported-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes"/>
  <img src="https://img.shields.io/badge/MongoDB-Indexed-47a248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Redis-Cache-dc382d?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
</p>

<br/>

<p>
  <a href="#-overview">Overview</a> •
  <a href="#-ecosystem">Ecosystem</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-documentation">Docs</a>
</p>

<br/>

---

</div>

## 🌌 Overview

**CipherLedger** is a production-ready, modular blockchain platform designed for real-world enterprise deployment. Built entirely in **Java 21** with a **Spring Boot** backbone, it is a rare example of a feature-complete blockchain written from scratch — featuring its own Virtual Machine, multi-algorithm consensus, native NFT & Token protocols, and a rich developer SDK ecosystem.

> **Why CipherLedger?** Most blockchain frameworks either sacrifice security for speed, or scalability for decentralization. CipherLedger breaks this trilemma through hot-swappable consensus engines, allowing a single network to dynamically choose the optimal strategy for its use case.

<br/>

## 🧩 Ecosystem

The CipherLedger project is a **monorepo** containing the following first-class components:

| Component | Language | Description |
|---|---|---|
| **`/src`** (Core Node) | ☕ Java 21 | The blockchain engine: consensus, mining, CLVM, P2P, REST & WebSocket APIs |
| **`cipherledger-ui`** | ⚛️ React 18 | Block explorer, wallet dashboard & enterprise analytics UI |
| **`cipherledger-java-sdk`** | ☕ Java | Official Java client library for backend integrations |
| **`cipherledger-js-sdk`** | 🟨 JavaScript | Official JavaScript/Node.js client library |
| **`cipherledger-wallet-extension`** | 🌐 Browser | Chromium wallet extension for key management & signing |
| **`k8s/`** | ⎈ YAML | Production Kubernetes deployment manifests |
| **`config/`** | 📊 YAML | Prometheus & Grafana monitoring configuration |
| **`docs/`** | 📚 Markdown | Deep-dive technical documentation |

<br/>

---

## ✨ Core Features

<br/>

### 🔀 Multi-Consensus Engine
Hot-swap between four consensus algorithms **without restarting the network**:
- **⛏ Proof of Work (PoW)** — Classic Nakamoto consensus with dynamic difficulty
- **🏦 Proof of Stake (PoS)** — Energy-efficient staking with coin-age weighting
- **🗳 Delegated Proof of Stake (DPoS)** — High-TPS governance by elected delegates
- **🤝 PBFT** — Deterministic finality for enterprise consortiums

### 💻 CipherLedger Virtual Machine (CLVM)
A custom **stack-based, Turing-complete VM** that executes smart contract bytecode deterministically across all nodes. Features include:
- ⛽ Gas metering to prevent infinite loops
- 🔒 Fully sandboxed execution environment
- 📡 Event emission system for dApp reactivity

### 🪙 Native Token & NFT Protocol
Fungible tokens and NFTs are **first-class citizens at the protocol level** — no fragile wrapper contracts needed:
- Define tokens with custom symbol, supply, and decimals
- Mint NFTs into collections with IPFS-backed metadata
- Use the built-in **NFT Marketplace** engine for trustless trading

### 🔐 State-of-the-Art Cryptography
| Primitive | Algorithm |
|---|---|
| Block & Tx Hashing | SHA-256 |
| Digital Signatures | ECDSA (secp256k1) |
| Address Encoding | Base58Check |
| Block Integrity | Merkle Trees |
| Auth Tokens | JWT (RS256) |

<br/>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Backend** | Java 21 · Spring Boot 3 · Maven |
| **Database** | MongoDB · Redis |
| **Frontend** | React 18 · Vite · React Router |
| **Crypto** | BouncyCastle · SHA-256 · ECDSA |
| **Networking** | Spring WebSocket · Custom TCP P2P |
| **Monitoring** | Prometheus · Grafana · Logback |
| **DevOps** | Docker · Docker Compose · Kubernetes |
| **Testing** | JUnit 5 · Spring Test |

</div>

<br/>

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CipherLedger Node                           │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────────────────────────┐  │
│  │  REST / WS   │───▶│              API Layer                   │  │
│  │    API       │    │  (AuthController, BlockchainController,   │  │
│  └──────────────┘    │   TransactionController, NFTController)  │  │
│                      └──────────────────┬───────────────────────┘  │
│                                         │                           │
│  ┌──────────────┐    ┌──────────────────▼───────────────────────┐  │
│  │   P2P Peers  │───▶│             Service Layer                │  │
│  │  (P2PServer  │    │  (BlockchainService, MiningOrchestrator, │  │
│  │   P2PClient) │    │   TokenEngine, NFTEngine, AIAudit...)    │  │
│  └──────────────┘    └──────────────────┬───────────────────────┘  │
│                                         │                           │
│  ┌────────────────────────────────────┐ │ ┌──────────────────────┐ │
│  │       Consensus Engine             │ │ │   CLVM (VM Layer)    │ │
│  │  PoW │ PoS │ DPoS │ PBFT           │◀┘ │  Smart Contracts     │ │
│  └────────────────────────────────────┘   └──────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Storage Layer                           │   │
│  │         MongoDB (Blocks) · Redis (Cache/State)              │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Java 21+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Docker & Docker Compose** — [Download](https://www.docker.com/products/docker-desktop)

<br/>

### Option 1 — Run with Docker (Recommended)

The fastest way to get a full environment up:

```bash
# Clone the repository
git clone https://github.com/Het-2004/CipherLedger.git
cd CipherLedger

# Start a full multi-node network + monitoring stack
docker-compose -f docker-compose.multi-node.yml -f docker-compose.monitoring.yml up -d
```

> **Access Points:**
> - 🌐 UI Explorer: `http://localhost:5173`
> - 🔗 Node API: `http://localhost:8080`
> - 📊 Grafana: `http://localhost:3000`

<br/>

### Option 2 — Run Locally (Development)

**Step 1: Start the Backend Node**
```bash
# Build the project
mvn clean install -DskipTests

# Run the Spring Boot node
mvn spring-boot:run
```

**Step 2: Start the Frontend UI**
```bash
cd cipherledger-ui
npm install
npm run dev
```

The UI will be live at `http://localhost:5173` ✅

<br/>

### Option 3 — Kubernetes Deployment

```bash
# Apply database services
kubectl apply -f k8s/redis-mongodb-deployment.yaml

# Apply the CipherLedger node deployment
kubectl apply -f k8s/cipherledger-deployment.yaml
kubectl apply -f k8s/cipherledger-service.yaml
```

For a full K8s guide, see **[Deployment Docs →](docs/deployment.md)**

<br/>

---

## 🌐 API Reference

All API calls require a JWT Bearer token obtained from `POST /api/auth/login`.

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate and get JWT |
| `POST` | `/api/wallet/create` | Generate a new wallet |
| `GET` | `/api/wallet/balance/{address}` | Get UTXO balance |
| `POST` | `/api/transaction/send` | Submit a signed transaction |
| `GET` | `/api/blockchain/blocks` | Get latest blocks |
| `GET` | `/api/blockchain/block/{hash}` | Get block by hash |
| `POST` | `/api/contract/deploy` | Deploy CLVM bytecode |
| `POST` | `/api/contract/invoke` | Invoke smart contract |
| `GET` | `/api/nft/collections` | List all NFT collections |
| `POST` | `/api/nft/mint` | Mint a new NFT |

📖 **Full API Reference → [docs/api_reference.md](docs/api_reference.md)**

**WebSocket**: Connect to `ws://localhost:8080/ws/blocks` for real-time block events.

<br/>

---

## 📚 Documentation

| Document | Description |
|---|---|
| [🏛 Architecture](docs/architecture.md) | Core system design, data flow & component roles |
| [⚖️ Consensus](docs/consensus.md) | PoW, PoS, DPoS, PBFT deep-dive |
| [💻 Smart Contracts & CLVM](docs/smart_contracts.md) | VM opcodes, gas, contract lifecycle |
| [🎨 Tokens & NFTs](docs/nfts_and_tokens.md) | Token issuance, NFT minting & marketplace |
| [🚢 Deployment](docs/deployment.md) | Docker, Kubernetes & monitoring setup |
| [🌐 API Reference](docs/api_reference.md) | Complete REST & WebSocket endpoint reference |

<br/>

---

## 📂 Project Structure

```
CipherLedger/
├── src/main/java/com/het/cipherledger/
│   ├── api/              # REST Controllers (Blockchain, Auth, NFT, AI Audit...)
│   ├── blockchain/       # Core Blockchain, Validator, Genesis Block
│   ├── consensus/        # PoW, PoS, DPoS, PBFT engines
│   ├── contract/         # Smart Contract Engine
│   ├── crypto/           # SHA-256, ECDSA, Merkle Tree, Base58, JWT
│   ├── mining/           # Miner, ProofOfWork, Difficulty adjustment
│   ├── model/            # Block, Transaction, UTXO, Token, NFT, User
│   ├── network/          # P2PServer, P2PClient, Peer discovery
│   ├── security/         # Spring Security Config, JWT Filter
│   ├── service/          # Business logic (Blockchain, NFT, AI, Token...)
│   ├── storage/          # Pluggable storage layer
│   ├── transaction/      # Pool, Processor, Validator
│   ├── vm/               # CLVM (CipherLedger Virtual Machine)
│   ├── wallet/           # Wallet, WalletManager, WalletService
│   └── websocket/        # Real-time block streaming
│
├── cipherledger-ui/      # React 18 Block Explorer & Dashboard
├── cipherledger-java-sdk/ # Official Java SDK
├── cipherledger-js-sdk/  # Official JavaScript SDK
├── cipherledger-wallet-extension/ # Browser Wallet Extension
├── k8s/                  # Kubernetes manifests
├── config/               # Prometheus & monitoring config
├── docs/                 # 📚 Detailed documentation
└── docker-compose*.yml   # Docker environment configs
```

<br/>

---

## 🤝 Contributing

Contributions are what make open source amazing! Here's how to get started:

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

Please ensure all tests pass before submitting: `mvn test`

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

<div align="center">

<br/>

**Built with ❤️ by [Het](https://github.com/Het-2004)**

<br/>

*⭐ Star this repo if you find it useful — it really helps!*

</div>
