package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;

public class TransactionOutput {
    private String id;
    private String receiver;
    private double amount;

    public TransactionOutput(String receiver, double amount){
        this.receiver = receiver;
        this.amount = amount;

        this.id = HashUtil.generateHash(receiver + amount + System.nanoTime());
    }

    public String getId(){return id;}

    public String getReceiver(){return receiver;}

    public double getAmount(){return amount;}
}