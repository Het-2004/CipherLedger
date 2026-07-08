package com.het.cipherledger;


import com.het.cipherledger.network.NetworkManager;
import com.het.cipherledger.network.Peer;


public class Main {


    public static void main(String[] args){



        NetworkManager network =
                new NetworkManager(
                        "NODE-1"
                );




        Peer peer =
                new Peer(

                        "NODE-2",

                        "localhost",

                        8081

                );




        network.connectPeer(
                peer
        );



        network.broadcast(
                "New block mined"
        );


    }


}