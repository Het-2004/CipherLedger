package com.het.cipherledger.wallet;

import com.het.cipherledger.model.UTXO;
import com.het.cipherledger.crypto.Base58;

import java.security.PublicKey;
import java.security.PrivateKey;

public class Wallet {
    private PublicKey publicKey;
    private PrivateKey privateKey;
    private String address;

    public double getBalance(UTXO utxo) {
        return utxo.getBalance(
                publicKey
        );
    }

    public Wallet(PublicKey publicKey, PrivateKey privateKey){
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.address = generateAddress();
    }

    private String generateAddress(){
        return Base58.encode(publicKey.getEncoded());
    }

    public PublicKey getPublicKey(){
        return publicKey;
    }
    public PrivateKey getPrivateKey(){
        return privateKey;
    }
    public String getAddress(){
        return address;
    }
}