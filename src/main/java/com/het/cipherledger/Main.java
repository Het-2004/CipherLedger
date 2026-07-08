package com.het.cipherledger;


import com.het.cipherledger.api.TransactionController;
import com.het.cipherledger.api.WalletController;
import com.het.cipherledger.wallet.Wallet;


public class Main {


    public static void main(String[] args){



        WalletController walletController =
                new WalletController();



        Wallet wallet =
                walletController.createWallet();




        System.out.println(

                "Wallet: "
                        +
                        wallet.getAddress()

        );




        TransactionController transactionController =
                new TransactionController();




        boolean result =
                transactionController
                        .sendTransaction(

                                "Het",

                                "Alex",

                                500

                        );




        System.out.println(

                "Transaction status: "
                        +
                        result

        );


    }

}