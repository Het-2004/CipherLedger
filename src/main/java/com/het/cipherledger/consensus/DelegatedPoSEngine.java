package com.het.cipherledger.consensus;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class DelegatedPoSEngine implements ConsensusEngine {

    private final ValidatorRegistry registry;
    private final String nodeAddress;
    private static final int MAX_DELEGATES = 21;

    public DelegatedPoSEngine(ValidatorRegistry registry) {
        this.registry = registry;
        this.nodeAddress = "local-node-address";
    }

    @Override
    public boolean isAuthorizedToProduce() {
        Map<String, Double> votingPower = registry.getDelegateVotingPower();
        if (votingPower.isEmpty()) return true;

        // Find the top N delegates based on voting power
        List<String> topDelegates = votingPower.entrySet().stream()
                .sorted((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()))
                .limit(MAX_DELEGATES)
                .map(entry -> entry.getKey())
                .collect(Collectors.toList());

        // In a real DPoS system, these top delegates take turns in a round-robin schedule.
        return topDelegates.contains(nodeAddress);
    }

    @Override
    public Block produceBlock(int index, String previousHash, List<Transaction> transactions) {
        Block block = new Block(
                index,
                previousHash,
                "",
                0,
                System.currentTimeMillis()
        );
        block.setTransactions(transactions);
        block.setHash(block.calculateHash());
        return block;
    }

    @Override
    public boolean validateBlock(Block block) {
        return block.getHash().equals(block.calculateHash());
    }

    @Override
    public String getAlgorithmName() {
        return "DELEGATED_PROOF_OF_STAKE";
    }
}
