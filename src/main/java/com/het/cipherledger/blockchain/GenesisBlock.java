package com.het.cipherledger.blockchain;

import com.het.cipherledger.config.Constants;
import com.het.cipherledger.model.Block;

public final class GenesisBlock {

    private GenesisBlock(){}

    public static Block create(){
        Block genesis = new Block(Constants.GENESIS_PREVIOUS_HASH);
        return genesis;
    }
}