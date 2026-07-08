package com.het.cipherledger.mining;

import com.het.cipherledger.model.Block;

public class Miner {

    private ProofOfWork proofOfWork;

    public Miner(){
        proofOfWork = new ProofOfWork();
    }

    public Block mineBlock(Block block){
        System.out.println("Mining started...");
        proofOfWork.mine(block);
        System.out.println("Block mined:");
        System.out.println(block.getHash());
        return block;
    }
}