package com.het.cipherledger.api;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.network.Peer;
import com.het.cipherledger.service.BlockchainService;
import com.het.cipherledger.service.NodeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nodes")
@CrossOrigin(origins = "*") // Needed for local dev sandbox
public class NodeController {

    private final NodeService nodeService;
    private final BlockchainService blockchainService;

    public NodeController(NodeService nodeService, BlockchainService blockchainService) {
        this.nodeService = nodeService;
        this.blockchainService = blockchainService;
    }

    @GetMapping
    public ResponseEntity<List<Peer>> getNodes() {
        return ResponseEntity.ok(nodeService.getPeers());
    }

    @PostMapping("/register")
    public ResponseEntity<Peer> registerNode(@RequestBody Peer peer) {
        Peer registered = nodeService.registerPeer(peer);
        return ResponseEntity.ok(registered);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of("status", "UP", "message", "Node is operational"));
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> triggerSync() {
        // A placeholder for triggering network sync of full chains
        return ResponseEntity.ok(Map.of("message", "Synchronization initiated"));
    }

    @PostMapping("/broadcast/block")
    public ResponseEntity<Map<String, String>> receiveBlock(@RequestBody Block block) {
        // Here we would typically validate the block before adding
        blockchainService.save(block);
        return ResponseEntity.ok(Map.of("message", "Block received and saved"));
    }

    @PostMapping("/broadcast/transaction")
    public ResponseEntity<Map<String, String>> receiveTransaction(@RequestBody Transaction tx) {
        // Add to global mempool
        TransactionController.getPool().add(tx);
        return ResponseEntity.ok(Map.of("message", "Transaction received and saved"));
    }
}
