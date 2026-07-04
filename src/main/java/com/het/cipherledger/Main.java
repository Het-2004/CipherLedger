package com.het.cipherledger;


import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Block;


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



        for(Block block :
                blockchain.getChain()) {


            System.out.println(
                    "Data : "
                            + block.getData()
            );


            System.out.println(
                    "Previous Hash : "
                            + block.getPreviousHash()
            );


            System.out.println(
                    "Hash : "
                            + block.getHash()
            );


            System.out.println(
                    "------------------------"
            );

        }

    }

}