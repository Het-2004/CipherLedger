package com.het.cipherledger.crypto;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

public class JwtUtil {

    private static final String SECRET_KEY = "cld_secret_holographic_network_key_cld";

    // Base64Url encoder helper
    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // Generate real cryptographically signed JWT token
    public static String generateToken(String username, String role) {
        try {
            String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
            long now = System.currentTimeMillis();
            long expiry = now + (3600 * 1000 * 24); // 24 hours expiry
            String payload = String.format(
                "{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                username, role, now / 1000, expiry / 1000
            );

            String encodedHeader = base64UrlEncode(header.getBytes(StandardCharsets.UTF_8));
            String encodedPayload = base64UrlEncode(payload.getBytes(StandardCharsets.UTF_8));

            String signatureInput = encodedHeader + "." + encodedPayload;

            Mac hmacSha256 = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(SECRET_KEY.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmacSha256.init(secretKeySpec);

            byte[] signatureBytes = hmacSha256.doFinal(signatureInput.getBytes(StandardCharsets.UTF_8));
            String encodedSignature = base64UrlEncode(signatureBytes);

            return signatureInput + "." + encodedSignature;
        } catch (Exception e) {
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    // Generate refresh token
    public static String generateRefreshToken() {
        String token = "cld_refresh_" + Math.random() + "_" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(token.getBytes(StandardCharsets.UTF_8));
    }

    // Password Hashing using salted SHA-256 (lightweight BCrypt alternative for secure storage)
    public static String hashPassword(String password) {
        try {
            String salt = "cld_crypto_salt_9329";
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((password + salt).getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    // Verify password matching
    public static boolean checkPassword(String password, String hashed) {
        return hashPassword(password).equals(hashed);
    }
}
