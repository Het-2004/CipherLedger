package com.het.cipherledger.crypto;

import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;

public final class SignaturUtil {
    private SignaturUtil(){}

    public static byte[] sign(String data, PrivateKey privateKey){
        try{
            Signature signature = Signature.getInstance("SHA256withECDSA");
            signature.initSign(privateKey);
            return signature.sign();
        }catch(Exception e){
            throw new RuntimeException("sign failed",e);
        }
    }

    public static boolean verify(String data, PublicKey publicKey, byte[] signatureBytes){
        try{
            Signature signature = Signature.getInstance("SHA256withECDSA");
            signature.initVerify(publicKey);
            signature.update(data.getBytes());
            return signature.verify(signatureBytes);
        }catch(Exception e){return  false;}
    }
}
