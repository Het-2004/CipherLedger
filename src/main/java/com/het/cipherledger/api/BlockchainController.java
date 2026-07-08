package com.het.cipherledger.api;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.service.BlockchainService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {
    private final BlockchainService service;

    public BlockchainController(BlockchainService service){
        this.service = service;
    }

    @GetMapping
    public List<Block> blocks(){
        return service.getBlocks();
    }

    @PostMapping("/save")
    public Block save(@RequestBody Block block){
        return service.save(block);
    }
}