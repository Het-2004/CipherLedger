package com.het.cipherledger.network;

import java.io.Serializable;

public class P2PMessage implements Serializable {

    public enum MessageType {
        HANDSHAKE,
        PING,
        GOSSIP_BLOCK,
        GOSSIP_TX,
        REQ_CHAIN,
        RES_CHAIN
    }

    private MessageType type;
    private Object payload;
    private String senderAddress;

    public P2PMessage() {}

    public P2PMessage(MessageType type, Object payload, String senderAddress) {
        this.type = type;
        this.payload = payload;
        this.senderAddress = senderAddress;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getSenderAddress() {
        return senderAddress;
    }

    public void setSenderAddress(String senderAddress) {
        this.senderAddress = senderAddress;
    }
}
