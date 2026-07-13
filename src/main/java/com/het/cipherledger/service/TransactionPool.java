package com.het.cipherledger.service;

import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class TransactionPool {

    // Maps transaction ID to Transaction
    private final Map<String, Transaction> mempool = new ConcurrentHashMap<>();

    public void addTransaction(Transaction tx) {
        if (!mempool.containsKey(tx.getTransactionId())) {
            mempool.put(tx.getTransactionId(), tx);
            System.out.println("Transaction added to mempool: " + tx.getTransactionId());
        }
    }

    public List<Transaction> getPendingTransactions() {
        return mempool.values().stream()
                // Sort by gas price descending
                .sorted((t1, t2) -> Double.compare(t2.getGasPrice(), t1.getGasPrice()))
                .collect(Collectors.toList());
    }

    public void removeTransactions(List<Transaction> transactions) {
        for (Transaction tx : transactions) {
            mempool.remove(tx.getTransactionId());
        }
    }

    public void clear() {
        mempool.clear();
    }
}
