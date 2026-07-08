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

    public Block save(Block block){
        return repository.save(block);
    }

    public List<Block> getBlocks(){
        return repository.findAll();
    }
}