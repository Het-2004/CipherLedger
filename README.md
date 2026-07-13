<div align="center">

<img src="assets/banner.png" alt="CipherLedger Banner" width="100%"/>

<br/>
<br/>

<!-- CORE TECH BADGES -->
<p>
  <img src="https://img.shields.io/badge/Java-21-FF6B35?style=for-the-badge&logo=openjdk&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  &nbsp;
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge&logo=opensourceinitiative&logoColor=white"/>
</p>

<!-- STATUS BADGES -->
<p>
  <img src="https://img.shields.io/badge/Build-Passing-22c55e?style=flat-square&logo=github-actions&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Consensus-PoW%20%7C%20PoS%20%7C%20DPoS%20%7C%20PBFT-6366f1?style=flat-square"/>
  &nbsp;
  <img src="https://img.shields.io/badge/CLVM-Turing%20Complete-0ea5e9?style=flat-square"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Version-1.0.0-f59e0b?style=flat-square"/>
</p>

<br/>

<h3>⛓️ Next-Generation Enterprise Blockchain Ecosystem ⛓️</h3>

<p><em>Built from scratch in Java · Custom VM · Multi-Consensus · Native NFTs & Tokens · Full SDKs</em></p>

<br/>

<a href="#-overview">Overview</a>&ensp;•&ensp;
<a href="#-ecosystem">Ecosystem</a>&ensp;•&ensp;
<a href="#-features">Features</a>&ensp;•&ensp;
<a href="#-architecture">Architecture</a>&ensp;•&ensp;
<a href="#-quick-start">Quick Start</a>&ensp;•&ensp;
<a href="#-api-reference">API</a>&ensp;•&ensp;
<a href="#-documentation">Docs</a>&ensp;•&ensp;
<a href="#-contributing">Contribute</a>

</div>

---

## 🌌 Overview

**CipherLedger** is a production-ready, modular blockchain platform built for real-world enterprise deployment. Engineered entirely from scratch in **Java 21** with **Spring Boot**, it is one of the few blockchain implementations that features:

- A **custom Virtual Machine (CLVM)** for smart contract execution
- **4 hot-swappable consensus engines** — no restart required
- **Native NFT & Token protocols** built into the core (no fragile wrapper contracts)
- A **complete developer ecosystem** including Java SDK, JS SDK, UI Explorer, and a Browser Wallet Extension

> 💡 **CipherLedger breaks the blockchain trilemma** by letting you choose the optimal consensus strategy — PoW for permissionless security, PBFT for instant enterprise finality, DPoS for ultra-high TPS.

<br/>

---

## 🧩 Ecosystem

<div align="center">

| Component | Language | Description |
|:---:|:---:|:---|
| 🟧 **Core Node** (`/src`) | Java 21 | Blockchain engine: consensus, mining, CLVM, P2P, REST & WebSocket APIs |
| ⚛️ **UI Explorer** (`cipherledger-ui`) | React 18 | Block explorer, wallet dashboard & enterprise analytics |
| ☕ **Java SDK** (`cipherledger-java-sdk`) | Java 21 | Official Java client library for backend integrations |
| 🟨 **JS SDK** (`cipherledger-js-sdk`) | JavaScript | Official JavaScript/Node.js client library |
| 🌐 **Wallet Extension** (`cipherledger-wallet-extension`) | Browser | Chromium extension for key management & tx signing |
| ⎈ **K8s Manifests** (`k8s/`) | YAML | Production-ready Kubernetes deployment configs |
| 📊 **Monitoring** (`config/`) | YAML | Prometheus scrape config + Grafana dashboards |
| 📚 **Docs** (`docs/`) | Markdown | Deep-dive technical documentation |

</div>

<br/>

---

## ✨ Features

<br/>

### 🔀 Multi-Consensus Engine

Hot-swap between **four consensus algorithms** without network restarts:

<div align="center">

