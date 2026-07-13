package com.het.cipherledger.wallet;

import com.het.cipherledger.crypto.HashUtil;
import java.util.HashMap;
import java.util.Map;

public class MultiChainWallet {

    private final String mnemonic;
    private final Map<String, String> privateKeys;
    private final Map<String, String> addresses;

    public MultiChainWallet(String mnemonic) {
        this.mnemonic = mnemonic;
        this.privateKeys = new HashMap<>();
        this.addresses = new HashMap<>();
        deriveKeysAndAddresses();
    }

    private void deriveKeysAndAddresses() {
        String clPrivKey = HashUtil.generateHash(mnemonic + "/44'/999'/0'/0/0");
        String clPubKey = HashUtil.generateHash(clPrivKey + "PUBLIC");
        String clAddr = "cl_" + HashUtil.generateHash(clPubKey).substring(0, 40);
        privateKeys.put("CIPHER_LEDGER", clPrivKey);
        addresses.put("CIPHER_LEDGER", clAddr);

        String ethPrivKey = HashUtil.generateHash(mnemonic + "/44'/60'/0'/0/0");
        String ethPubKey = HashUtil.generateHash(ethPrivKey + "PUBLIC");
        String ethAddr = "0x" + HashUtil.generateHash(ethPubKey).substring(0, 40);
        privateKeys.put("ETHEREUM", ethPrivKey);
        addresses.put("ETHEREUM", ethAddr);

        String btcPrivKey = HashUtil.generateHash(mnemonic + "/44'/0'/0'/0/0");
        String btcPubKey = HashUtil.generateHash(btcPrivKey + "PUBLIC");
        String btcAddr = "bc1q" + HashUtil.generateHash(btcPubKey).substring(0, 38);
        privateKeys.put("BITCOIN", btcPrivKey);
        addresses.put("BITCOIN", btcAddr);
    }

    public String getMnemonic() {
        return mnemonic;
    }

    public String getPrivateKey(String chain) {
        return privateKeys.get(chain);
    }

    public String getAddress(String chain) {
        return addresses.get(chain);
    }

    public Map<String, String> getAddresses() {
        return addresses;
    }
}
