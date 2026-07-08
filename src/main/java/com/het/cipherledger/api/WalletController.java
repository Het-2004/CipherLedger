package com.het.cipherledger.api;

import com.het.cipherledger.wallet.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private WalletManager manager = new WalletManager();

    @PostMapping("/create")
    public String create(){
        Wallet wallet = manager.createWallet();
        return wallet.getAddress();
    }
}