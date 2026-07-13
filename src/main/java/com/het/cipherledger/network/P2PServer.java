package com.het.cipherledger.network;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.service.BlockchainService;
import com.het.cipherledger.service.NodeService;
import com.het.cipherledger.service.TransactionPool;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.ObjectInputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;

@Component
public class P2PServer {

    @Value("${cipherledger.p2p.port:9000}")
    private int port;

    private final NodeService nodeService;
    private final BlockchainService blockchainService;
    private final TransactionPool transactionPool;
    
    private ServerSocket serverSocket;
    private boolean running = false;

    public P2PServer(@Lazy NodeService nodeService, @Lazy BlockchainService blockchainService, TransactionPool transactionPool) {
        this.nodeService = nodeService;
        this.blockchainService = blockchainService;
        this.transactionPool = transactionPool;
    }

    @PostConstruct
    public void startServer() {
        running = true;
        new Thread(() -> {
            try {
                serverSocket = new ServerSocket(port);
                System.out.println("P2P Server listening on port " + port);
                
                while (running) {
                    Socket clientSocket = serverSocket.accept();
                    new Thread(() -> handleConnection(clientSocket)).start();
                }
            } catch (Exception e) {
                if (running) {
                    System.err.println("P2P Server error: " + e.getMessage());
                }
            }
        }).start();
    }

    private void handleConnection(Socket socket) {
        try (ObjectInputStream in = new ObjectInputStream(socket.getInputStream())) {
            P2PMessage message = (P2PMessage) in.readObject();
            processMessage(message);
        } catch (Exception e) {
            // Ignore connection errors
        }
    }

    private void processMessage(P2PMessage message) {
        if (message == null || message.getType() == null) return;

        switch (message.getType()) {
            case HANDSHAKE:
                // Register peer
                Peer peer = new Peer(null, "Peer", message.getSenderAddress());
                nodeService.registerPeer(peer);
                break;
                
            case PING:
                nodeService.markPeerOnline(message.getSenderAddress());
                break;
                
            case GOSSIP_BLOCK:
                Block block = (Block) message.getPayload();
                boolean added = blockchainService.addBlockFromGossip(block);
                if (added) {
                    // Forward to others if it's a new valid block
                    nodeService.gossipMessage(message);
                }
                break;
                
            case GOSSIP_TX:
                Transaction tx = (Transaction) message.getPayload();
                // Avoid infinite loops by checking if it already exists
                boolean isNew = transactionPool.getPendingTransactions().stream()
                        .noneMatch(t -> t.getTransactionId().equals(tx.getTransactionId()));
                if (isNew) {
                    transactionPool.addTransaction(tx);
                    nodeService.gossipMessage(message);
                }
                break;
                
            case REQ_CHAIN:
                // Someone is requesting our chain
                List<Block> chain = blockchainService.getChain();
                P2PMessage resMsg = new P2PMessage(P2PMessage.MessageType.RES_CHAIN, chain, "localhost:" + port);
                nodeService.sendMessage(message.getSenderAddress(), resMsg);
                break;
                
            case RES_CHAIN:
                // We received a chain, handle fork resolution / chain selection
                @SuppressWarnings("unchecked")
                List<Block> remoteChain = (List<Block>) message.getPayload();
                blockchainService.resolveForks(remoteChain);
                break;
        }
    }

    @PreDestroy
    public void stopServer() {
        running = false;
        try {
            if (serverSocket != null) {
                serverSocket.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
