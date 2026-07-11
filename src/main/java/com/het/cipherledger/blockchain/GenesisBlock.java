package com.het.cipherledger.blockchain;

import com.het.cipherledger.config.Constants;
import com.het.cipherledger.model.Block;

public final class GenesisBlock {

    private GenesisBlock() {
    }

    public static Block create() {
        Block genesis = new Block(0, Constants.GENESIS_PREVIOUS_HASH, "0", 0, System.currentTimeMillis());
        genesis.setHash(genesis.calculateHash());
        return genesis;
    }
}