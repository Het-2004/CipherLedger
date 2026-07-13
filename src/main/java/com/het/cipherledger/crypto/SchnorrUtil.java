package com.het.cipherledger.crypto;

import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.ec.CustomNamedCurves;
import java.security.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.math.ec.ECPoint;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;

public class SchnorrUtil {

    private static final X9ECParameters CURVE = CustomNamedCurves.getByName("secp256k1");
    private static final ECParameterSpec SPEC = new ECParameterSpec(
            CURVE.getCurve(), CURVE.getG(), CURVE.getN(), CURVE.getH(), CURVE.getSeed());

    public static byte[] sign(byte[] message, PrivateKey privateKey) {
        try {
            ECPrivateKey ecPriv = (ECPrivateKey) privateKey;
            BigInteger d = ecPriv.getS();
            BigInteger n = SPEC.getN();
            
            SecureRandom random = new SecureRandom();
            BigInteger k;
            ECPoint R;
            do {
                k = new BigInteger(n.bitLength(), random);
            } while (k.compareTo(BigInteger.ZERO) <= 0 || k.compareTo(n) >= 0);
            
            R = SPEC.getG().multiply(k).normalize();
            
            // e = Hash(R.x || Message)
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(R.getAffineXCoord().getEncoded());
            digest.update(message);
            BigInteger e = new BigInteger(1, digest.digest()).mod(n);
            
            // s = (k - e * d) mod n
            BigInteger s = k.subtract(e.multiply(d)).mod(n);
            
            // Encode signature as concatenation of R.x (32 bytes) and s (32 bytes)
            byte[] rxBytes = R.getAffineXCoord().getEncoded();
            byte[] sBytes = s.toByteArray();
            
            byte[] signature = new byte[64];
            System.arraycopy(rxBytes, Math.max(0, rxBytes.length - 32), signature, Math.max(0, 32 - rxBytes.length), Math.min(32, rxBytes.length));
            System.arraycopy(sBytes, Math.max(0, sBytes.length - 32), signature, Math.max(32, 64 - sBytes.length), Math.min(32, sBytes.length));
            return signature;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static boolean verify(byte[] message, byte[] signature, PublicKey publicKey) {
        try {
            if (signature.length != 64) return false;
            
            byte[] rxBytes = new byte[32];
            byte[] sBytes = new byte[32];
            System.arraycopy(signature, 0, rxBytes, 0, 32);
            System.arraycopy(signature, 32, sBytes, 0, 32);
            
            BigInteger rx = new BigInteger(1, rxBytes);
            BigInteger s = new BigInteger(1, sBytes);
            BigInteger n = SPEC.getN();
            
            if (s.compareTo(n) >= 0) return false;
            
            ECPublicKey ecPub = (ECPublicKey) publicKey;
            ECPoint Q = ecPub.getQ();
            
            // Recompute e = Hash(rx || Message)
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(rxBytes);
            digest.update(message);
            BigInteger e = new BigInteger(1, digest.digest()).mod(n);
            
            // R' = s * G + e * Q
            ECPoint RPrime = SPEC.getG().multiply(s).add(Q.multiply(e)).normalize();
            
            if (RPrime.isInfinity()) return false;
            
            BigInteger rPrimeX = RPrime.getAffineXCoord().toBigInteger();
            return rPrimeX.equals(rx);
        } catch (Exception e) {
            return false;
        }
    }
}
