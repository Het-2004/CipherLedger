package com.het.cipherledger.service;

import com.het.cipherledger.dto.MiningResponse;
import com.het.cipherledger.model.Block;
import com.het.cipherledger.repository.BlockRepository;
import com.het.cipherledger.websocket.BlockSocketService;
import org.springframework.stereotype.Service;

@Service
public class MiningService {

    private final BlockRepository repository;
    private final BlockSocketService socket;
    private final MiningOrchestrator miningOrchestrator;
    private final NodeService nodeService;

    public MiningService(
            BlockRepository repository,
            BlockSocketService socket,
            MiningOrchestrator miningOrchestrator,
            NodeService nodeService
    ) {
        this.repository = repository;
        this.socket = socket;
        this.miningOrchestrator = miningOrchestrator;
        this.nodeService = nodeService;
    }

    public MiningResponse mine() {
        long start = System.currentTimeMillis();

        Block block = miningOrchestrator.mineBlock();

        repository.save(block);

        // WebSocket live update
        socket.sendBlock(block);
        
        // Broadcast to P2P network
        nodeService.broadcastBlock(block);

        long end = System.currentTimeMillis();

        return new MiningResponse(
                true,
                "Block mined successfully",
                block.getIndex(),
                block.getHash(),
                block.getNonce(),
                end - start
        );
    }
}