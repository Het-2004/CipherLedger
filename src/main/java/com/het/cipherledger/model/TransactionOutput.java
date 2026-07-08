package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;
import java.security.PublicKey;

public class TransactionOutput {

    private String id;
    private PublicKey receiver;
    private double amount;

    public TransactionOutput(PublicKey receiver, double amount) {
        this.receiver = receiver;
        this.amount = amount;
        this.id = HashUtil.generateHash(
                receiver.toString() + amount + System.nanoTime()
        );
    }

    public boolean belongsTo(PublicKey publicKey) {
        return receiver.equals(publicKey);
    }

    public String getId() {
        return id;
    }

    public PublicKey getReceiver() {
        return receiver;
    }

    public double getAmount() {
        return amount;
    }
}