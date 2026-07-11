package com.het.cipherledger.wallet;

import java.security.PrivateKey;
import java.security.PublicKey;

public class Wallet {

    private PrivateKey privateKey;
    private PublicKey publicKey;

    public Wallet(PublicKey publicKey, PrivateKey privateKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    public String getAddress() {
        return publicKey.toString();
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
}