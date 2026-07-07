package com.het.cipherledger.crypto;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public final class KeyGeneratorUtil{
    private KeyGeneratorUtil(){}

    public static KeyPair generatekeyPair(){
        try{
            KeyPairGenerator generator = KeyPairGenerator.getInstance("EC");
            generator.initialize(256);
            return generator.generateKeyPair();
        }catch(Exception e){
            throw new RuntimeException("key generation failed",e);
        }
    }
}