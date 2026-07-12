package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Collections;
import static org.junit.jupiter.api.Assertions.*;

public class ConsensusTests {

    private ValidatorRegistry registry;

    @BeforeEach
    public void setup() {
        registry = new ValidatorRegistry();
    }

    @Test
    public void testPoWEngine() {
        PoWEngine engine = new PoWEngine();
        assertTrue(engine.isAuthorizedToProduce());
        
        Block block = engine.produceBlock(1, "GENESIS", Collections.emptyList());
        assertNotNull(block);
        assertTrue(block.getHash().startsWith("0000"));
        assertTrue(engine.validateBlock(block));
    }

    @Test
    public void testProofOfStakeEngine() {
        // Bootstrap mode (no stakes yet)
        ProofOfStakeEngine engine = new ProofOfStakeEngine(registry);
        assertTrue(engine.isAuthorizedToProduce());
        
        Block block = engine.produceBlock(1, "GENESIS", Collections.emptyList());
        assertNotNull(block);
        assertTrue(engine.validateBlock(block));
        
        // With stakes
        registry.stake("local-node-address", 1000);
        assertTrue(engine.isAuthorizedToProduce()); // 100% probability
    }

    @Test
    public void testPBFTEngine() {
        registry.stake("local-node-address", 100);
        PBFTEngine engine = new PBFTEngine(registry);
        assertTrue(engine.isAuthorizedToProduce());
        
        Block block = engine.produceBlock(1, "GENESIS", Collections.emptyList());
        assertNotNull(block);
        assertTrue(engine.validateBlock(block));
    }

    @Test
    public void testDelegatedPoSEngine() {
        registry.stake("voter1", 500);
        registry.delegate("voter1", "local-node-address");
        
        DelegatedPoSEngine engine = new DelegatedPoSEngine(registry);
        assertTrue(engine.isAuthorizedToProduce());
        
        Block block = engine.produceBlock(1, "GENESIS", Collections.emptyList());
        assertNotNull(block);
        assertTrue(engine.validateBlock(block));
    }
}
