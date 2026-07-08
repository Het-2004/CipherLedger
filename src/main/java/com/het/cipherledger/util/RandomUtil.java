package com.het.cipherledger.util;

import java.util.UUID;

public final class RandomUtil {

    private RandomUtil(){}

    public static String generateId(){
        return UUID.randomUUID().toString();
    }
}