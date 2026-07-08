package com.het.cipherledger.model;

public class TransactionInput{
    private String transactionOutputId;

    public TransactionInput(String transactionOutputId){
        this.transactionOutputId = transactionOutputId;
    }

    public String getTransactionOutputID(){
        return transactionOutputId;
    }
}