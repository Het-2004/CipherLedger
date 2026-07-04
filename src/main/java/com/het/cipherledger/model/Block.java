package com.het.cipherledger.model;

import com.het.cipherledger.crypto.HashUtil;

/**
 * ====================================================================
 * Project      : CipherLedge
 * Class        : Block
 * Description  : Represents a single block in the blockchain.
 * ====================================================================
 */
public class Block {
    /**
     * Data stored inside the block.
     */
    private String data;

    /**
     * Time when block was created.
     */
    private long timestamp;

    /**
     * Hash of previous block.
     */
    private String previousHash;

    /**
     * Current block hash.
     */
    private String hash;

    /**
     * Nonce used for mining.
     */
    private int nonce;

    /**
     * Constructor
     */
    public Block(String data, String previousHash){
        this.data = data;
        this.previousHash = previousHash;
        this.timestamp = System.currentTimeMillis();
        this.nonce = 0;
        this.hash = calculateHash();
    }

    /**
     * Generates SHA-256 hash for this block.
     */
    public String calculateHash(){
        String input = previousHash+ timestamp + nonce + hash;

        return HashUtil.generateHash(input);
    }

    public String getData(){
        return data;
    }
    public long getTimestamp(){
        return timestamp;
    }
    public String getPreviousHash(){
        return previousHash;
    }
    public String getHash(){
        return hash;
    }
    public int getNonce(){
        return nonce;
    }
}