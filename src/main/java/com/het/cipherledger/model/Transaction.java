package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;

public class Transaction {

    private String transactionId;
    private String sender;
    private String receiver;
    private double amount;

    public Transaction(String sender, String receiver, double amount){
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.transactionId = calculateHash();
    }

    private String calculateHash(){
        return HashUtil.generateHash(sender + receiver + amount + System.nanoTime());
    }

    public String getTransactionId(){
        return transactionId;
    }

    public String getSender(){
        return sender;
    }

    public String getReceiver(){
        return receiver;
    }

    // IMPORTANT: return double, not String
    public double getAmount(){
        return amount;
    }
}