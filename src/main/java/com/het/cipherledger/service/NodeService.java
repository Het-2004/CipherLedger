package com.het.cipherledger.service;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.network.Peer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NodeService {

    // Store peers using address as key to prevent duplicates
    private final Map<String, Peer> peers = new ConcurrentHashMap<>();
    private final RestTemplate restTemplate = new RestTemplate();

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

    public void broadcastBlock(Block block) {
        System.out.println("Broadcasting block " + block.getIndex() + " to " + peers.size() + " peers...");
        for (Peer peer : peers.values()) {
            if ("ONLINE".equals(peer.getStatus())) {
                try {
                    String url = "http://" + peer.getAddress() + "/api/nodes/broadcast/block";
                    restTemplate.postForEntity(url, block, String.class);
                } catch (Exception e) {
                    System.err.println("Failed to broadcast block to " + peer.getAddress());
                }
            }
        }
    }

    public void broadcastTransaction(Transaction tx) {
        System.out.println("Broadcasting transaction " + tx.getTransactionId() + " to " + peers.size() + " peers...");
        for (Peer peer : peers.values()) {
            if ("ONLINE".equals(peer.getStatus())) {
                try {
                    String url = "http://" + peer.getAddress() + "/api/nodes/broadcast/transaction";
                    restTemplate.postForEntity(url, tx, String.class);
                } catch (Exception e) {
                    System.err.println("Failed to broadcast tx to " + peer.getAddress());
                }
            }
        }
    }

    @Scheduled(fixedRate = 10000)
    public void pingPeers() {
        for (Peer peer : peers.values()) {
            long startTime = System.currentTimeMillis();
            try {
                String url = "http://" + peer.getAddress() + "/api/nodes/health";
                restTemplate.getForEntity(url, String.class);
                long latency = System.currentTimeMillis() - startTime;
                peer.setLatency((int) latency);
                peer.setStatus("ONLINE");
            } catch (Exception e) {
                peer.setStatus("OFFLINE");
            }
        }
    }
}
