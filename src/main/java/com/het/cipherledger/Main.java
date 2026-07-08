package com.het.cipherledger;


import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;


public class Main {


    public static void main(String[] args){


        WalletManager manager =
                new WalletManager();



        Wallet wallet =
                manager.createWallet();



        System.out.println(
                "Wallet Address:"
        );


        System.out.println(
                wallet.getAddress()
        );


    }

}