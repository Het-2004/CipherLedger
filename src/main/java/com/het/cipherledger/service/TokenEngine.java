package com.het.cipherledger.service;

import com.het.cipherledger.model.Token;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TokenEngine {

    // TokenSymbol -> Token metadata
    private final Map<String, Token> tokenRegistry = new HashMap<>();

    // TokenSymbol -> (WalletAddress -> Balance)
    private final Map<String, Map<String, Double>> ledgers = new HashMap<>();

    public TokenEngine() {
        // Bootstrap the native CLD token
        createToken("CLD", "CipherLedger Token", "GENESIS", 21_000_000.0, 18);
    }

    public synchronized Token createToken(String symbol, String name, String creator, double initialSupply, int decimals) {
        if (tokenRegistry.containsKey(symbol)) {
            throw new IllegalArgumentException("Token symbol already exists: " + symbol);
        }
        
        Token token = new Token(symbol, name, creator, initialSupply, decimals);
        tokenRegistry.put(symbol, token);
        ledgers.put(symbol, new HashMap<>());
        
        if (initialSupply > 0) {
            mint(symbol, creator, initialSupply);
        }
        
        return token;
    }

    public synchronized void mint(String symbol, String to, double amount) {
        verifyTokenExists(symbol);
        
        Map<String, Double> ledger = ledgers.get(symbol);
        ledger.put(to, ledger.getOrDefault(to, 0.0) + amount);
        
        // Increase total supply
        Token token = tokenRegistry.get(symbol);
        token.setTotalSupply(token.getTotalSupply() + amount);
    }

    public synchronized void burn(String symbol, String from, double amount) {
        verifyTokenExists(symbol);
        
        Map<String, Double> ledger = ledgers.get(symbol);
        double currentBalance = ledger.getOrDefault(from, 0.0);
        
        if (currentBalance < amount) {
            throw new IllegalArgumentException("Insufficient balance to burn.");
        }
        
        ledger.put(from, currentBalance - amount);
        
        Token token = tokenRegistry.get(symbol);
        token.setTotalSupply(token.getTotalSupply() - amount);
    }

    public synchronized void transfer(String symbol, String from, String to, double amount) {
        verifyTokenExists(symbol);
        
        Map<String, Double> ledger = ledgers.get(symbol);
        double senderBalance = ledger.getOrDefault(from, 0.0);
        
        if (senderBalance < amount) {
            throw new IllegalArgumentException("Insufficient balance for transfer.");
        }
        
        ledger.put(from, senderBalance - amount);
        ledger.put(to, ledger.getOrDefault(to, 0.0) + amount);
    }

    public double getBalance(String symbol, String address) {
        verifyTokenExists(symbol);
        return ledgers.get(symbol).getOrDefault(address, 0.0);
    }

    public Token getToken(String symbol) {
        verifyTokenExists(symbol);
        return tokenRegistry.get(symbol);
    }

    private void verifyTokenExists(String symbol) {
        if (!tokenRegistry.containsKey(symbol)) {
            throw new IllegalArgumentException("Token not found: " + symbol);
        }
    }
}
