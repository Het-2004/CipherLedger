package com.het.cipherledger.blockchain;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;

import java.util.ArrayList;
import java.util.List;

public class Blockchain {

    private List<Block> chain;
    private List<Transaction> pendingTransactions = new ArrayList<>();

    public Blockchain() {
        chain = new ArrayList<>();
        chain.add(GenesisBlock.create());
    }

    public Block createBlock() {
        Block previous = getLatestBlock();
        Block newBlock = new Block(previous.getHash());
        newBlock.setIndex(previous.getIndex() + 1);
        return newBlock;
    }

    public void addBlock(Block block) {
        chain.add(block);
    }

    public void addTransaction(Transaction transaction) {
        pendingTransactions.add(transaction);
    }

    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    public List<Block> getChain() {
        return chain;
    }

    public int size() {
        return chain.size();
    }

    public List<Transaction> getPendingTransactions() {
        return pendingTransactions;
    }

    public void clearPendingTransactions() {
        pendingTransactions.clear();
    }
}