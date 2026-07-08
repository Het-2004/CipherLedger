package com.het.cipherledger.api;

import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;

public class WalletController {

    private final WalletManager walletManager;

    public WalletController(){
        walletManager = new WalletManager();
    }

    public Wallet createWallet(){
        return walletManager.createWallet();
    }
}