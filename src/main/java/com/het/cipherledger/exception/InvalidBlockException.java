package com.het.cipherledger.exception;

public class InvalidBlockException
        extends BlockchainException {

    public InvalidBlockException(String message){
        super(message);
    }
}