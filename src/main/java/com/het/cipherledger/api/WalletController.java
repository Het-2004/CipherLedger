package com.het.cipherledger.api;

import com.het.cipherledger.wallet.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private final WalletManager manager = new WalletManager();
    private final com.het.cipherledger.service.TokenEngine tokenEngine;
    private Wallet currentWallet = null;

    public WalletController(com.het.cipherledger.service.TokenEngine tokenEngine) {
        this.tokenEngine = tokenEngine;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(){
        Wallet wallet = manager.createWallet();
        currentWallet = wallet;
        tokenEngine.mint("CLD", wallet.getAddress(), 1000.0);

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("address", wallet.getAddress());
        response.put("publicKey", java.util.Base64.getEncoder().encodeToString(wallet.getPublicKey().getEncoded()));
        response.put("privateKey", java.util.Base64.getEncoder().encodeToString(wallet.getPrivateKey().getEncoded()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentWallet() {
        if (currentWallet == null) {
            Wallet wallet = manager.createWallet();
            currentWallet = wallet;
            tokenEngine.mint("CLD", wallet.getAddress(), 1000.0);
        }
        
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("address", currentWallet.getAddress());
        response.put("publicKey", java.util.Base64.getEncoder().encodeToString(currentWallet.getPublicKey().getEncoded()));
        response.put("privateKey", java.util.Base64.getEncoder().encodeToString(currentWallet.getPrivateKey().getEncoded()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{address}")
    public ResponseEntity<?> getBalance(@PathVariable String address) {
        double balance = tokenEngine.getBalance("CLD", address);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("address", address);
        response.put("balance", balance);
        return ResponseEntity.ok(response);
    }
}