package com.het.cipherledger.exception;

public class WalletException
        extends BlockchainException {

    public WalletException(String message){
        super(message);
    }

    public WalletException(String message, Throwable cause){
        super(message, cause);
    }
}