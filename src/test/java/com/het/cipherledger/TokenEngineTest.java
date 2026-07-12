package com.het.cipherledger;

import com.het.cipherledger.model.Token;
import com.het.cipherledger.service.TokenEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TokenEngineTest {

    private TokenEngine engine;

    @BeforeEach
    public void setup() {
        engine = new TokenEngine();
    }

    @Test
    public void testNativeCLDToken() {
        Token cld = engine.getToken("CLD");
        assertNotNull(cld);
        assertEquals("CipherLedger Token", cld.getName());
        assertEquals(21_000_000.0, cld.getTotalSupply());
        assertEquals(21_000_000.0, engine.getBalance("CLD", "GENESIS"));
    }

    @Test
    public void testCreateCustomToken() {
        Token myToken = engine.createToken("HET", "Het Token", "wallet-1", 1000.0, 18);
        assertNotNull(myToken);
        assertEquals(1000.0, myToken.getTotalSupply());
        assertEquals(1000.0, engine.getBalance("HET", "wallet-1"));
        
        // Cannot create same token again
        assertThrows(IllegalArgumentException.class, () -> {
            engine.createToken("HET", "Another", "wallet-2", 0, 18);
        });
    }

    @Test
    public void testMintAndBurn() {
        engine.createToken("TEST", "Test Token", "creator", 0.0, 18);
        
        engine.mint("TEST", "wallet-2", 500.0);
        assertEquals(500.0, engine.getBalance("TEST", "wallet-2"));
        assertEquals(500.0, engine.getToken("TEST").getTotalSupply());

        engine.burn("TEST", "wallet-2", 200.0);
        assertEquals(300.0, engine.getBalance("TEST", "wallet-2"));
        assertEquals(300.0, engine.getToken("TEST").getTotalSupply());
        
        // Burn too much
        assertThrows(IllegalArgumentException.class, () -> {
            engine.burn("TEST", "wallet-2", 1000.0);
        });
    }

    @Test
    public void testTransfer() {
        engine.createToken("USDC", "USD Coin", "creator", 1000.0, 6);
        
        engine.transfer("USDC", "creator", "wallet-3", 400.0);
        
        assertEquals(600.0, engine.getBalance("USDC", "creator"));
        assertEquals(400.0, engine.getBalance("USDC", "wallet-3"));
        
        // Insufficient funds
        assertThrows(IllegalArgumentException.class, () -> {
            engine.transfer("USDC", "creator", "wallet-3", 1000.0);
        });
    }
}
