package com.het.cipherledger.transaction;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.exception.InvalidTransactionException;

public class TransactionValidator {

    public boolean validate(Transaction transaction) {
        if(transaction == null) {
            throw new InvalidTransactionException(
                    "Transaction cannot be null"
            );
        }
        if(transaction.getSender() == null || transaction.getReceiver() == null) {return false;}
        if(transaction.getAmount() <= 0){return false;}
        return true;
    }
}