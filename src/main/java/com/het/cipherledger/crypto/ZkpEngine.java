package com.het.cipherledger.crypto;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;

public class ZkpEngine {

    private static final BigInteger p = new BigInteger(
            "FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD1" +
            "29024E088A67CC74020BBEA63B139B22514A08798E3404DD" +
            "EF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245" +
            "E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED" +
            "EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE65381" +
            "FFFFFFFFFFFFFFFF", 16);
            
    private static final BigInteger g = BigInteger.valueOf(2);
    private static final BigInteger q = p.subtract(BigInteger.ONE).divide(BigInteger.valueOf(2));

    public static class ZkpProof {
        public BigInteger t; // Commitment
        public BigInteger r; // Response
        public BigInteger c; // Challenge

        public ZkpProof(BigInteger t, BigInteger r, BigInteger c) {
            this.t = t;
            this.r = r;
            this.c = c;
        }
    }

    public static ZkpProof generateProof(BigInteger x, BigInteger y) {
        try {
            SecureRandom random = new SecureRandom();
            BigInteger v;
            do {
                v = new BigInteger(q.bitLength(), random);
            } while (v.compareTo(BigInteger.ZERO) <= 0 || v.compareTo(q) >= 0);

            BigInteger t = g.modPow(v, p);

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(g.toByteArray());
            digest.update(y.toByteArray());
            digest.update(t.toByteArray());
            BigInteger c = new BigInteger(1, digest.digest()).mod(q);

            BigInteger cMulX = c.multiply(x).mod(q);
            BigInteger r = v.subtract(cMulX).mod(q);

            return new ZkpProof(t, r, c);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean verifyProof(BigInteger y, ZkpProof proof) {
        try {
            BigInteger t = proof.t;
            BigInteger r = proof.r;
            BigInteger c = proof.c;

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(g.toByteArray());
            digest.update(y.toByteArray());
            digest.update(t.toByteArray());
            BigInteger cPrime = new BigInteger(1, digest.digest()).mod(q);

            if (!c.equals(cPrime)) {
                return false;
            }

            BigInteger gToR = g.modPow(r, p);
            BigInteger yToC = y.modPow(c, p);
            BigInteger verification = gToR.multiply(yToC).mod(p);

            return verification.equals(t);
        } catch (Exception e) {
            return false;
        }
    }

    public static BigInteger getP() {
        return p;
    }

    public static BigInteger getG() {
        return g;
    }
}
