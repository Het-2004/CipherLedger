package com.het.cipherledger.api;

import com.het.cipherledger.service.AIEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // For local dev
public class AIAuditController {

    @Autowired
    private AIEngineService aiEngineService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getEnterpriseDashboard() {
        // Return a snapshot of the AI system's current mock state for the frontend
        Map<String, Object> dashboard = new HashMap<>();
        
        // Generate some mock network threats
        dashboard.put("networkThreats", aiEngineService.analyzeNetworkThreat("192.168.1." + (int)(Math.random() * 255)));
        
        // Generate mock mining optimization
        dashboard.put("miningOptimization", aiEngineService.optimizeMining());
        
        // Provide general system health
        dashboard.put("aiSystemStatus", "ONLINE");
        dashboard.put("lastAuditScan", System.currentTimeMillis());

        return ResponseEntity.ok(dashboard);
    }
}
