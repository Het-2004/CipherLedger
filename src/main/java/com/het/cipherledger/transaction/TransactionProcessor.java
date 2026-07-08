package com.het.cipherledger.transaction;

import com.het.cipherledger.model.Transaction;

public class TransactionProcessor {
    private final TransactionValidator validator;

    public TransactionProcessor(){
        validator = new TransactionValidator();
    }

    public boolean process(Transaction transaction){

        if (validator.validate(transaction)) {
            System.out.println("Transaction accepted");
            return true;
        }
        System.out.println("Transaction rejected");
        return false;
    }
}