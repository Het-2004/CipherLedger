package com.het.cipherledger.api;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.transaction.TransactionProcessor;
import com.het.cipherledger.wallet.Wallet;

public class TransactionController {

    private final TransactionProcessor processor;

    public TransactionController(){
        processor = new TransactionProcessor();
    }

    public boolean sendTransaction(Wallet sender, Wallet receiver, double amount){
        Transaction transaction = new Transaction(sender.getPublicKey(), receiver.getPublicKey(), amount);
        transaction.generateSignature(sender.getPrivateKey());
        return processor.process(transaction);
    }
}