package com.het.cipherledger;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class BlockchainTest {

    @Test
    void addBlockTest() {

        WalletManager manager = new WalletManager();
        Wallet sender = manager.createWallet();
        Wallet receiver = manager.createWallet();
        Wallet miner = manager.createWallet();

        Transaction transaction = new Transaction(sender.getAddress(), receiver.getAddress(), 100, 0.00001, 21000);
        transaction.generateSignature(sender.getPrivateKey());
        Blockchain blockchain = new Blockchain();
        Block newBlock = blockchain.createBlock();
        newBlock.addTransaction(transaction);
        blockchain.addBlock(newBlock);
        assertEquals(2, blockchain.size());
    }
}