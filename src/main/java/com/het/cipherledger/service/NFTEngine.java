package com.het.cipherledger.service;

import com.het.cipherledger.model.NFT;
import com.het.cipherledger.model.NFTCollection;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NFTEngine {

    private final Map<String, NFTCollection> collections = new HashMap<>();
    private final Map<String, NFT> nfts = new HashMap<>();

    public synchronized NFTCollection createCollection(String name, String symbol, String creator) {
        NFTCollection collection = new NFTCollection(name, symbol, creator);
        collections.put(collection.getCollectionId(), collection);
        return collection;
    }

    public synchronized NFT mintNFT(String collectionId, String to, String metadataURI) {
        if (!collections.containsKey(collectionId)) {
            throw new IllegalArgumentException("Collection does not exist.");
        }
        
        NFT nft = new NFT(collectionId, to, metadataURI);
        nfts.put(nft.getTokenId(), nft);
        return nft;
    }

    public synchronized void transferNFT(String tokenId, String from, String to) {
        if (!nfts.containsKey(tokenId)) {
            throw new IllegalArgumentException("NFT does not exist.");
        }
        
        NFT nft = nfts.get(tokenId);
        
        if (!nft.getOwnerAddress().equals(from)) {
            throw new IllegalArgumentException("Sender does not own this NFT.");
        }
        
        nft.setOwnerAddress(to);
    }

    public NFT getNFT(String tokenId) {
        return nfts.get(tokenId);
    }

    public NFTCollection getCollection(String collectionId) {
        return collections.get(collectionId);
    }
}
