package com.het.cipherledger.api;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.service.AIEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private static final List<Transaction> transactionPool = new ArrayList<>();
    private final com.het.cipherledger.websocket.BlockSocketService socketService;

    @Autowired
    private AIEngineService aiEngineService;

    public TransactionController(com.het.cipherledger.websocket.BlockSocketService socketService) {
        this.socketService = socketService;
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return transactionPool;
    }

    @PostMapping
    public ResponseEntity<?> sendTransaction(@RequestBody Transaction transaction) {
        // AI Fraud Detection check
        Map<String, Object> aiResult = aiEngineService.analyzeTransaction(transaction);
        if ((boolean) aiResult.get("isFraudulent")) {
            return ResponseEntity.status(403).body("Transaction blocked by AI Fraud Detection Engine. Score: " + aiResult.get("fraudScore"));
        }

        if (transaction.getTransactionId() == null) {
            if (transaction.getGasLimit() == 0) transaction.setGasLimit(21000); // Base limit
            if (transaction.getGasPrice() == 0) transaction.setGasPrice(0.00001); // Min price
            
            transaction.setTransactionId("tx-" + Math.floor(Math.random() * 1000000));
        }
        transactionPool.add(transaction);
        
        // Broadcast via WebSocket
        socketService.sendTransaction(transaction);
        
        System.out.println("Transaction added to backend pool and broadcasted: " + transaction.getTransactionId());
        return ResponseEntity.ok(true);
    }

    @GetMapping("/estimate")
    public java.util.Map<String, Object> estimateGas() {
        java.util.Map<String, Object> estimation = new java.util.HashMap<>();
        estimation.put("baseGasLimit", 21000);
        estimation.put("suggestedGasPrice", 0.000015);
        estimation.put("priorityGasPrice", 0.00005);
        return estimation;
    }

    public static List<Transaction> getPool() {
        return transactionPool;
    }

    public static void clearPool() {
        transactionPool.clear();
    }
}
