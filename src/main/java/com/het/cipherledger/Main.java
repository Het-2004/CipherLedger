package com.het.cipherledger;


import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Transaction;


public class Main {


    public static void main(String[] args){


        Blockchain blockchain =
                new Blockchain();



        blockchain.addTransaction(

                new Transaction(
                        "Het",
                        "Alex",
                        "50"
                )

        );


        blockchain.addTransaction(

                new Transaction(
                        "Alex",
                        "John",
                        "20"
                )

        );



        blockchain
                .getChain()
                .forEach(
                        block -> {


                            System.out.println(
                                    block.getHash()
                            );

                        }
                );


    }


}