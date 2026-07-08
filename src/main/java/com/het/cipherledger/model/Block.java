package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;
import com.het.cipherledger.crypto.MerkleTree;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

public class Block {
    private String hash;
    private String previousHash;
    private long timestamp;
    private int nonce;
    private List<Transaction> transactions;
    private String merkleRoot;

    public Block(String previousHash){

        this.previousHash = previousHash;
        this.timestamp = System.currentTimeMillis();
        this.nonce = 0;
        this.transactions = new ArrayList<>();
        this.hash = calculateHash();
    }

    public void updateMerkleRoot() {
        List<String> hashes = transactions.stream().map(Transaction::getTransactionId).collect(Collectors.toList());
        merkleRoot = MerkleTree.getMerkleRoot(hashes);
    }

    public String calculateHash(){
        return HashUtil.generateHash(previousHash + timestamp + nonce + merkleRoot);
    }

    public void addTransaction(Transaction transaction){
        transactions.add(transaction);
        updateMerkleRoot();
        this.hash = calculateHash();
    }

    public String getMerkleRoot() {return merkleRoot;}

    public String getHash(){
        return hash;
    }

    public String getPreviousHash(){
        return previousHash;
    }

    public List<Transaction> getTransactions(){
        return transactions;
    }

    public int getNonce(){
        return nonce;
    }

    public void incrementNonce(){
        nonce++;
    }

    public void updateHash(){
        hash = calculateHash();
    }
}