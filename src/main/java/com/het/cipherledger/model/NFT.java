package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;

public class NFT {

    private String tokenId;
    private String collectionId;
    private String ownerAddress;
    private String creatorAddress;
    private String metadataURI;

    public NFT() {}

    public NFT(String collectionId, String creatorAddress, String metadataURI) {
        this.collectionId = collectionId;
        this.creatorAddress = creatorAddress;
        this.ownerAddress = creatorAddress; // Creator owns initially
        this.metadataURI = metadataURI;
        this.tokenId = HashUtil.generateHash(collectionId + creatorAddress + metadataURI + System.currentTimeMillis());
    }

    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }

    public String getCollectionId() { return collectionId; }
    public void setCollectionId(String collectionId) { this.collectionId = collectionId; }

    public String getOwnerAddress() { return ownerAddress; }
    public void setOwnerAddress(String ownerAddress) { this.ownerAddress = ownerAddress; }

    public String getCreatorAddress() { return creatorAddress; }
    public void setCreatorAddress(String creatorAddress) { this.creatorAddress = creatorAddress; }

    public String getMetadataURI() { return metadataURI; }
    public void setMetadataURI(String metadataURI) { this.metadataURI = metadataURI; }
}
