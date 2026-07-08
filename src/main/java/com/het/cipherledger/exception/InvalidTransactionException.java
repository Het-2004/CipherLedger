package com.het.cipherledger.exception;

public class InvalidTransactionException
        extends BlockchainException {

    public InvalidTransactionException(String message){
        super(message);
    }
}