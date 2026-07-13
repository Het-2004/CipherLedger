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
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NodeService {

    @Value("${cipherledger.p2p.port:9000}")
    private int port;
    
    // Must match the property key in application.properties exactly
    @Value("${cipherledger.p2p.seed-nodes:}")
    private String seeds;

    private final Map<String, Peer> peers = new ConcurrentHashMap<>();
    private final P2PClient p2pClient;

    public NodeService(P2PClient p2pClient) {
        this.p2pClient = p2pClient;
    }

    @PostConstruct
    public void bootstrapNetwork() {
        if (seeds == null || seeds.isBlank()) {
            System.out.println("[P2P] No seed nodes configured. Running as standalone node.");
            return;
        }
        String[] seedNodes = seeds.split(",");
        for (String seed : seedNodes) {
            String address = seed.trim();
            if (address.isEmpty()) continue;

            // Pre-flight reachability check — avoids Connection Refused noise
            if (!canReach(address)) {
                System.out.println("[P2P] Seed node unreachable (not running?): " + address + " — skipping.");
                continue;
            }

            System.out.println("[P2P] Connecting to seed node: " + address);
            P2PMessage handshake = new P2PMessage(P2PMessage.MessageType.HANDSHAKE, null, "localhost:" + port);
            p2pClient.sendMessage(address, handshake);

            P2PMessage reqChain = new P2PMessage(P2PMessage.MessageType.REQ_CHAIN, null, "localhost:" + port);
            p2pClient.sendMessage(address, reqChain);
        }
    }

    /**
     * Quick TCP reachability check with a 1-second timeout.
     * Returns false instead of throwing Connection Refused.
     */
    private boolean canReach(String address) {
        try {
            String[] parts = address.split(":");
            String host = parts[0];
            int p = Integer.parseInt(parts[1]);
            try (Socket s = new Socket()) {
                s.connect(new InetSocketAddress(host, p), 1000);
            }
            return true;
        } catch (Exception e) {
            return false;
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

    @Scheduled(fixedRate = 15000)
    public void pingPeers() {
        if (peers.isEmpty()) return;
        P2PMessage ping = new P2PMessage(P2PMessage.MessageType.PING, null, "localhost:" + port);
        List<String> toRemove = new ArrayList<>();

        for (Peer peer : peers.values()) {
            if (canReach(peer.getAddress())) {
                peer.setStatus("ONLINE");
                p2pClient.sendMessage(peer.getAddress(), ping);
            } else {
                peer.setStatus("OFFLINE");
                toRemove.add(peer.getAddress());
                System.out.println("[P2P] Peer unreachable, removing: " + peer.getAddress());
            }
        }
        // Evict dead peers so we never retry them
        toRemove.forEach(peers::remove);
    }
}
