# 🌐 API Reference

CipherLedger provides a robust RESTful API and WebSocket interface.

## REST Endpoints

### Wallet & Auth
- `POST /api/auth/login`: Authenticate and receive JWT.
- `POST /api/wallet/create`: Generate a new wallet address and keys.
- `GET /api/wallet/balance/{address}`: Retrieve UTXO balance.

### Blockchain Explorer
- `GET /api/blockchain/blocks`: Retrieve the latest blocks.
- `GET /api/blockchain/block/{hash}`: Get specific block details.

### Transactions
- `POST /api/transaction/send`: Submit a new signed transaction.
- `GET /api/transaction/{txId}`: Look up transaction status.

### Smart Contracts
- `POST /api/contract/deploy`: Deploy CLVM bytecode.
- `POST /api/contract/invoke`: Trigger a smart contract function.

## WebSockets
Connect to `/ws/blocks` to receive real-time updates whenever a new block is mined or validated by the consensus engine.
