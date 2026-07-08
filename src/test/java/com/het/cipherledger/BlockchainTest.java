package com.het.cipherledger;

import com.het.cipherledger.blockchain.Blockchain;
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

        Transaction transaction = new Transaction(sender.getPublicKey(), receiver.getPublicKey(), 100);
        transaction.generateSignature(sender.getPrivateKey());
        Blockchain blockchain = new Blockchain();
        blockchain.addTransaction(transaction, miner);
        assertEquals(2, blockchain.size());
    }
}