package com.het.cipherledger.api;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Block;

import java.util.List;

public class BlockchainController {

    private final Blockchain blockchain;

    public BlockchainController(){
        blockchain = new Blockchain();
    }

    public List<Block> getBlockchain(){
        return blockchain.getChain();
    }

    public int getBlockCount(){
        return blockchain.size();
    }
}