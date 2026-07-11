package com.het.cipherledger.mining;

import com.het.cipherledger.config.Constants;
import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.RewardTransaction;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.wallet.Wallet;

public class Miner {

    private ProofOfWork proofOfWork;

    public Miner() {
        proofOfWork = new ProofOfWork();
    }

    public Block mineBlock(Block block, Wallet minerWallet) {
        Transaction reward = new RewardTransaction(minerWallet.getPublicKey(), Constants.MINING_REWARD);
        block.addTransaction(reward);
        System.out.println("Mining started...");

        proofOfWork.mine(block);

        System.out.println("Mining reward: " + Constants.MINING_REWARD);
        return block;
    }
}