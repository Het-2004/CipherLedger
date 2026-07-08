package com.het.cipherledger.network;

import java.util.ArrayList;
import java.util.List;

public class Node {

    private String nodeId;

    private List<Peer> peers;

    public Node(String nodeId){
        this.nodeId = nodeId;
        this.peers = new ArrayList<>();
    }

    public void addPeer(Peer peer){
        peers.add(peer);
    }

    public String getNodeId(){
        return nodeId;
    }

    public List<Peer> getPeers(){
        return peers;
    }
}