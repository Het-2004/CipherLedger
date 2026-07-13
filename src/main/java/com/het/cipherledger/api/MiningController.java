package com.het.cipherledger.api;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.service.BlockchainService;
import com.het.cipherledger.service.NodeService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/mining")
@CrossOrigin(origins = "*")
public class MiningController {

    private final BlockchainService service;
    private final com.het.cipherledger.service.MiningService miningService;
    private final NodeService nodeService;

    public MiningController(
        BlockchainService service,
        com.het.cipherledger.service.MiningService miningService,
        NodeService nodeService
    ) {
        this.service = service;
        this.miningService = miningService;
        this.nodeService = nodeService;
    }

    @PostMapping("/run")
    public com.het.cipherledger.dto.MiningResponse runServerMining() {
        return miningService.mine();
    }

    @PostMapping
    public Block saveMinedBlock(@RequestBody Block block) {
        // If block has no transactions, bundle transactions from the backend pool
        if (block.getTransactions() == null || block.getTransactions().isEmpty()) {
            block.setTransactions(new ArrayList<>(TransactionController.getPool()));
        }
        
        // Save block to MongoDB database
        Block saved = service.save(block);
        
        // Clear the transaction pool on block discovery
        TransactionController.clearPool();
        System.out.println("Mined Block #" + block.getIndex() + " saved to database. Mempool cleared.");
        
        // Broadcast block to network peers
        nodeService.broadcastBlock(saved);
        
        return saved;
    }
}
