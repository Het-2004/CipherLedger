package com.het.cipherledger;

import com.het.cipherledger.crypto.HashUtil;

public class Main {

    public static void main(String[] args) {

        String data = "CipherLedger";

        String hash = HashUtil.generateHash(data);

        System.out.println("Original Data : " + data);
        System.out.println("SHA-256 Hash  : " + hash);

    }
}