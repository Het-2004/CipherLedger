package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Component
public class ProofOfStakeEngine implements ConsensusEngine {

    private final ValidatorRegistry registry;
    private final String nodeAddress; // In a real system, this would be injected securely

    public ProofOfStakeEngine(ValidatorRegistry registry) {
        this.registry = registry;
        this.nodeAddress = "local-node-address"; // Hardcoded for simulation
    }

    @Override
    public boolean isAuthorizedToProduce() {
        Map<String, Double> stakes = registry.getAllStakes();
        if (stakes.isEmpty()) return true; // Bootstrap mode

        double totalStake = stakes.values().stream().mapToDouble(val -> val).sum();
        double myStake = registry.getStake(nodeAddress);

        // Probability of producing block is proportional to stake
        double probability = myStake / totalStake;
        return new Random().nextDouble() <= probability;
    }

    @Override
    public Block produceBlock(int index, String previousHash, List<Transaction> transactions) {
        // PoS doesn't need to mine a nonce
        Block block = new Block(
                index,
                previousHash,
                "",
                0, // No nonce needed
                System.currentTimeMillis()
        );
        block.setTransactions(transactions);
        block.setHash(block.calculateHash());
        return block;
    }

    @Override
    public boolean validateBlock(Block block) {
        // Simply check the hash integrity
        return block.getHash().equals(block.calculateHash());
    }

    @Override
    public String getAlgorithmName() {
        return "PROOF_OF_STAKE";
    }
}
