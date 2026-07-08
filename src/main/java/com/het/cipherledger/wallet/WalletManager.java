package com.het.cipherledger.wallet;

import java.util.ArrayList;
import java.util.List;

public class WalletManager {
    private List<Wallet> wallets;

    public WalletManager(){
        wallets = new ArrayList<>();
    }

    public Wallet createWallet(){
        WalletService service = new WalletService();
        Wallet wallet = service.createWallet();
        wallets.add(wallet);
        return wallet;
    }

    public List<Wallet> getWallets(){
        return wallets;
    }
}
