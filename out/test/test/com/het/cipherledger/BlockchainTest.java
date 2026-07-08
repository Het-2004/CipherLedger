package com.het.cipherledger;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Transaction;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BlockchainTest {

    @Test
    void addBlockTest(){
        Blockchain blockchain = new Blockchain();
        blockchain.addTransaction(new Transaction("Het", "Alex", 100));
        assertEquals(2, blockchain.size());
    }
}