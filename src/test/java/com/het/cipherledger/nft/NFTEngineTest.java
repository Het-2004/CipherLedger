package com.het.cipherledger.nft;

import com.het.cipherledger.model.NFT;
import com.het.cipherledger.model.NFTCollection;
import com.het.cipherledger.service.NFTEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class NFTEngineTest {

    private NFTEngine engine;

    @BeforeEach
    public void setup() {
        engine = new NFTEngine();
    }

    @Test
    public void testCreateCollection() {
        NFTCollection collection = engine.createCollection("Bored Apes", "BAYC", "creator1");
        assertNotNull(collection.getCollectionId());
        assertEquals("Bored Apes", collection.getName());
    }

    @Test
    public void testMintAndTransfer() {
        NFTCollection collection = engine.createCollection("CryptoPunks", "PUNK", "creator1");
        
        NFT nft = engine.mintNFT(collection.getCollectionId(), "user1", "ipfs://metadata-url");
        assertNotNull(nft.getTokenId());
        assertEquals("user1", nft.getOwnerAddress());
        
        engine.transferNFT(nft.getTokenId(), "user1", "user2");
        assertEquals("user2", engine.getNFT(nft.getTokenId()).getOwnerAddress());
        
        assertThrows(IllegalArgumentException.class, () -> {
            // User1 no longer owns it, should fail
            engine.transferNFT(nft.getTokenId(), "user1", "user3");
        });
    }
}
