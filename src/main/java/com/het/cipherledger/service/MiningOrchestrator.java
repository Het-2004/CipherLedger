package com.het.cipherledger.service;

import com.het.cipherledger.consensus.ConsensusEngine;
import com.het.cipherledger.model.Block;
import com.het.cipherledger.repository.BlockRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class MiningOrchestrator {

    private final BlockRepository repository;
    private final ConsensusEngine activeEngine;

    public MiningOrchestrator(
            BlockRepository repository,
            Map<String, ConsensusEngine> engines,
            @Value("${cipherledger.consensus.algorithm:PROOF_OF_WORK}") String activeAlgorithm) {
        
        this.repository = repository;
        
        // Find the engine that matches the configured algorithm
        this.activeEngine = engines.values().stream()
                .filter(e -> e.getAlgorithmName().equals(activeAlgorithm))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown consensus algorithm: " + activeAlgorithm));
        
        System.out.println("Started node with consensus algorithm: " + this.activeEngine.getAlgorithmName());
    }

    public Block mineBlock() {
        if (!activeEngine.isAuthorizedToProduce()) {
            throw new IllegalStateException("Node is not authorized to produce a block under " + activeEngine.getAlgorithmName());
        }

        int index = (int) repository.count() + 1;

        String previousHash =
                repository.findAll()
                        .stream()
                        .reduce((a, b) -> b)
                        .map(b -> b.getHash())
                        .orElse("GENESIS");

        // Prepare block transactions based on gas fee
        List<com.het.cipherledger.model.Transaction> pool = new java.util.ArrayList<>(com.het.cipherledger.api.TransactionController.getPool());
        pool.sort((t1, t2) -> Double.compare(t2.getGasPrice(), t1.getGasPrice()));

        List<com.het.cipherledger.model.Transaction> blockTransactions = new java.util.ArrayList<>();
        long currentGas = 0;
        long MAX_BLOCK_GAS = 15_000_000;

        for (com.het.cipherledger.model.Transaction tx : pool) {
            long txGas = tx.getGasLimit() > 0 ? tx.getGasLimit() : 21000;
            if (currentGas + txGas <= MAX_BLOCK_GAS) {
                blockTransactions.add(tx);
                currentGas += txGas;
            }
        }

        // Delegate the actual block production (e.g. hashing, staking, signing) to the strategy
        Block block = activeEngine.produceBlock(index, previousHash, blockTransactions);

        // Remove included transactions from the global pool
        com.het.cipherledger.api.TransactionController.getPool().removeAll(blockTransactions);

        return block;
    }
}