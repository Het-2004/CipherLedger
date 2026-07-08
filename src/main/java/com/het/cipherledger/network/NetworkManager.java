package com.het.cipherledger.network;

public class NetworkManager {

    private Node node;

    public NetworkManager(String nodeId){
        node = new Node(nodeId);
    }

    public void connectPeer(Peer peer){
        node.addPeer(peer);
        System.out.println("Peer Connected : " + peer.getId());
    }

    public void broadcast(String message){
        for(Peer peer : node.getPeers()){
            System.out.println("Sending to " + peer.getId() + " : " + message);
        }
    }

    public Node getNode(){
        return node;
    }
}