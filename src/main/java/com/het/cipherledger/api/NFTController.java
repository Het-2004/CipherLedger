package com.het.cipherledger.api;

import com.het.cipherledger.model.NFT;
import com.het.cipherledger.model.NFTCollection;
import com.het.cipherledger.model.NFTListing;
import com.het.cipherledger.service.NFTEngine;
import com.het.cipherledger.service.NFTMarketplace;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nft")
@CrossOrigin(origins = "*")
public class NFTController {

    private final NFTEngine nftEngine;
    private final NFTMarketplace nftMarketplace;

    public NFTController(NFTEngine nftEngine, NFTMarketplace nftMarketplace) {
        this.nftEngine = nftEngine;
        this.nftMarketplace = nftMarketplace;
    }

    @PostMapping("/collections")
    public ResponseEntity<NFTCollection> createCollection(@RequestBody Map<String, String> payload) {
        NFTCollection collection = nftEngine.createCollection(
                payload.get("name"),
                payload.get("symbol"),
                payload.get("creator")
        );
        return ResponseEntity.ok(collection);
    }

    @PostMapping("/mint")
    public ResponseEntity<NFT> mintNFT(@RequestBody Map<String, String> payload) {
        NFT nft = nftEngine.mintNFT(
                payload.get("collectionId"),
                payload.get("to"),
                payload.get("metadataURI")
        );
        return ResponseEntity.ok(nft);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferNFT(@RequestBody Map<String, String> payload) {
        nftEngine.transferNFT(
                payload.get("tokenId"),
                payload.get("from"),
                payload.get("to")
        );
        return ResponseEntity.ok("Successfully transferred NFT " + payload.get("tokenId"));
    }

    @PostMapping("/marketplace/list")
    public ResponseEntity<NFTListing> listNFT(@RequestBody Map<String, Object> payload) {
        NFTListing listing = nftMarketplace.listNFT(
                (String) payload.get("tokenId"),
                (String) payload.get("seller"),
                Double.parseDouble(payload.get("price").toString())
        );
        return ResponseEntity.ok(listing);
    }

    @PostMapping("/marketplace/buy")
    public ResponseEntity<String> buyNFT(@RequestBody Map<String, String> payload) {
        nftMarketplace.buyNFT(
                payload.get("tokenId"),
                payload.get("buyer")
        );
        return ResponseEntity.ok("Successfully purchased NFT " + payload.get("tokenId"));
    }

    @GetMapping("/{tokenId}")
    public ResponseEntity<NFT> getNFT(@PathVariable String tokenId) {
        return ResponseEntity.ok(nftEngine.getNFT(tokenId));
    }
}
