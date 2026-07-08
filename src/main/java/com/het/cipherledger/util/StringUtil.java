package com.het.cipherledger.util;

public final class StringUtil {

    private StringUtil(){}
    public static boolean isEmpty(String value){
        return value == null || value.trim().isEmpty();
    }
}