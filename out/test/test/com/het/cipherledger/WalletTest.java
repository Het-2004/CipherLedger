package com.het.cipherledger;

import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class WalletTest {

    @Test
    void walletCreationTest(){
        WalletManager manager = new WalletManager();
        Wallet wallet = manager.createWallet();
        assertNotNull(wallet.getAddress());
        assertNotNull(wallet.getPrivateKey());
    }
}