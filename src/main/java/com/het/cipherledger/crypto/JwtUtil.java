package com.het.cipherledger.crypto;

import javax.crypto.Mac;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

public class JwtUtil {

    private static final String SECRET_KEY = "cld_secret_holographic_network_key_cld_padding_xyz!";
    private static final SecretKey key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Generate real cryptographically signed JWT token
    public static String generateToken(String username, String role) {
        long now = System.currentTimeMillis();
        long expiry = now + (3600 * 1000 * 24); // 24 hours expiry
        return io.jsonwebtoken.Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new java.util.Date(now))
                .expiration(new java.util.Date(expiry))
                .signWith(key)
                .compact();
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
