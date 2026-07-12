package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;

import java.util.List;

public interface ConsensusEngine {

    /**
     * Determines if this node is authorized to produce the next block under the current consensus rules.
     */
    boolean isAuthorizedToProduce();

    /**
     * Executes the consensus algorithm to produce a block.
     * @param index The block index
     * @param previousHash The hash of the previous block
     * @param transactions The transactions to include in the block
     * @return The newly produced Block
     */
    Block produceBlock(int index, String previousHash, List<Transaction> transactions);

    /**
     * Validates a block proposed by another node based on this algorithm's specific rules.
     */
    boolean validateBlock(Block block);

    /**
     * Returns the name of the consensus algorithm.
     */
    String getAlgorithmName();
}
