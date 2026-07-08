package com.het.cipherledger;

import com.het.cipherledger.model.Transaction;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TransactionTest {

    @Test
    void transactionCreateTest(){

        Transaction transaction = new Transaction("Het", "Alex", 500);
        assertNotNull(transaction.getTransactionId());
        assertEquals(500, transaction.getAmount());
    }
}