package com.het.cipherledger.api;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.transaction.TransactionProcessor;

public class TransactionController {

    private final TransactionProcessor processor;
    public TransactionController(){
        processor = new TransactionProcessor();
    }

    public boolean sendTransaction(String sender, String receiver, double amount){
        Transaction transaction = new Transaction(sender, receiver, amount);
        return processor.process(transaction);
    }
}