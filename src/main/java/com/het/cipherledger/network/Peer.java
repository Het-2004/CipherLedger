package com.het.cipherledger.network;

public class Peer {

    private String id;

    private String address;

    private int port;

    public Peer(String id, String address, int port){
        this.id = id;
        this.address = address;
        this.port = port;
    }

    public String getId(){
        return id;
    }

    public String getAddress(){
        return address;
    }

    public int getPort(){
        return port;
    }
}