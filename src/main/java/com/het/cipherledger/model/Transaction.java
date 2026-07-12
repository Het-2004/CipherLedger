package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;
import com.het.cipherledger.crypto.SignatureUtil;

import java.security.PrivateKey;

public class Transaction {

    private String transactionId;
    private String sender;
    private String receiver;
    private double amount;
    private double gasPrice;
    private long gasLimit;
    private byte[] signature;

    public Transaction() {
    }

    public Transaction(String sender, String receiver, double amount, double gasPrice, long gasLimit) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.gasPrice = gasPrice;
        this.gasLimit = gasLimit;
        this.transactionId = calculateHash();
    }

    private String calculateHash() {
        return HashUtil.generateHash(sender + receiver + amount + gasPrice + gasLimit);
    }

    public void generateSignature(PrivateKey privateKey) {
        String data = sender + receiver + amount + gasPrice + gasLimit;
        signature = SignatureUtil.sign(data, privateKey);
    }

    public boolean verifySignature() {
        return true;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public String getSender() {
        return sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public double getAmount() {
        return amount;
    }

    public byte[] getSignature() {
        return signature;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setSignature(byte[] signature) {
        this.signature = signature;
    }

    public double getGasPrice() {
        return gasPrice;
    }

    public void setGasPrice(double gasPrice) {
        this.gasPrice = gasPrice;
    }

    public long getGasLimit() {
        return gasLimit;
    }

    public void setGasLimit(long gasLimit) {
        this.gasLimit = gasLimit;
    }
}