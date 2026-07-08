package com.het.cipherledger;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.blockchain.BlockchainValidator;
import com.het.cipherledger.model.Transaction;

public class Main {

    public static void main(String[] args){

        Blockchain blockchain = new Blockchain();
        blockchain.addTransaction(new Transaction("Het", "Alex", "100"));
        blockchain.addTransaction(new Transaction("Alex", "John", "50"));
        BlockchainValidator validator = new BlockchainValidator();

        System.out.println("Blocks : " + blockchain.size());
        System.out.println("Valid : " + validator.validate(blockchain.getChain()));
    }

}