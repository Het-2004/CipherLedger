package com.het.cipherledger.service;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.repository.BlockRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BlockchainService {

    private final BlockRepository repository;

    public BlockchainService(BlockRepository repository){
        this.repository = repository;
    }

    @org.springframework.cache.annotation.CacheEvict(value = "blocks", allEntries = true)
    public Block save(Block block){
        return repository.save(block);
    }

    @org.springframework.cache.annotation.Cacheable("blocks")
    public List<Block> getBlocks(){
        return repository.findAll();
    }
    
    public List<Block> getChain() {
        return getBlocks();
    }

    public synchronized boolean addBlockFromGossip(Block block) {
        List<Block> currentChain = getChain();
        if (currentChain.isEmpty()) {
            save(block);
            return true;
        }

        Block latest = currentChain.get(currentChain.size() - 1);
        if (block.getIndex() == latest.getIndex() + 1 && block.getPreviousHash().equals(latest.getHash())) {
            // It's a valid next block
            save(block);
            return true;
        } else if (block.getIndex() > latest.getIndex() + 1) {
            // We are behind, we need to request the full chain
            // In a real impl, we'd trigger a REQ_CHAIN here
            return false;
        }
        
        // Block is old or invalid
        return false;
    }

    @org.springframework.cache.annotation.CacheEvict(value = "blocks", allEntries = true)
    public synchronized void resolveForks(List<Block> remoteChain) {
        List<Block> localChain = getChain();
        
        // Longest Chain Rule: If the remote chain is longer, we adopt it.
        // In a real production system, we would mathematically verify every signature and hash here.
        if (remoteChain.size() > localChain.size()) {
            System.out.println("Fork detected! Remote chain is longer (" + remoteChain.size() + " > " + localChain.size() + "). Reorganizing chain...");
            repository.deleteAll();
            for (Block block : remoteChain) {
                repository.save(block);
            }
        }
    }
}