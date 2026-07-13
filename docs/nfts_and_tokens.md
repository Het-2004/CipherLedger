# 🎨 Tokens & NFTs

CipherLedger natively supports both fungible tokens and Non-Fungible Tokens (NFTs) at the protocol level, avoiding the need for complex, vulnerable smart contracts for basic token issuance.

## Fungible Tokens
Fungible tokens operate similarly to ERC-20 but are handled natively by the `TokenEngine`.

- **Issuance**: Users can mint new tokens by defining a symbol, total supply, and decimals.
- **Transfers**: Tokens are transferred using standard UTXO logic, making token transfers as secure and fast as native coin transfers.

## Non-Fungible Tokens (NFTs)
The `NFTEngine` manages unique digital assets.

- **Collections**: NFTs are grouped into Collections.
- **Metadata**: Native support for off-chain metadata (IPFS URIs) combined with on-chain cryptographic proofs.
- **Marketplace**: CipherLedger includes native logic for listing, buying, and selling NFTs without requiring a third-party smart contract exchange.
