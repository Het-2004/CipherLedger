package com.het.cipherledger.transaction;

import com.het.cipherledger.model.Transaction;

public class TransactionValidator {

    public boolean validate(Transaction transaction){

        if(transaction == null){
            return false;
        }

        if(transaction.getAmount() <=0){
            return false;
        }
        return transaction.verifySignature();
    }
}