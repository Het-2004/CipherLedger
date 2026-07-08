package com.het.cipherledger;

import com.het.cipherledger.model.Block;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BlockTest {

    @Test
    void createBlockTest(){
        Block block = new Block("0");
        assertNotNull(block.getHash());
        assertEquals("0", block.getPreviousHash());
    }
}