package com.het.cipherledger.mining;

import com.het.cipherledger.config.Constants;

public class Difficulty {

    public static String getTarget() {
        return new String(new char[Constants.MINING_DIFFICULTY]).replace('\0', '0');
    }
}