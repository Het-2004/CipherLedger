package com.het.cipherledger.model;

import java.security.PublicKey;

public class RewardTransaction extends Transaction {

    public RewardTransaction(PublicKey miner, double reward) {
        super(miner.toString(), miner.toString(), reward, 0.0, 0);
    }
}