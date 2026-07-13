package com.het.cipherledger.service;

import com.het.cipherledger.crypto.Ed25519Util;
import com.het.cipherledger.crypto.KeyGeneratorUtil;
import com.het.cipherledger.crypto.SchnorrUtil;
import com.het.cipherledger.crypto.SignatureUtil;
import org.springframework.stereotype.Service;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
public class BenchmarkService {

    public Map<String, Object> runSignatureBenchmark() {
        int runs = 500;
        byte[] data = "CipherLedger Security Benchmark Data Payload".getBytes();

        KeyPair ecdsaKeys = KeyGeneratorUtil.generateKeyPair();
        KeyPair ed25519Keys = Ed25519Util.generateKeyPair();
        
        KeyPair schnorrKeys;
        try {
            KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
            kpg.initialize(new java.security.spec.ECGenParameterSpec("secp256k1"), new SecureRandom());
            schnorrKeys = kpg.generateKeyPair();
        } catch (Exception e) {
            schnorrKeys = ecdsaKeys;
        }

        long ecdsaSignStart = System.nanoTime();
        byte[] ecdsaSig = null;
        for (int i = 0; i < runs; i++) {
            ecdsaSig = SignatureUtil.sign(new String(data), ecdsaKeys.getPrivate());
        }
        long ecdsaSignEnd = System.nanoTime();
        
        long ecdsaVerifyStart = System.nanoTime();
        for (int i = 0; i < runs; i++) {
            SignatureUtil.verify(new String(data), ecdsaSig, ecdsaKeys.getPublic());
        }
        long ecdsaVerifyEnd = System.nanoTime();

        long edSignStart = System.nanoTime();
        byte[] edSig = null;
        for (int i = 0; i < runs; i++) {
            edSig = Ed25519Util.sign(data, ed25519Keys.getPrivate());
        }
        long edSignEnd = System.nanoTime();

        long edVerifyStart = System.nanoTime();
        for (int i = 0; i < runs; i++) {
            Ed25519Util.verify(data, edSig, ed25519Keys.getPublic());
        }
        long edVerifyEnd = System.nanoTime();

        long schnorrSignStart = System.nanoTime();
        byte[] schnorrSig = null;
        for (int i = 0; i < runs; i++) {
            schnorrSig = SchnorrUtil.sign(data, schnorrKeys.getPrivate());
        }
        long schnorrSignEnd = System.nanoTime();

        long schnorrVerifyStart = System.nanoTime();
        for (int i = 0; i < runs; i++) {
            SchnorrUtil.verify(data, schnorrSig, schnorrKeys.getPublic());
        }
        long schnorrVerifyEnd = System.nanoTime();

        Map<String, Object> results = new HashMap<>();
        results.put("runs", runs);
        results.put("ecdsa", createMetricsMap(ecdsaSignStart, ecdsaSignEnd, ecdsaVerifyStart, ecdsaVerifyEnd, ecdsaSig != null ? ecdsaSig.length : 64, runs));
        results.put("ed25519", createMetricsMap(edSignStart, edSignEnd, edVerifyStart, edVerifyEnd, edSig != null ? edSig.length : 64, runs));
        results.put("schnorr", createMetricsMap(schnorrSignStart, schnorrSignEnd, schnorrVerifyStart, schnorrVerifyEnd, schnorrSig != null ? schnorrSig.length : 64, runs));

        return results;
    }

    private Map<String, Object> createMetricsMap(long signStart, long signEnd, long verifyStart, long verifyEnd, int sigSize, int runs) {
        double signTimeNs = (double) (signEnd - signStart) / runs;
        double verifyTimeNs = (double) (verifyEnd - verifyStart) / runs;
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("signLatencyNs", signTimeNs);
        metrics.put("verifyLatencyNs", verifyTimeNs);
        metrics.put("opsPerSecondSign", (long) (1_000_000_000.0 / signTimeNs));
        metrics.put("opsPerSecondVerify", (long) (1_000_000_000.0 / verifyTimeNs));
        metrics.put("signatureSizeBytes", sigSize);
        return metrics;
    }
}
