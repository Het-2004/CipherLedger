package com.het.cipherledger.model;

public class Token {
    
    private String symbol;
    private String name;
    private String creatorAddress;
    private double totalSupply;
    private int decimals;

    public Token() {
    }

    public Token(String symbol, String name, String creatorAddress, double initialSupply, int decimals) {
        this.symbol = symbol;
        this.name = name;
        this.creatorAddress = creatorAddress;
        this.totalSupply = 0; // Starts at 0, incremented during minting
        this.decimals = decimals;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatorAddress() {
        return creatorAddress;
    }

    public void setCreatorAddress(String creatorAddress) {
        this.creatorAddress = creatorAddress;
    }

    public double getTotalSupply() {
        return totalSupply;
    }

    public void setTotalSupply(double totalSupply) {
        this.totalSupply = totalSupply;
    }

    public int getDecimals() {
        return decimals;
    }

    public void setDecimals(int decimals) {
        this.decimals = decimals;
    }
}
