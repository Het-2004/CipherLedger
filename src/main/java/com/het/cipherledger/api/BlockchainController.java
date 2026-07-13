package com.het.cipherledger.api;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.service.BlockchainService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockchain")
@CrossOrigin(origins = "*")
public class BlockchainController {
    private final BlockchainService service;
    private final com.het.cipherledger.websocket.BlockSocketService socketService;

    public BlockchainController(
        BlockchainService service,
        com.het.cipherledger.websocket.BlockSocketService socketService
    ){
        this.service = service;
        this.socketService = socketService;
    }

    @GetMapping
    public List<Block> blocks(){
        return service.getBlocks();
    }

    @PostMapping("/save")
    public Block save(@RequestBody Block block){
        if (block.getTransactions() == null || block.getTransactions().isEmpty()) {
            block.setTransactions(new java.util.ArrayList<>(TransactionController.getPool()));
        }
        Block saved = service.save(block);
        
        // Broadcast block via WebSocket
        socketService.sendBlock(saved);
        
        TransactionController.clearPool();
        return saved;
    }
}