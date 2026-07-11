package com.het.cipherledger.service;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.repository.BlockRepository;
import com.het.cipherledger.utils.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class MiningOrchestrator {

    private final BlockRepository repository;

    private static final int DIFFICULTY = 4;

    public MiningOrchestrator(BlockRepository repository) {
        this.repository = repository;
    }

    public Block mineBlock() {
        int index = (int) repository.count() + 1;

        String previousHash =
                repository.findAll()
                        .stream()
                        .reduce((a, b) -> b)
                        .map(Block::getHash)
                        .orElse("GENESIS");

        int nonce = 0;
        String hash = "";

        while (!hash.startsWith("0".repeat(DIFFICULTY))) {
            nonce++;
            hash = calculateHash(index, previousHash, nonce);
        }

        return new Block(
                index,
                previousHash,
                hash,
                nonce,
                System.currentTimeMillis()
        );
    }

    private String calculateHash(
            int index,
            String previous,
            int nonce
    ) {
        String input = index + previous + nonce;
        return StringUtils.applySha256(input);
    }
}