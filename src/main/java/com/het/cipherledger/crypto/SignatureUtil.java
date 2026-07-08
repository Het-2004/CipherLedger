package com.het.cipherledger.crypto;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.nio.charset.StandardCharsets;

public final class SignatureUtil {

    private SignatureUtil(){}

    public static byte[] sign(String data, PrivateKey privateKey){
        try {Signature signature = Signature.getInstance("SHA256withECDSA");
            signature.initSign(privateKey);
            signature.update(data.getBytes(StandardCharsets.UTF_8));
            return signature.sign();
        }catch(Exception e){
            throw new RuntimeException("Signature creation failed", e);
        }
    }

    public static boolean verify(String data, byte[] signatureBytes, PublicKey publicKey){
        try {
            Signature signature = Signature.getInstance("SHA256withECDSA");
            signature.initVerify(publicKey);
            signature.update(data.getBytes(StandardCharsets.UTF_8));
            return signature.verify(signatureBytes);
        }catch(Exception e){
            return false;
        }
    }
}