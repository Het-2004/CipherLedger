package com.het.cipherledger.model;

public class NFTListing {

    private String tokenId;
    private String sellerAddress;
    private double priceInCLD;

    public NFTListing() {}

    public NFTListing(String tokenId, String sellerAddress, double priceInCLD) {
        this.tokenId = tokenId;
        this.sellerAddress = sellerAddress;
        this.priceInCLD = priceInCLD;
    }

    public String getTokenId() { return tokenId; }
    public void setTokenId(String tokenId) { this.tokenId = tokenId; }

    public String getSellerAddress() { return sellerAddress; }
    public void setSellerAddress(String sellerAddress) { this.sellerAddress = sellerAddress; }

    public double getPriceInCLD() { return priceInCLD; }
    public void setPriceInCLD(double priceInCLD) { this.priceInCLD = priceInCLD; }
}
