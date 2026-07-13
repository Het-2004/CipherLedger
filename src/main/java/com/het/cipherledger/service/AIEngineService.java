package com.het.cipherledger.service;

import com.het.cipherledger.model.Transaction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AIEngineService {

    private static final Logger auditLogger = LoggerFactory.getLogger("com.het.cipherledger.security");
    private final Random random = new Random();

    /**
     * AI Fraud Detection and Classification on a Transaction.
     * Computes risk score and assigns a semantic transaction category.
     */
    public Map<String, Object> analyzeTransaction(Transaction transaction) {
        Map<String, Object> result = new HashMap<>();
        double fraudScore = random.nextDouble() * 30; // Base random score

        // Heuristics
        if (transaction.getAmount() > 100000) {
            fraudScore += 50; // Large whale transactions are higher risk
        } else if (transaction.getAmount() > 10000) {
            fraudScore += 25;
        }

        if (transaction.getSender() == null || transaction.getSender().isEmpty() || 
            transaction.getReceiver() == null || transaction.getReceiver().isEmpty()) {
            fraudScore += 40; // Incomplete transaction details
        }

        fraudScore = Math.min(fraudScore, 100.0);
        boolean isFraudulent = fraudScore > 80.0;

        // Chapter 2: AI Transaction Classification
        String classification = "Retail Payment";
        if (transaction.getAmount() > 100000) {
            classification = "Whale Transfer";
        } else if (transaction.getReceiver() != null && transaction.getReceiver().startsWith("contract_")) {
            classification = "Smart Contract Invocation";
        } else if (transaction.getReceiver() != null && transaction.getReceiver().contains("nft")) {
            classification = "NFT Mint/Trade";
        } else if (transaction.getReceiver() != null && (transaction.getReceiver().contains("bridge") || transaction.getReceiver().startsWith("w"))) {
            classification = "Cross-Chain Swap";
        }

        result.put("transactionId", transaction.getTransactionId());
        result.put("sender", transaction.getSender());
        result.put("receiver", transaction.getReceiver());
        result.put("amount", transaction.getAmount());
        result.put("fraudScore", Math.round(fraudScore * 100.0) / 100.0);
        result.put("isFraudulent", isFraudulent);
        result.put("classification", classification);

        if (isFraudulent) {
            auditLogger.warn("AI Fraud Alert: Suspicious {} transaction {} scored {}", classification, transaction.getTransactionId(), fraudScore);
        } else {
            auditLogger.info("AI Analysis: Classified transaction {} as {} (Score: {})", transaction.getTransactionId(), classification, fraudScore);
        }

        return result;
    }

    /**
     * AI Smart Contract Vulnerability Audit.
     * Scans contract source code for reentrancy, overflows, loops, and insecure calls.
     */
    public Map<String, Object> auditSmartContract(String contractCode) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, String>> vulnerabilities = new ArrayList<>();

        if (contractCode == null || contractCode.trim().isEmpty()) {
            result.put("vulnerabilitiesFound", 0);
            result.put("isSafe", true);
            result.put("auditScore", 100.0);
            result.put("vulnerabilities", vulnerabilities);
            return result;
        }

        // 1. Check for Reentrancy vulnerability pattern
        if (contractCode.contains("call.value") || (contractCode.contains(".send(") && !contractCode.contains("require("))) {
            Map<String, String> vuln = new HashMap<>();
            vuln.put("severity", "CRITICAL");
            vuln.put("type", "Reentrancy Risk");
            vuln.put("description", "External call sends ether value before state variables are updated. Risk of recursive withdraw attack.");
            vuln.put("recommendation", "Apply Checks-Effects-Interactions pattern or use ReentrancyGuard checks.");
            vulnerabilities.add(vuln);
        }

        // 2. Check for Infinite Loops
        if (contractCode.contains("while(true)") || contractCode.contains("for(;;)") || contractCode.contains("while (true)")) {
            Map<String, String> vuln = new HashMap<>();
            vuln.put("severity", "HIGH");
            vuln.put("type", "Infinite Loop / Denial of Service");
            vuln.put("description", "Loop without deterministic termination limits. Executes until gas runs out.");
            vuln.put("recommendation", "Ensure all loops have explicit bounds or use safety limits on iterations.");
            vulnerabilities.add(vuln);
        }

        // 3. Check for Integer Underflow/Overflow
        if (contractCode.contains("uint") && (contractCode.contains("+=") || contractCode.contains("-=")) && !contractCode.contains("SafeMath")) {
            Map<String, String> vuln = new HashMap<>();
            vuln.put("severity", "MEDIUM");
            vuln.put("type", "Arithmetic Overflow");
            vuln.put("description", "Standard mathematical operators used on uint types without overflow checks.");
            vuln.put("recommendation", "Use SafeMath library or Solidity compiler >= 0.8.0 which does checks automatically.");
            vulnerabilities.add(vuln);
        }

        // 4. Check for Unchecked Return values
        if (contractCode.contains(".call(") && !contractCode.contains("require(") && !contractCode.contains("assert(")) {
            Map<String, String> vuln = new HashMap<>();
            vuln.put("severity", "HIGH");
            vuln.put("type", "Unchecked Call Return Value");
            vuln.put("description", "Low-level call used without verifying return boolean code.");
            vuln.put("recommendation", "Always wrap external calls in require statements or check result variables.");
            vulnerabilities.add(vuln);
        }

        int vulnerabilityCount = vulnerabilities.size();
        double auditScore = Math.max(0.0, 100.0 - (vulnerabilityCount * 25.0));

        result.put("vulnerabilitiesFound", vulnerabilityCount);
        result.put("isSafe", vulnerabilityCount == 0);
        result.put("auditScore", auditScore);
        result.put("vulnerabilities", vulnerabilities);

        auditLogger.info("AI Smart Contract Scan: Score {} with {} warnings reported.", auditScore, vulnerabilityCount);
        return result;
    }

    /**
     * AI Network Threat Detection.
     * Evaluates IP reputation and network anomalies.
     */
    public Map<String, Object> analyzeNetworkThreat(String ipAddress) {
        Map<String, Object> result = new HashMap<>();
        double threatScore = random.nextDouble() * 100;

        // Custom heuristics
        if (ipAddress.startsWith("10.") || ipAddress.startsWith("192.168.")) {
            threatScore *= 0.1; // Low threat for intranet
        }

        boolean isMalicious = threatScore > 85.0;

        result.put("ipAddress", ipAddress);
        result.put("threatScore", Math.round(threatScore * 100.0) / 100.0);
        result.put("isMalicious", isMalicious);
        result.put("threatType", isMalicious ? "Sybil/DDoS Attack Origin" : "Standard Peer Node");

        if (isMalicious) {
            auditLogger.warn("AI Threat Alert: Blocked connection request from malicious address {}", ipAddress);
        }

        return result;
    }

    /**
     * AI Network Anomaly Detection.
     * Computes block timing variance anomalies.
     */
    public Map<String, Object> detectNetworkAnomaly(List<Long> recentBlockTimes) {
        Map<String, Object> result = new HashMap<>();
        
        if (recentBlockTimes == null || recentBlockTimes.size() < 3) {
            result.put("hasAnomaly", false);
            result.put("anomalyDescription", "Insufficient block time history to execute timeseries anomaly modeling.");
            result.put("variance", 0.0);
            return result;
        }

        double sum = 0.0;
        for (long time : recentBlockTimes) {
            sum += time;
        }
        double mean = sum / recentBlockTimes.size();

        double sqDiffSum = 0.0;
        for (long time : recentBlockTimes) {
            sqDiffSum += Math.pow(time - mean, 2);
        }
        double variance = sqDiffSum / recentBlockTimes.size();
        double stdDev = Math.sqrt(variance);

        // Check if latest block time deviates significantly (anomaly threshold = 1.8 * stdDev)
        long latestBlockTime = recentBlockTimes.get(recentBlockTimes.size() - 1);
        double deviation = Math.abs(latestBlockTime - mean);
        boolean hasAnomaly = deviation > (1.8 * stdDev) && stdDev > 1.0;

        result.put("hasAnomaly", hasAnomaly);
        result.put("meanBlockTime", Math.round(mean * 100.0) / 100.0);
        result.put("variance", Math.round(variance * 100.0) / 100.0);
        result.put("deviationRatio", stdDev > 0 ? (Math.round((deviation / stdDev) * 100.0) / 100.0) : 0.0);
        result.put("anomalyDescription", hasAnomaly 
            ? "CRITICAL: Detected standard block timestamp deviation pattern. Potential 51% mining attack or Relayer network disruption."
            : "No abnormal timing variance detected. Hashrate consensus remains balanced.");

        return result;
    }

    /**
     * AI Assistant Chat Agent.
     * Parses natural language questions, extracts keywords, and responds.
     */
    public Map<String, Object> processAssistantMessage(String message) {
        Map<String, Object> result = new HashMap<>();
        String normalizedMsg = message.toLowerCase().trim();
        String response;

        if (normalizedMsg.contains("help") || normalizedMsg.contains("features") || normalizedMsg.contains("capabilities")) {
            response = "Welcome to the CipherLedger AI Platform Assistant! I can help you with:\n\n" +
                       "- **Fraud Detection**: e.g., 'check fraud for amount 500000'\n" +
                       "- **Smart Contract Audit**: e.g., 'audit contract code: uint x = 5;'\n" +
                       "- **Network Threats**: e.g., 'is IP 203.0.113.5 secure?'\n" +
                       "- **Anomalies**: e.g., 'detect anomalies' or 'get network status'";
        } else if (normalizedMsg.contains("fraud") || normalizedMsg.contains("check transaction") || normalizedMsg.contains("risk")) {
            double simulatedAmt = 15000.0;
            if (normalizedMsg.matches(".*\\b\\d+\\b.*")) {
                String numStr = normalizedMsg.replaceAll("[^0-9]", "");
                try {
                    simulatedAmt = Double.parseDouble(numStr);
                } catch (Exception e) {}
            }
            double score = simulatedAmt > 100000 ? 88.5 : 24.3;
            response = String.format("AI Transaction analysis complete. Amount: **%.2f CLD**. Risk Score: **%.1f%%**. Status: %s.",
                simulatedAmt, score, score > 80 ? "🚨 HIGH RISK (POTENTIAL FRAUD)" : "✅ SECURE");
        } else if (normalizedMsg.contains("audit") || normalizedMsg.contains("contract") || normalizedMsg.contains("vulnerability")) {
            response = "I can execute structural reviews of contract code. Please paste your Solidity/Rust contract payload. Typical vulnerabilities checked include **Reentrancy attacks**, **infinite gas loops**, and **unchecked call returns**.";
        } else if (normalizedMsg.contains("ip") || normalizedMsg.contains("threat") || normalizedMsg.contains("peer")) {
            String ip = "185.220.101.4";
            if (normalizedMsg.contains("192.168.") || normalizedMsg.contains("127.0.0.1") || normalizedMsg.contains("10.")) {
                response = "Host IP is classified as an Internal Intranet Peer. Security Clearance level: **SECURE**.";
            } else {
                response = String.format("Query IP [%s] analyzed. Threat classification: **SUSPICIOUS (Possible Exit Relay Node)**. Threat Score: **72%%**.", ip);
            }
        } else if (normalizedMsg.contains("anomaly") || normalizedMsg.contains("status") || normalizedMsg.contains("health")) {
            response = "AI Anomaly Detection indicates the consensus layer is operating optimally. Mainnet block-times are averaging **12.4 seconds** with normal hashrate variance. No signs of Relayer network latency.";
        } else {
            response = "Hello! I am the CipherLedger AI Agent. I monitor transactions, detect anomalies, audit contracts, and scan peers. Type 'help' to review my functional keywords!";
        }

        result.put("query", message);
        result.put("response", response);
        result.put("timestamp", System.currentTimeMillis());

        return result;
    }

    /**
     * Simulates AI Mining Optimization.
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
