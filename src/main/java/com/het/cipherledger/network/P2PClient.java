package com.het.cipherledger.network;

import org.springframework.stereotype.Component;

import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.List;
import java.util.Random;

@Component
public class P2PClient {

    private final Random random = new Random();

    public void sendMessage(String address, P2PMessage message) {
        new Thread(() -> {
            try {
                String[] parts = address.split(":");
                String host = parts[0];
                int port = Integer.parseInt(parts[1]);
                
                try (Socket socket = new Socket(host, port);
                     ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream())) {
                    out.writeObject(message);
                    out.flush();
                }
            } catch (Exception e) {
                // Node offline or unreachable
                System.err.println("P2PClient: Failed to send message to " + address);
            }
        }).start();
    }

    public void gossip(List<Peer> activePeers, P2PMessage message) {
        if (activePeers.isEmpty()) return;
        
        // Gossip to a random subset (e.g. up to 3 peers) to prevent flooding
        int gossipCount = Math.min(3, activePeers.size());
        for (int i = 0; i < gossipCount; i++) {
            Peer target = activePeers.get(random.nextInt(activePeers.size()));
            sendMessage(target.getAddress(), message);
        }
    }
}
