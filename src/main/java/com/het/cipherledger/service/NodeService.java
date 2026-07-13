package com.het.cipherledger.service;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.network.P2PClient;
import com.het.cipherledger.network.P2PMessage;
import com.het.cipherledger.network.Peer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NodeService {

    @Value("${cipherledger.p2p.port:9000}")
    private int port;
    
    @Value("${cipherledger.p2p.seeds:}")
    private String seeds;

    private final Map<String, Peer> peers = new ConcurrentHashMap<>();
    private final P2PClient p2pClient;

    public NodeService(P2PClient p2pClient) {
        this.p2pClient = p2pClient;
    }

    @PostConstruct
    public void bootstrapNetwork() {
        if (seeds != null && !seeds.isEmpty()) {
            String[] seedNodes = seeds.split(",");
            for (String seed : seedNodes) {
                if (!seed.trim().isEmpty()) {
                    System.out.println("Connecting to seed node: " + seed.trim());
                    // Send handshake to seed
                    P2PMessage handshake = new P2PMessage(P2PMessage.MessageType.HANDSHAKE, null, "localhost:" + port);
                    p2pClient.sendMessage(seed.trim(), handshake);
                    
                    // Request chain from seed
                    P2PMessage reqChain = new P2PMessage(P2PMessage.MessageType.REQ_CHAIN, null, "localhost:" + port);
                    p2pClient.sendMessage(seed.trim(), reqChain);
                }
            }
        }
    }

    public List<Peer> getPeers() {
        return new ArrayList<>(peers.values());
    }

    public Peer registerPeer(Peer peer) {
        if (peer.getId() == null) {
            peer.setId(java.util.UUID.randomUUID().toString());
        }
        peer.setStatus("ONLINE");
        peer.setLatency(0);
        peers.put(peer.getAddress(), peer);
        System.out.println("Peer registered: " + peer.getName() + " [" + peer.getAddress() + "]");
        return peer;
    }
    
    public void markPeerOnline(String address) {
        if (peers.containsKey(address)) {
            peers.get(address).setStatus("ONLINE");
        } else {
            registerPeer(new Peer(null, "Peer", address));
        }
    }

    public void sendMessage(String address, P2PMessage message) {
        p2pClient.sendMessage(address, message);
    }

    public void gossipMessage(P2PMessage message) {
        List<Peer> activePeers = getPeers().stream()
                .filter(p -> "ONLINE".equals(p.getStatus()))
                .toList();
        p2pClient.gossip(activePeers, message);
    }

    public void broadcastBlock(Block block) {
        System.out.println("Gossiping block " + block.getIndex() + " to peers...");
        P2PMessage msg = new P2PMessage(P2PMessage.MessageType.GOSSIP_BLOCK, block, "localhost:" + port);
        gossipMessage(msg);
    }

    public void broadcastTransaction(Transaction tx) {
        System.out.println("Gossiping transaction " + tx.getTransactionId() + " to peers...");
        P2PMessage msg = new P2PMessage(P2PMessage.MessageType.GOSSIP_TX, tx, "localhost:" + port);
        gossipMessage(msg);
    }

    @Scheduled(fixedRate = 10000)
    public void pingPeers() {
        List<Peer> activePeers = getPeers();
        P2PMessage ping = new P2PMessage(P2PMessage.MessageType.PING, null, "localhost:" + port);
        for (Peer peer : activePeers) {
            p2pClient.sendMessage(peer.getAddress(), ping);
        }
    }
}
