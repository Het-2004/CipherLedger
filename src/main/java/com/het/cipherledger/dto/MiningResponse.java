package com.het.cipherledger.dto;


public class MiningResponse {


    private boolean success;

    private String message;

    private int blockIndex;

    private String hash;

    private int nonce;

    private long miningTime;



    public MiningResponse(
            boolean success,
            String message,
            int blockIndex,
            String hash,
            int nonce,
            long miningTime
    ){

        this.success = success;

        this.message = message;

        this.blockIndex = blockIndex;

        this.hash = hash;

        this.nonce = nonce;

        this.miningTime = miningTime;

    }


    public boolean isSuccess(){
        return success;
    }


    public String getMessage(){
        return message;
    }


    public int getBlockIndex(){
        return blockIndex;
    }


    public String getHash(){
        return hash;
    }


    public int getNonce(){
        return nonce;
    }


    public long getMiningTime(){
        return miningTime;
    }


}