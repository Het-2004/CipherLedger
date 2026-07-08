package com.het.cipherledger.wallet;

import com.het.cipherledger.crypto.KeyGeneratorUtil;
import com.het.cipherledger.crypto.SignatureUtil;

import java.security.KeyPair;

public class WalletService {

    public Wallet createWallet(){
        KeyPair keyPair = KeyGeneratorUtil.generateKeyPair();
        return new Wallet(keyPair.getPublic(), keyPair.getPrivate());
    }

    public byte[] signData(Wallet wallet, String data){
        return SignatureUtil.sign(data, wallet.getPrivateKey());
    }
}
