package com.het.cipherledger;

import com.het.cipherledger.crypto.Ed25519Util;
import com.het.cipherledger.crypto.SchnorrUtil;
import com.het.cipherledger.crypto.SecureKeyManager;
import com.het.cipherledger.crypto.ZkpEngine;
import com.het.cipherledger.crypto.ZkpEngine.ZkpProof;
import com.het.cipherledger.wallet.MultiSigWallet;
import com.het.cipherledger.wallet.MultiSigWallet.MultiSigTx;
import org.junit.jupiter.api.Test;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

public class SecurityPerformanceTest {

    @Test
    public void testEd25519Cryptography() {
        KeyPair kp = Ed25519Util.generateKeyPair();
        assertNotNull(kp);
        assertNotNull(kp.getPrivate());
        assertNotNull(kp.getPublic());

        byte[] message = "CipherLedger Ed25519 Test".getBytes();
        byte[] sig = Ed25519Util.sign(message, kp.getPrivate());
        assertNotNull(sig);

        boolean verified = Ed25519Util.verify(message, sig, kp.getPublic());
        assertTrue(verified);

        boolean tampered = Ed25519Util.verify("Tampered message".getBytes(), sig, kp.getPublic());
        assertFalse(tampered);
    }

    @Test
    public void testSchnorrCryptography() throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
        kpg.initialize(new java.security.spec.ECGenParameterSpec("secp256k1"), new SecureRandom());
        KeyPair kp = kpg.generateKeyPair();

        byte[] message = "CipherLedger Schnorr Test".getBytes();
        byte[] sig = SchnorrUtil.sign(message, kp.getPrivate());
        assertEquals(64, sig.length);

        boolean verified = SchnorrUtil.verify(message, sig, kp.getPublic());
        assertTrue(verified);

        boolean tampered = SchnorrUtil.verify("Tampered".getBytes(), sig, kp.getPublic());
        assertFalse(tampered);
    }

    @Test
    public void testZeroKnowledgeProof() {
        BigInteger secret = new BigInteger("1337");
        BigInteger p = ZkpEngine.getP();
        BigInteger g = ZkpEngine.getG();
        BigInteger y = g.modPow(secret, p);

        ZkpProof proof = ZkpEngine.generateProof(secret, y);
        assertNotNull(proof);

        boolean verified = ZkpEngine.verifyProof(y, proof);
        assertTrue(verified);

        BigInteger wrongY = y.add(BigInteger.ONE);
        boolean wrongVerified = ZkpEngine.verifyProof(wrongY, proof);
        assertFalse(wrongVerified);
    }

    @Test
    public void testSecureKeyManagement() {
        String privateKeyHex = "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5";
        String address = "cl_ops_vault_test";
        String password = "SecurePassword1!";

        String keystore = SecureKeyManager.encryptKey(privateKeyHex, address, password);
        assertNotNull(keystore);
        assertTrue(keystore.contains("ciphertext"));
        assertTrue(keystore.contains("iterations"));

        String decrypted = SecureKeyManager.decryptKey(keystore, password);
        assertEquals(privateKeyHex, decrypted);

        assertThrows(RuntimeException.class, () -> {
            SecureKeyManager.decryptKey(keystore, "WrongPassword");
        });
    }

    @Test
    public void testMultiSigWallet() {
        List<String> keys = Arrays.asList("pubkey_1", "pubkey_2", "pubkey_3");
        MultiSigWallet msWallet = new MultiSigWallet(keys, 2);
        assertNotNull(msWallet.getAddress());
        assertTrue(msWallet.getAddress().startsWith("multisig_"));

        MultiSigTx tx = msWallet.proposeTransaction("tx_01", "recipient_addr", 10.5);
        assertNotNull(tx);

        assertFalse(msWallet.isFullySigned("tx_01"));

        // Sign 1
        boolean signed1 = msWallet.addSignature("tx_01", "pubkey_1");
        assertTrue(signed1);
        assertFalse(msWallet.isFullySigned("tx_01"));

        // Sign 2
        boolean signed2 = msWallet.addSignature("tx_01", "pubkey_2");
        assertTrue(signed2);
        assertTrue(msWallet.isFullySigned("tx_01"));

        // Sign invalid key
        boolean signedInvalid = msWallet.addSignature("tx_01", "pubkey_invalid");
        assertFalse(signedInvalid);
    }
}
