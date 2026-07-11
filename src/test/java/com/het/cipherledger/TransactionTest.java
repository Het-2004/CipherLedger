package com.het.cipherledger;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionTest {

    @Test
    void transactionCreateTest() {

        WalletManager manager = new WalletManager();

        Wallet sender = manager.createWallet();
        Wallet receiver = manager.createWallet();

        Transaction transaction = new Transaction(sender.getAddress(), receiver.getAddress(), 500);
        transaction.generateSignature(sender.getPrivateKey());
        assertNotNull(transaction.getTransactionId());
        assertEquals(500, transaction.getAmount());
        assertTrue(transaction.verifySignature());
    }
}