package com.het.cipherledger.mining;

import com.het.cipherledger.model.Block;

public class ProofOfWork {
    public void mine(Block block){
        String target = Difficulty.getTarget();

        while(!block.getHash().startsWith(target)){
            block.incrementNonce();
            block.updateHash();
        }
    }
}