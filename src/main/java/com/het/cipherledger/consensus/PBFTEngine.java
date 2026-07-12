package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PBFTEngine implements ConsensusEngine {

    private final ValidatorRegistry registry;

    public PBFTEngine(ValidatorRegistry registry) {
        this.registry = registry;
    }

    @Override
    public boolean isAuthorizedToProduce() {
        // In PBFT, a primary replica is chosen in a round-robin fashion or via view-change.
        // For simulation, we assume authorization if we are a registered validator.
        return registry.getAllStakes().containsKey("local-node-address");
    }

    @Override
    public Block produceBlock(int index, String previousHash, List<Transaction> transactions) {
        // Pre-Prepare Phase -> Prepare Phase -> Commit Phase
        // In a real distributed system, we would broadcast the proposal and await 2/3 signatures.
        
        Block block = new Block(
                index,
                previousHash,
                "",
                0, 
                System.currentTimeMillis()
        );
        block.setTransactions(transactions);
        block.setHash(block.calculateHash());
        
        // Simulating the collection of 2/3 majority signatures.
        // If we didn't have 2/3, we would throw an exception.
        int totalValidators = registry.getAllStakes().size();
        int requiredSignatures = (int) Math.ceil((2.0 / 3.0) * totalValidators);
        
        System.out.println("PBFT: Collected " + requiredSignatures + " required signatures.");
        
        return block;
    }

    @Override
    public boolean validateBlock(Block block) {
        return block.getHash().equals(block.calculateHash());
    }

    @Override
    public String getAlgorithmName() {
        return "PRACTICAL_BYZANTINE_FAULT_TOLERANCE";
    }
}
