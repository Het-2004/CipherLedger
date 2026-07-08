package com.het.cipherledger;


import com.het.cipherledger.exception.InvalidTransactionException;


public class Main {


    public static void main(String[] args){


        throw new InvalidTransactionException(
                "Testing CipherLedger Exception"
        );


    }

}