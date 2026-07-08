package com.het.cipherledger.blockchain;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.mining.Miner;
import java.util.ArrayList;
import java.util.List;

public class Blockchain {
    private List<Block> chain;

    public Blockchain(){
        chain = new ArrayList<>();
        chain.add(GenesisBlock.create());
    }

    public void addBlock(Block block){
        Miner miner = new Miner();
        miner.mineBlock(block);
        chain.add(block);
    }

    public Block createBlock(){
        Block previous = getLatestBlock();
        return new Block(previous.getHash());
    }

    public void addTransaction(Transaction transaction){
        Block block = createBlock();
        block.addTransaction(transaction);
        addBlock(block);
    }

    public Block getLatestBlock(){
        return chain.get(chain.size()-1);
    }

    public List<Block> getChain(){
        return chain;
    }

    public int size(){
        return chain.size();
    }
}