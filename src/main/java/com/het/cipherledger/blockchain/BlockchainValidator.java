package com.het.cipherledger.blockchain;

import com.het.cipherledger.model.Block;
import java.util.List;

/**
 * ============================================
 * Project : CipherLedger
 * Class   : BlockchainValidator
 * Purpose : Validate blockchain integrity
 * ============================================
 */

public class BlockchainValidator {

    public boolean isValid(List<Block> chain) {

        for(int i = 1; i < chain.size(); i++) {
            Block currentBlock = chain.get(i);
            Block previousBlock = chain.get(i - 1);

            /*
             Check current block hash
             */
            if(!currentBlock.getHash().equals(currentBlock.calculateHash())) {
                System.out.println("Invalid Current Hash");
                return false;
            }

            /*
             Check previous hash connection
             */
            if(!currentBlock.getPreviousHash().equals(previousBlock.getHash())) {
                System.out.println("Invalid Previous Hash");
                return false;
            }
        }
        return true;
    }
}