| ⛏️ Proof of Work | 🏦 Proof of Stake | 🗳️ Delegated PoS | 🤝 PBFT |
|:---:|:---:|:---:|:---:|
| Classic Nakamoto | Eco-friendly staking | Elected delegates | Byzantine fault tolerant |
| Dynamic difficulty | Coin-age weighting | Ultra-high TPS | Instant finality |
| Sybil-resistant | No energy waste | Democratic governance | Enterprise consortiums |

</div>

> Configure in `application.properties` → `blockchain.consensus.type=POW|POS|DPOS|PBFT`

<br/>

### 💻 CipherLedger Virtual Machine (CLVM)

A **stack-based, Turing-complete VM** purpose-built for deterministic smart contract execution:

```
┌─────────────────────────────────────────────────────────┐
│                    CLVM Execution                       │
│                                                         │
│  Bytecode Input → Parser → Opcode Executor              │
│       ↓                         ↓                       │
│  Gas Metering ←→ Stack Engine ←→ State Storage          │
│       ↓                         ↓                       │
│  Event Emitter              Result / Revert             │
└─────────────────────────────────────────────────────────┘
```

- ⛽ **Gas metering** prevents halting-problem exploits
- 🔒 **Fully sandboxed** — no host system access
- 📡 **Event system** for real-time dApp reactivity
- 🧮 Opcodes: `PUSH`, `ADD`, `SUB`, `MUL`, `STORE`, `LOAD`, `CALL` and more

<br/>

### 🪙 Native Digital Assets

Tokens & NFTs are **first-class citizens** at the protocol layer:

<div align="center">

| 🟡 Fungible Tokens | 🎨 NFTs |
|:---|:---|
| Custom symbol, supply & decimals | Grouped into named Collections |
| UTXO-based transfers (same security as native coins) | IPFS-backed metadata with on-chain proofs |
| Atomic swaps supported | Built-in **NFT Marketplace** engine |

</div>

<br/>

### 🔐 Cryptographic Primitives

<div align="center">

| Primitive | Algorithm | Purpose |
|:---:|:---:|:---:|
| **Hashing** | `SHA-256` | Block & transaction integrity |
| **Signatures** | `ECDSA (secp256k1)` | Wallet key-pairs & tx signing |
| **Address Encoding** | `Base58Check` | Human-readable addresses |
| **Block Integrity** | `Merkle Trees` | Efficient state verification |
| **Authentication** | `JWT (RS256)` | Secure API access |
| **P2P Transport** | `TCP + WebSocket` | Node communication |

</div>

<br/>

---

## 🛠 Tech Stack

<div align="center">

| Layer | Technologies |
|:---:|:---|
| 🔷 **Backend** | Java 21 · Spring Boot 3 · Spring Security · Maven |
| 🗄️ **Database** | MongoDB (block storage) · Redis (cache & state) |
| ⚛️ **Frontend** | React 18 · Vite · React Router 6 |
| 🔐 **Cryptography** | BouncyCastle · SHA-256 · ECDSA · Merkle Trees |
| 🌐 **Networking** | Spring WebSocket · Custom TCP P2P Sockets |
| 📊 **Monitoring** | Prometheus · Grafana · Logback · Spring Actuator |
| 🐳 **DevOps** | Docker · Docker Compose · Kubernetes |
| 🧪 **Testing** | JUnit 5 · Spring Test · Mockito |

</div>

<br/>

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CipherLedger Node                              │
│                                                                         │
│  ┌──────────────┐    ┌──────────────────────────────────────────────┐  │
│  │  REST / WS   │───▶│                 API Layer                    │  │
│  │    API       │    │  AuthController · BlockchainController        │  │
│  └──────────────┘    │  TransactionController · NFTController        │  │
│                      │  AIAuditController · WalletController         │  │
│  ┌──────────────┐    └─────────────────────┬────────────────────────┘  │
│  │  P2P Network │                          │                            │
│  │  P2PServer   │───▶ ┌────────────────────▼────────────────────────┐  │
│  │  P2PClient   │     │             Service Layer                    │  │
│  │  Peer Disco. │     │  BlockchainService · MiningOrchestrator      │  │
│  └──────────────┘     │  TokenEngine · NFTEngine · AIEngineService   │  │
│                       └──────────┬──────────────────┬───────────────┘  │
│                                  │                  │                   │
│  ┌───────────────────────────────▼──┐  ┌────────────▼──────────────┐  │
│  │       Consensus Engine           │  │   CLVM (Smart Contracts)  │  │
│  │  PoW │ PoS │ DPoS │ PBFT         │  │  Opcodes · Gas · Events   │  │
│  │  ValidatorRegistry               │  │  Sandboxed Execution      │  │
│  └───────────────────────────────┬──┘  └──────────────┬────────────┘  │
│                                  │                     │               │
│  ┌───────────────────────────────▼─────────────────────▼───────────┐  │
│  │                       Storage Layer                              │  │
│  │     MongoDB (Blocks · Contracts · NFTs)   Redis (Cache/State)   │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

        ↑                                                  ↑
 React UI + WS                                     Java SDK / JS SDK
 (Block Explorer)                                  (External Clients)
