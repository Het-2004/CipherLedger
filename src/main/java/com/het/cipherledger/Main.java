package com.het.cipherledger;


import com.het.cipherledger.util.ConsoleUtil;
import com.het.cipherledger.util.DateUtil;
import com.het.cipherledger.util.RandomUtil;


public class Main {


    public static void main(String[] args){


        ConsoleUtil.print(
                "CipherLedger Started"
        );


        ConsoleUtil.line();



        System.out.println(
                DateUtil.now()
        );


        System.out.println(
                RandomUtil.generateId()
        );


    }

}