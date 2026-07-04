package com.het.cipherledger.blockchain;

import com.het.cipherledger.model.Block;

import java.util.ArrayList;
import java.util.List;

/**
 * ==================================================
 * Project : CipherLedger
 * Class   : Blockchain
 * Purpose : Manage blocks in the chain
 * ==================================================
 */

public class Blockchain {
    /*
        Stores all blocks
    */
    private final List<Block> chain;

    /*
        Constructor
    */
    public Blockchain(){
        this.chain = new ArrayList<>();
        createGenesisBlock();
    }

    /*
        First block in blockchain
    */
    private void createGenesisBlock(){
        Block genesisBlock = new Block("Genesis Block", "0");
        chain.add(genesisBlock);
    }

    /*
        Add new block
    */
    public void addBlock(String data){
        Block previousBlock = getLatestBlock();
        Block newBlock = new Block(data, previousBlock.getHash());
        chain.add(newBlock);
    }

    /*
        Get latest block
    */
    public Block getLatestBlock() {
        return chain.get(chain.size() - 1);
    }

    /*
        return complete blockchain
    */
    public List<Block> getChain(){
        return chain;
    }
}