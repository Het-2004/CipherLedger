package com.het.cipherledger;


import com.het.cipherledger.model.Transaction;
import com.het.cipherledger.wallet.Wallet;
import com.het.cipherledger.wallet.WalletManager;


public class Main {


    public static void main(String[] args){



        WalletManager manager =
                new WalletManager();



        Wallet het =
                manager.createWallet();



        Wallet alex =
                manager.createWallet();




        Transaction transaction =
                new Transaction(

                        het.getPublicKey(),

                        alex.getPublicKey(),

                        50

                );





        transaction.generateSignature(

                het.getPrivateKey()

        );





        System.out.println(

                "Signature Valid : "
                        +
                        transaction.verifySignature()

        );



    }


}