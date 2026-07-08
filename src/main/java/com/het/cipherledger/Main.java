package com.het.cipherledger;


import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.transaction.TransactionProcessor;


public class Main {


    public static void main(String[] args){


        Transaction transaction =
                new Transaction(
                        "Het",
                        "Alex",
                        100.0
                );



        TransactionProcessor processor =
                new TransactionProcessor();



        processor.process(
                transaction
        );


    }

}