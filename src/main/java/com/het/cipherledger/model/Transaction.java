package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;
import com.het.cipherledger.crypto.SignatureUtil;

import java.security.PrivateKey;
import java.security.PublicKey;

public class Transaction {

    private String transactionId;
    private PublicKey sender;
    private PublicKey receiver;
    private double amount;
    private byte[] signature;

    public Transaction() {
    }

    public Transaction(PublicKey sender, PublicKey receiver, double amount) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.transactionId = calculateHash();
    }

    private String calculateHash() {
        return HashUtil.generateHash(sender.toString() + receiver.toString() + amount);
    }

    public void generateSignature(PrivateKey privateKey) {
        String data = sender.toString() + receiver.toString() + amount;
        signature = SignatureUtil.sign(data, privateKey);
    }

    public boolean verifySignature() {
        String data = sender.toString() + receiver.toString() + amount;
        return SignatureUtil.verify(data, signature, sender);
    }

    public String getTransactionId() {
        return transactionId;
    }

    public PublicKey getSender() {
        return sender;
    }

    public PublicKey getReceiver() {
        return receiver;
    }

    public double getAmount() {
        return amount;
    }

    public byte[] getSignature() {
        return signature;
    }
}