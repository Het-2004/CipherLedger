package com.het.cipherledger;


import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.blockchain.BlockchainValidator;


public class Main {


    public static void main(String[] args) {


        Blockchain blockchain =
                new Blockchain();



        blockchain.addBlock(
                "Het sends 10 coins"
        );


        blockchain.addBlock(
                "Rahul sends 5 coins"
        );



        BlockchainValidator validator =
                new BlockchainValidator();



        boolean result =
                validator.isValid(
                        blockchain.getChain()
                );



        System.out.println(
                "Blockchain Valid : "
                        + result
        );

    }

}