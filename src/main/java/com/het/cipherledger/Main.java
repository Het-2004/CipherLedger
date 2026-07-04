package com.het.cipherledger;

import com.het.cipherledger.model.Block;

public class Main {

    public static void main(String[] args) {

        Block block = new Block(
                "Hello CipherLedger",
                "0"
        );

        System.out.println("Data          : " + block.getData());
        System.out.println("Previous Hash : " + block.getPreviousHash());
        System.out.println("Current Hash  : " + block.getHash());
        System.out.println("Timestamp     : " + block.getTimestamp());

    }

}