package com.het.cipherledger;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.model.Block;
import com.het.cipherledger.wallet.*;

public class Main {

    public static void main(String[] args) {


        WalletManager manager =
                new WalletManager();


        Wallet miner =
                manager.createWallet();


        Blockchain blockchain =
                new Blockchain();


        Block block =
                blockchain.createBlock();


        blockchain.addBlock(
                block,
                miner
        );


        System.out.println(
                "Blocks: "
                        +
                        blockchain.size()
        );
    }
}