```

<br/>

---

## 🚀 Quick Start

### ✅ Prerequisites

| Tool | Version | Download |
|:---:|:---:|:---:|
| ☕ Java JDK | 21+ | [Adoptium](https://adoptium.net/) |
| 📦 Maven | 3.8+ | [maven.apache.org](https://maven.apache.org/) |
| 🟢 Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| 🐳 Docker | Latest | [docker.com](https://www.docker.com/) |

<br/>

### 🐳 Option 1 — Docker (Recommended)

The fastest way to get a full environment running:

```bash
# Clone the repository
git clone https://github.com/Het-2004/CipherLedger.git
cd CipherLedger

# Launch multi-node network + full monitoring stack
docker-compose -f docker-compose.multi-node.yml \
               -f docker-compose.monitoring.yml up -d
```

| Service | URL |
|:---|:---|
| 🌐 UI Explorer | http://localhost:5173 |
| 🔗 Node REST API | http://localhost:8080 |
| 📊 Grafana | http://localhost:3000 |
| 📈 Prometheus | http://localhost:9090 |

<br/>

### 💻 Option 2 — Local Development

**Backend Node:**
```bash
# Build all modules
mvn clean install -DskipTests

# Start the Spring Boot blockchain node
mvn spring-boot:run
```

**Frontend Explorer:**
```bash
cd cipherledger-ui
npm install
npm run dev
# → http://localhost:5173 ✅
```

<br/>

### ⎈ Option 3 — Kubernetes

```bash
# Deploy databases
kubectl apply -f k8s/redis-mongodb-deployment.yaml

# Deploy CipherLedger node
kubectl apply -f k8s/cipherledger-deployment.yaml
kubectl apply -f k8s/cipherledger-service.yaml
```

📖 Full guide → **[Deployment Docs](docs/deployment.md)**

<br/>

---

## 🌐 API Reference

> All endpoints require `Authorization: Bearer <JWT>` — obtain from `POST /api/auth/login`

### 🔑 Auth & Wallet

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/auth/login` | Authenticate, receive JWT token |
| `POST` | `/api/wallet/create` | Generate new wallet keypair |
| `GET` | `/api/wallet/balance/{address}` | Fetch UTXO balance |

### ⛓️ Blockchain

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/blockchain/blocks` | List latest blocks |
| `GET` | `/api/blockchain/block/{hash}` | Fetch block by hash |
| `POST` | `/api/transaction/send` | Submit a signed transaction |
| `GET` | `/api/transaction/{txId}` | Transaction status lookup |

### 💻 Smart Contracts

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/api/contract/deploy` | Deploy CLVM bytecode |
| `POST` | `/api/contract/invoke` | Invoke contract function |

### 🎨 NFTs & Tokens

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/nft/collections` | List all NFT collections |
| `POST` | `/api/nft/mint` | Mint a new NFT |
| `POST` | `/api/token/create` | Issue a new fungible token |

### 📡 WebSocket
Connect to `ws://localhost:8080/ws/blocks` for **real-time block streaming**.

📖 Full Reference → **[docs/api_reference.md](docs/api_reference.md)**

<br/>

---

## 📂 Project Structure

