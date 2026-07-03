package com.het.cipherledger.crypto;

import com.het.cipherledger.config.Constants;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * =======================================================================
 * Project      : CipherLedger
 * Class        : HashUtil
 * Description  : Utility class for generating SHA-256 hashes.
 * =======================================================================
 */
public final class HashUtil {
    /**
     * Private constructor to prevent object creation.
     */
    private HashUtil() {
        throw new UnsupportedOperationException("HashUtil class cannot be instantiated.");
    }

    /**
     * Generates a SHA-256 hash for the given input string.
     *
     * @param input The input text
     * @return SHA-256 hash in hexadecimal format
     */
    public static String generateHash(String input) {

        try {
            MessageDigest digest = MessageDigest.getInstance(Constants.HASH_ALGORITHM);
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();

            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e){
            throw new RuntimeException("Unable to generate hash for " + input, e);
        }
    }
}