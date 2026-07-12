package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PoWEngine implements ConsensusEngine {

    private static final int DIFFICULTY = 4;

    @Override
    public boolean isAuthorizedToProduce() {
        return true; // Anyone can mine in PoW
    }

    @Override
    public Block produceBlock(int index, String previousHash, List<Transaction> transactions) {
        int nonce = 0;
        String hash = "";

        Block block = new Block(
                index,
                previousHash,
                hash,
                nonce,
                System.currentTimeMillis()
        );
        block.setTransactions(transactions);

        while (!hash.startsWith("0".repeat(DIFFICULTY))) {
            nonce++;
            block.setNonce(nonce);
            hash = block.calculateHash();
        }
        
        block.setHash(hash);
        return block;
    }

    @Override
    public boolean validateBlock(Block block) {
        return block.getHash().startsWith("0".repeat(DIFFICULTY)) && block.getHash().equals(block.calculateHash());
    }

    @Override
    public String getAlgorithmName() {
        return "PROOF_OF_WORK";
    }
}