```
CipherLedger/
│
├── 📁 src/main/java/com/het/cipherledger/
│   ├── 🌐 api/              # REST Controllers (Auth, Blockchain, NFT, AI Audit...)
│   ├── ⛓️  blockchain/       # Core chain, Validator, Genesis Block
│   ├── ⚖️  consensus/        # PoW, PoS, DPoS, PBFT engines + ValidatorRegistry
│   ├── 📜 contract/         # Smart Contract engine
│   ├── 🔐 crypto/           # SHA-256, ECDSA, Merkle Tree, Base58, JWT
│   ├── ⛏️  mining/           # Miner, ProofOfWork, Difficulty adjustment
│   ├── 🧱 model/            # Block, Transaction, UTXO, Token, NFT, User
│   ├── 🌍 network/          # P2PServer, P2PClient, Peer discovery
│   ├── 🛡️  security/         # Spring Security Config, JWT Filter
│   ├── ⚙️  service/          # Business logic (Blockchain, NFT, AI, Token...)
│   ├── 💾 storage/          # Pluggable storage interface
│   ├── 💸 transaction/      # Pool, Processor, Validator
│   ├── 🖥️  vm/               # CLVM — CipherLedger Virtual Machine
│   ├── 👛 wallet/           # Wallet, WalletManager, WalletService
│   └── 📡 websocket/        # Real-time block streaming
│
├── ⚛️  cipherledger-ui/      # React 18 Block Explorer & Enterprise Dashboard
├── ☕ cipherledger-java-sdk/ # Official Java SDK
├── 🟨 cipherledger-js-sdk/  # Official JavaScript SDK
├── 🌐 cipherledger-wallet-extension/ # Browser Wallet Extension
├── ⎈  k8s/                  # Kubernetes deployment manifests
├── 📊 config/               # Prometheus & Grafana monitoring config
├── 📚 docs/                 # Comprehensive technical documentation
└── 🐳 docker-compose*.yml   # Docker environment configurations
```

<br/>

---

## 📚 Documentation

<div align="center">

| 📄 Document | 📝 Description |
|:---|:---|
| [🏛 Architecture](docs/architecture.md) | System design, data flow & component roles |
| [⚖️ Consensus](docs/consensus.md) | PoW, PoS, DPoS, PBFT — deep technical dive |
| [💻 Smart Contracts & CLVM](docs/smart_contracts.md) | VM opcodes, gas model, contract lifecycle |
| [🎨 Tokens & NFTs](docs/nfts_and_tokens.md) | Token issuance, NFT minting & marketplace protocol |
| [🚢 Deployment](docs/deployment.md) | Docker Compose, Kubernetes & monitoring setup |
| [🌐 API Reference](docs/api_reference.md) | Complete REST & WebSocket endpoint reference |

</div>

<br/>

---

## 🤝 Contributing

Contributions make open source great! Here's how to get involved:

```bash
# 1. Fork the repo and clone it
git clone https://github.com/YOUR_USERNAME/CipherLedger.git

# 2. Create a feature branch
git checkout -b feature/your-amazing-feature

# 3. Make changes, then run all tests
mvn test

# 4. Commit with a descriptive message
git commit -m "feat: add your amazing feature"

# 5. Push and open a Pull Request
git push origin feature/your-amazing-feature
```

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

<div align="center">

<br/>

**Built with ❤️ & ☕ by [Het Patel](https://github.com/Het-2004)**

<br/>

<a href="https://github.com/Het-2004/CipherLedger/stargazers">
  <img src="https://img.shields.io/github/stars/Het-2004/CipherLedger?style=social" alt="Stars"/>
</a>
&ensp;
<a href="https://github.com/Het-2004/CipherLedger/network/members">
  <img src="https://img.shields.io/github/forks/Het-2004/CipherLedger?style=social" alt="Forks"/>
</a>
&ensp;
<a href="https://github.com/Het-2004/CipherLedger/issues">
  <img src="https://img.shields.io/github/issues/Het-2004/CipherLedger?style=social" alt="Issues"/>
</a>

<br/>
<br/>

⭐ **If CipherLedger helped you, please consider giving it a star — it means a lot!** ⭐

<br/>

</div>
