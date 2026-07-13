package com.het.cipherledger.wallet;

import com.het.cipherledger.crypto.KeyGeneratorUtil;
import com.het.cipherledger.crypto.SignatureUtil;
import java.security.KeyPair;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class HardwareWalletService {

    private boolean connected = false;
    private final String deviceName = "Ledger Nano X";
    private KeyPair hardwareKeyPair;
    private String hardwareAddress;

    public Map<String, Object> connectDevice() {
        this.connected = true;
        if (this.hardwareKeyPair == null) {
            this.hardwareKeyPair = KeyGeneratorUtil.generateKeyPair();
            this.hardwareAddress = "hw_" + UUID.randomUUID().toString().substring(0, 8);
        }
        
        Map<String, Object> status = new HashMap<>();
        status.put("connected", true);
        status.put("deviceName", deviceName);
        status.put("address", hardwareAddress);
        status.put("connectionProtocol", "WebUSB APDU v2.1");
        return status;
    }

    public byte[] signWithHardware(String data) {
        if (!connected || hardwareKeyPair == null) {
            throw new IllegalStateException("Hardware wallet is not connected");
        }
        return SignatureUtil.sign(data, hardwareKeyPair.getPrivate());
    }

    public void disconnectDevice() {
        this.connected = false;
    }

    public boolean isConnected() {
        return connected;
    }

    public String getHardwareAddress() {
        return hardwareAddress;
    }
}
