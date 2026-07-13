package com.het.cipherledger.service;

import com.het.cipherledger.model.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AIEngineService {

    private static final Logger auditLogger = LoggerFactory.getLogger("com.het.cipherledger.security");
    private final Random random = new Random();

    /**
     * Simulates AI Fraud Detection on a Transaction.
     * Checks for unusual volumes or suspicious patterns.
     */
    public Map<String, Object> analyzeTransaction(Transaction transaction) {
        Map<String, Object> result = new HashMap<>();
        double fraudScore = random.nextDouble() * 100; // Simulated AI score (0-100)
        
        // Simple heuristic: very high amounts are riskier
        if (transaction.getAmount() > 10000) {
            fraudScore += 20;
        }

        fraudScore = Math.min(fraudScore, 100.0);

        result.put("transactionId", transaction.getTransactionId());
        result.put("fraudScore", fraudScore);
        result.put("isFraudulent", fraudScore > 85.0);

        if (fraudScore > 85.0) {
            auditLogger.warn("AI Fraud Alert: Transaction {} scored {}", transaction.getTransactionId(), fraudScore);
        } else {
            auditLogger.info("Transaction {} cleared AI Fraud Check with score {}", transaction.getTransactionId(), fraudScore);
        }

        return result;
    }

    /**
     * Simulates AI Smart Contract Audit.
     * Scans contract code for vulnerabilities (like reentrancy or infinite loops).
     */
    public Map<String, Object> auditSmartContract(String contractCode) {
        Map<String, Object> result = new HashMap<>();
        int vulnerabilityCount = 0;
        
        if (contractCode.contains("while(true)") || contractCode.contains("for(;;)")) {
            vulnerabilityCount++;
            auditLogger.warn("AI Audit: Infinite loop detected in contract.");
        }
        
        if (contractCode.contains("eval(")) {
            vulnerabilityCount++;
            auditLogger.warn("AI Audit: Unsafe eval() usage detected in contract.");
        }

        result.put("vulnerabilitiesFound", vulnerabilityCount);
        result.put("isSafe", vulnerabilityCount == 0);
        result.put("auditScore", 100 - (vulnerabilityCount * 25)); // Simple score reduction

        return result;
    }

    /**
     * Simulates AI Network Threat Detection.
     * Checks if a connecting node has a suspicious signature.
     */
    public Map<String, Object> analyzeNetworkThreat(String ipAddress) {
        Map<String, Object> result = new HashMap<>();
        double threatScore = random.nextDouble() * 100; // Simulated threat score
        
        result.put("ipAddress", ipAddress);
        result.put("threatScore", threatScore);
        result.put("isMalicious", threatScore > 90.0);

        if (threatScore > 90.0) {
            auditLogger.warn("AI Threat Alert: Suspicious network activity from IP {}", ipAddress);
        }

        return result;
    }

    /**
     * Simulates AI Mining Optimization.
     * Suggests a starting nonce to improve mining efficiency.
     */
    public Map<String, Object> optimizeMining() {
        Map<String, Object> result = new HashMap<>();
        long suggestedNonce = Math.abs(random.nextLong());
        result.put("suggestedStartingNonce", suggestedNonce);
        result.put("efficiencyGainEstimate", String.format("%.2f%%", (random.nextDouble() * 15)));
        
        auditLogger.info("AI Mining: Suggested optimal nonce range starting at {}", suggestedNonce);
        return result;
    }
}
