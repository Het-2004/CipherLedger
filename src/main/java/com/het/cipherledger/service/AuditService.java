package com.het.cipherledger.service;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AuditService {

    private final BlockchainService blockchainService;

    public AuditService(BlockchainService blockchainService) {
        this.blockchainService = blockchainService;
    }

    public Map<String, Object> runSecurityAudit() {
        List<Block> chain = blockchainService.getChain();
        List<Map<String, Object>> vulnerabilities = new ArrayList<>();
        
        int totalBlocks = chain.size();
        int totalTx = 0;
        int signatureIssues = 0;
        int chainBrokenCount = 0;
        int hashMismatchCount = 0;
        
        Set<String> uniqueTxIds = new HashSet<>();
        int doubleSpentAlerts = 0;

        for (int i = 0; i < chain.size(); i++) {
            Block block = chain.get(i);
            
            if (i > 0) {
                Block prevBlock = chain.get(i - 1);
                if (!block.getPreviousHash().equals(prevBlock.getHash())) {
                    chainBrokenCount++;
                    Map<String, Object> vuln = new HashMap<>();
                    vuln.put("severity", "CRITICAL");
                    vuln.put("component", "Blockchain Chaining");
                    vuln.put("description", "Broken pointer chain between Block #" + (i - 1) + " and Block #" + i);
                    vulnerabilities.add(vuln);
                }
            }
            
            String calculatedHash = block.calculateHash();
            if (!calculatedHash.equals(block.getHash())) {
                hashMismatchCount++;
                Map<String, Object> vuln = new HashMap<>();
                vuln.put("severity", "HIGH");
                vuln.put("component", "Block Integrity");
                vuln.put("description", "Block #" + block.getIndex() + " hash mismatch (calculated vs declared)");
                vulnerabilities.add(vuln);
            }

            for (Transaction tx : block.getTransactions()) {
                totalTx++;
                if (tx.getSignature() == null || tx.getSignature().length == 0) {
                    signatureIssues++;
                    Map<String, Object> vuln = new HashMap<>();
                    vuln.put("severity", "HIGH");
                    vuln.put("component", "Transaction Cryptography");
                    vuln.put("description", "Unsigned transaction detected in Block #" + block.getIndex() + " (TxID: " + tx.getTransactionId() + ")");
                    vulnerabilities.add(vuln);
                }
                
                if (uniqueTxIds.contains(tx.getTransactionId())) {
                    doubleSpentAlerts++;
                    Map<String, Object> vuln = new HashMap<>();
                    vuln.put("severity", "CRITICAL");
                    vuln.put("component", "Double Spent Protection");
                    vuln.put("description", "Duplicate Transaction Replay detected for TxID: " + tx.getTransactionId());
                    vulnerabilities.add(vuln);
                } else {
                    uniqueTxIds.add(tx.getTransactionId());
                }
            }
        }

        if (vulnerabilities.isEmpty()) {
            Map<String, Object> vuln = new HashMap<>();
            vuln.put("severity", "INFO");
            vuln.put("component", "Security Scanner");
            vuln.put("description", "Static analysis complete. All hash chains match, signatures are present, and replay protection checks passed.");
            vulnerabilities.add(vuln);
        }

        Map<String, Object> report = new HashMap<>();
        report.put("totalBlocksScanned", totalBlocks);
        report.put("totalTransactionsScanned", totalTx);
        report.put("securityScore", Math.max(0, 100 - (chainBrokenCount * 50) - (hashMismatchCount * 20) - (signatureIssues * 15) - (doubleSpentAlerts * 30)));
        report.put("vulnerabilities", vulnerabilities);
        report.put("timestamp", System.currentTimeMillis());
        return report;
    }
}
