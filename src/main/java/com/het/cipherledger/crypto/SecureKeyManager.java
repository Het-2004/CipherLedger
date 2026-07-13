package com.het.cipherledger.crypto;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class SecureKeyManager {

    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_LENGTH = 16;
    private static final int IV_LENGTH = 12;

    public static String encryptKey(String privateKeyHex, String address, String password) {
        try {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);
            
            byte[] iv = new byte[IV_LENGTH];
            random.nextBytes(iv);
            
            SecretKey secretKey = deriveKey(password, salt);
            
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec spec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);
            
            byte[] cipherText = cipher.doFinal(privateKeyHex.getBytes(StandardCharsets.UTF_8));
            
            JsonObject keystore = new JsonObject();
            keystore.addProperty("address", address);
            keystore.addProperty("crypto", "AES-256-GCM");
            keystore.addProperty("ciphertext", bytesToHex(cipherText));
            keystore.addProperty("iv", bytesToHex(iv));
            keystore.addProperty("salt", bytesToHex(salt));
            keystore.addProperty("iterations", ITERATIONS);
            
            return keystore.toString();
        } catch (Exception e) {
            throw new RuntimeException("Key encryption failed", e);
        }
    }

    public static String decryptKey(String keystoreJson, String password) {
        try {
            JsonObject keystore = JsonParser.parseString(keystoreJson).getAsJsonObject();
            String ciphertextHex = keystore.get("ciphertext").getAsString();
            String ivHex = keystore.get("iv").getAsString();
            String saltHex = keystore.get("salt").getAsString();
            int iterations = keystore.get("iterations").getAsInt();
            
            byte[] cipherText = hexToBytes(ciphertextHex);
            byte[] iv = hexToBytes(ivHex);
            byte[] salt = hexToBytes(saltHex);
            
            SecretKey secretKey = deriveKey(password, salt, iterations);
            
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec spec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);
            
            byte[] decrypted = cipher.doFinal(cipherText);
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed. Invalid credentials or corrupted keystore.", e);
        }
    }

    private static SecretKey deriveKey(String password, byte[] salt) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return deriveKey(password, salt, ITERATIONS);
    }

    private static SecretKey deriveKey(String password, byte[] salt, int iterations) throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, KEY_LENGTH);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] keyBytes = factory.generateSecret(spec).getEncoded();
        return new SecretKeySpec(keyBytes, "AES");
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private static byte[] hexToBytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                                 + Character.digit(hex.charAt(i+1), 16));
        }
        return data;
    }
}
