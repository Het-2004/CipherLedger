package com.het.cipherledger.model;

import com.het.cipherledger.utils.StringUtils;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "blocks")
public class Block {

    @Id
    private String id;

    private int index;
    private String previousHash;
    private String hash;
    private int nonce;
    private long timestamp;
    private List<Transaction> transactions = new ArrayList<>();

    public Block() {
        this.timestamp = new Date().getTime();
    }

    public Block(String previousHash) {
        this.previousHash = previousHash;
        this.timestamp = new Date().getTime();
        this.hash = calculateHash();
    }

    public Block(int index, String previousHash, String hash, int nonce, long timestamp) {
        this.index = index;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
        this.timestamp = timestamp;
    }

    public String calculateHash() {
        return StringUtils.applySha256(
                previousHash +
                        Long.toString(timestamp) +
                        Integer.toString(nonce) +
                        transactions.toString()
        );
    }

    public void addTransaction(Transaction transaction) {
        if (transaction != null) {
            transactions.add(transaction);
        }
    }

    public void incrementNonce() {
        this.nonce++;
    }

    public void updateHash() {
        this.hash = calculateHash();
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getPreviousHash() {
        return previousHash;
    }

    public void setPreviousHash(String previousHash) {
        this.previousHash = previousHash;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public int getNonce() {
        return nonce;
    }

    public void setNonce(int nonce) {
        this.nonce = nonce;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}