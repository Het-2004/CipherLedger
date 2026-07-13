package com.het.cipherledger.api;

import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.service.AIEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // For local dev
public class AIAuditController {

    @Autowired
    private AIEngineService aiEngineService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getEnterpriseDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        dashboard.put("networkThreats", aiEngineService.analyzeNetworkThreat("192.168.1." + (int)(Math.random() * 255)));
        dashboard.put("miningOptimization", aiEngineService.optimizeMining());
        dashboard.put("aiSystemStatus", "ONLINE");
        dashboard.put("lastAuditScan", System.currentTimeMillis());

        return ResponseEntity.ok(dashboard);
    }

    @PostMapping("/transaction/analyze")
    public ResponseEntity<Map<String, Object>> analyzeTransaction(@RequestBody Map<String, Object> request) {
        String txId = (String) request.getOrDefault("transactionId", "tx_" + System.currentTimeMillis());
        String sender = (String) request.getOrDefault("sender", "cl_addr_unknown");
        String receiver = (String) request.getOrDefault("receiver", "cl_addr_unknown");
        
        double amount = 0.0;
        Object amtObj = request.get("amount");
        if (amtObj instanceof Number) {
            amount = ((Number) amtObj).doubleValue();
        } else if (amtObj instanceof String) {
            try {
                amount = Double.parseDouble((String) amtObj);
            } catch (Exception e) {}
        }

        Transaction tx = new Transaction();
        tx.setSender(sender);
        tx.setReceiver(receiver);
        tx.setAmount(amount);
        tx.setTransactionId(txId);

        return ResponseEntity.ok(aiEngineService.analyzeTransaction(tx));
    }

    @PostMapping("/contract/audit")
    public ResponseEntity<Map<String, Object>> auditContract(@RequestBody Map<String, String> request) {
        String contractCode = request.getOrDefault("contractCode", "");
        return ResponseEntity.ok(aiEngineService.auditSmartContract(contractCode));
    }

    @GetMapping("/anomalies")
    public ResponseEntity<Map<String, Object>> getNetworkAnomalies() {
        // Generate simulated recent block interval times (in seconds)
        List<Long> blockTimes = new ArrayList<>();
        blockTimes.add(12L);
        blockTimes.add(11L);
        blockTimes.add(13L);
        blockTimes.add(12L);
        blockTimes.add(11L);
        blockTimes.add(12L);
        
        // Randomly simulate an anomaly 15% of the time for live frontend dashboard interaction
        if (Math.random() < 0.15) {
            blockTimes.add(29L); // Spike
        } else {
            blockTimes.add(12L);
        }

        return ResponseEntity.ok(aiEngineService.detectNetworkAnomaly(blockTimes));
    }

    @PostMapping("/assistant/chat")
    public ResponseEntity<Map<String, Object>> processAssistantChat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "help");
        return ResponseEntity.ok(aiEngineService.processAssistantMessage(message));
    }
}
