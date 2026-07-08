package com.het.cipherledger;

import com.het.cipherledger.model.*;
import com.het.cipherledger.wallet.*;

public class Main {

    public static void main(String[] args) {

        WalletManager manager =
                new WalletManager();

        Wallet het =
                manager.createWallet();

        Wallet alex =
                manager.createWallet();


        Transaction tx =
                new Transaction(
                        het.getPublicKey(),
                        alex.getPublicKey(),
                        50
                );


        Block block =
                new Block("0");


        block.addTransaction(tx);


        System.out.println(
                block.getMerkleRoot()
        );
    }
}