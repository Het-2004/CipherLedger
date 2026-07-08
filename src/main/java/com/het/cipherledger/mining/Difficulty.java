package com.het.cipherledger.mining;

import com.het.cipherledger.config.Constants;

public final class Difficulty {

    private Difficulty(){}

    public static String getTarget(){

        StringBuilder builder = new StringBuilder();
        for(int i = 0; i < Constants.MINING_DIFFICULTY; i++){
            builder.append("0");
        }

        return builder.toString();
    }
}