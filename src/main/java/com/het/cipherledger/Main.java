package com.het.cipherledger;

import com.het.cipherledger.model.*;
import com.het.cipherledger.wallet.*;

public class Main {

    public static void main(String[] args) {

        WalletManager manager = new WalletManager();

        Wallet het = manager.createWallet();

        UTXO utxo = new UTXO();


        TransactionOutput reward =
                new TransactionOutput(
                        het.getPublicKey(),
                        100
                );

        utxo.add(reward);


        System.out.println(
                "Balance : "
                        + het.getBalance(utxo)
        );
    }
}