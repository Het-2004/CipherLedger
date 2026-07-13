package com.het.cipherledger.api;

import com.het.cipherledger.crypto.SecureKeyManager;
import com.het.cipherledger.crypto.ZkpEngine;
import com.het.cipherledger.crypto.ZkpEngine.ZkpProof;
import com.het.cipherledger.service.AuditService;
import com.het.cipherledger.service.BenchmarkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class SecurityPerformanceController {

    private final BenchmarkService benchmarkService;
    private final AuditService auditService;

    public SecurityPerformanceController(BenchmarkService benchmarkService, AuditService auditService) {
        this.benchmarkService = benchmarkService;
        this.auditService = auditService;
    }

    @GetMapping("/benchmark")
    public ResponseEntity<?> getBenchmarks() {
        return ResponseEntity.ok(benchmarkService.runSignatureBenchmark());
    }

    @GetMapping("/audit")
    public ResponseEntity<?> runAudit() {
        return ResponseEntity.ok(auditService.runSecurityAudit());
    }

    @PostMapping("/zkp/prove")
    public ResponseEntity<?> generateZkp(@RequestBody Map<String, String> request) {
        try {
            BigInteger x = new BigInteger(request.get("secret"));
            BigInteger p = ZkpEngine.getP();
            BigInteger g = ZkpEngine.getG();
            BigInteger y = g.modPow(x, p);

            ZkpProof proof = ZkpEngine.generateProof(x, y);

            Map<String, String> response = new HashMap<>();
            response.put("y", y.toString());
            response.put("t", proof.t.toString());
            response.put("r", proof.r.toString());
            response.put("c", proof.c.toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/zkp/verify")
    public ResponseEntity<?> verifyZkp(@RequestBody Map<String, String> request) {
        try {
            BigInteger y = new BigInteger(request.get("y"));
            BigInteger t = new BigInteger(request.get("t"));
            BigInteger r = new BigInteger(request.get("r"));
            BigInteger c = new BigInteger(request.get("c"));

            ZkpProof proof = new ZkpProof(t, r, c);
            boolean valid = ZkpEngine.verifyProof(y, proof);

            return ResponseEntity.ok(Map.of("valid", valid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/keystore/encrypt")
    public ResponseEntity<?> encryptPrivateKey(@RequestBody Map<String, String> request) {
        try {
            String privateKeyHex = request.get("privateKey");
            String address = request.get("address");
            String password = request.get("password");

            String keystoreJson = SecureKeyManager.encryptKey(privateKeyHex, address, password);
            return ResponseEntity.ok(Map.of("keystore", keystoreJson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/keystore/decrypt")
    public ResponseEntity<?> decryptPrivateKey(@RequestBody Map<String, String> request) {
        try {
            String keystoreJson = request.get("keystore");
            String password = request.get("password");

            String privateKeyHex = SecureKeyManager.decryptKey(keystoreJson, password);
            return ResponseEntity.ok(Map.of("privateKey", privateKeyHex));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
