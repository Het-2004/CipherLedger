package com.het.cipherledger.crypto;

import java.util.Base64;

public final class Base58 {

    private Base58(){}
    public static String encode(byte[] data){
        return Base64.getEncoder().encodeToString(data);
    }

    public static byte[] decode(String data){
        return Base64.getDecoder().decode(data);
    }
}