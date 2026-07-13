package com.het.cipherledger.nft;

import com.het.cipherledger.model.NFT;
import com.het.cipherledger.model.NFTCollection;
import com.het.cipherledger.model.NFTListing;
import com.het.cipherledger.service.NFTEngine;
import com.het.cipherledger.service.NFTMarketplace;
import com.het.cipherledger.service.TokenEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class NFTMarketplaceTest {

    private NFTEngine nftEngine;
    private TokenEngine tokenEngine;
    private NFTMarketplace marketplace;

    @BeforeEach
    public void setup() {
        nftEngine = new NFTEngine();
        tokenEngine = new TokenEngine();
        marketplace = new NFTMarketplace(nftEngine, tokenEngine);
    }

    @Test
    public void testListAndBuy() {
        // Setup buyer with CLD tokens
        tokenEngine.mint("CLD", "buyer1", 500.0);
        
        // Setup seller with an NFT
        NFTCollection collection = nftEngine.createCollection("Art", "ART", "seller1");
        NFT nft = nftEngine.mintNFT(collection.getCollectionId(), "seller1", "ipfs://art");
        
        // 1. Seller lists NFT for 100 CLD
        NFTListing listing = marketplace.listNFT(nft.getTokenId(), "seller1", 100.0);
        assertNotNull(listing);
        assertEquals(100.0, listing.getPriceInCLD());
        
        // 2. Buyer buys NFT
        marketplace.buyNFT(nft.getTokenId(), "buyer1");
        
        // 3. Verify Ownership Transfer
        assertEquals("buyer1", nftEngine.getNFT(nft.getTokenId()).getOwnerAddress());
        
        // 4. Verify CLD Token Transfer
        assertEquals(400.0, tokenEngine.getBalance("CLD", "buyer1")); // 500 - 100
        assertEquals(100.0, tokenEngine.getBalance("CLD", "seller1")); // 0 + 100
        
        // 5. Verify listing is removed
        assertNull(marketplace.getListing(nft.getTokenId()));
    }
}
