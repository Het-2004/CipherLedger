package com.het.cipherledger.config;

/**
 * Global blockchain configuration.
 */

public class BlockchainConfig{
    private int difficulty;
    private double miningReward;
    private int maxTransactionPerBlock;

    public BlockchainConfig(){
        this.difficulty = Constants.MINING_DIFFICULTY;
        this.miningReward = Constants.MINING_REWARD;
        this.maxTransactionPerBlock = 10;
    }

    public int getDifficulty() {
        return difficulty;
    }
    public double getMiningReward() {
        return miningReward;
    }
    public int getMaxTransactionPerBlock() {
        return maxTransactionPerBlock;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }
    public void setMiningReward(double miningReward) {
        this.miningReward = miningReward;
    }
    public void setMaxTransactionPerBlock(int maxTransactionPerBlock) {
        this.maxTransactionPerBlock = maxTransactionPerBlock;
    }
}