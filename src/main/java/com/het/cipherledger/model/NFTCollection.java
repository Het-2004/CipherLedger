package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;

public class NFTCollection {

    private String collectionId;
    private String name;
    private String symbol;
    private String creatorAddress;

    public NFTCollection() {}

    public NFTCollection(String name, String symbol, String creatorAddress) {
        this.name = name;
        this.symbol = symbol;
        this.creatorAddress = creatorAddress;
        this.collectionId = HashUtil.generateHash(name + symbol + creatorAddress + System.currentTimeMillis());
    }

    public String getCollectionId() { return collectionId; }
    public void setCollectionId(String collectionId) { this.collectionId = collectionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getCreatorAddress() { return creatorAddress; }
    public void setCreatorAddress(String creatorAddress) { this.creatorAddress = creatorAddress; }
}
