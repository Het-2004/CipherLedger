package com.het.cipherledger.network;

public class Peer {

    private String id;
    private String name;
    private String address; // e.g. "localhost:8081"
    private int latency;
    private String status; // "ONLINE" or "SYNCING" or "OFFLINE"

    public Peer() {}

    public Peer(String id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.latency = 0;
        this.status = "ONLINE";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getLatency() {
        return latency;
    }

    public void setLatency(int latency) {
        this.latency = latency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}