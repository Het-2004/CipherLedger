package com.het.cipherledger.service;

import com.het.cipherledger.model.NFT;
import com.het.cipherledger.model.NFTListing;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NFTMarketplace {

    private final NFTEngine nftEngine;
    private final TokenEngine tokenEngine;
    
    // tokenId -> Listing
    private final Map<String, NFTListing> listings = new HashMap<>();

    public NFTMarketplace(NFTEngine nftEngine, TokenEngine tokenEngine) {
        this.nftEngine = nftEngine;
        this.tokenEngine = tokenEngine;
    }

    public synchronized NFTListing listNFT(String tokenId, String sellerAddress, double priceInCLD) {
        NFT nft = nftEngine.getNFT(tokenId);
        
        if (nft == null) {
            throw new IllegalArgumentException("NFT does not exist.");
        }
        
        if (!nft.getOwnerAddress().equals(sellerAddress)) {
            throw new IllegalArgumentException("Only the owner can list this NFT.");
        }
        
        if (priceInCLD <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero.");
        }

        NFTListing listing = new NFTListing(tokenId, sellerAddress, priceInCLD);
        listings.put(tokenId, listing);
        return listing;
    }

    public synchronized void buyNFT(String tokenId, String buyerAddress) {
        if (!listings.containsKey(tokenId)) {
            throw new IllegalArgumentException("NFT is not listed for sale.");
        }
        
        NFTListing listing = listings.get(tokenId);
        
        if (listing.getSellerAddress().equals(buyerAddress)) {
            throw new IllegalArgumentException("Seller cannot buy their own NFT.");
        }
        
        // 1. Transfer CLD funds (This will throw exception if buyer has insufficient balance)
        tokenEngine.transfer("CLD", buyerAddress, listing.getSellerAddress(), listing.getPriceInCLD());
        
        // 2. Transfer NFT ownership
        nftEngine.transferNFT(tokenId, listing.getSellerAddress(), buyerAddress);
        
        // 3. Remove from listings
        listings.remove(tokenId);
    }

    public NFTListing getListing(String tokenId) {
        return listings.get(tokenId);
    }
}
