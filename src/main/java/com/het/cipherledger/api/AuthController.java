package com.het.cipherledger.api;

import com.het.cipherledger.crypto.JwtUtil;
import com.het.cipherledger.model.User;
import com.het.cipherledger.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository repository;

    public AuthController(UserRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String role = payload.getOrDefault("role", "ADMIN");

        if (username == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Username and password are required.");
            return ResponseEntity.badRequest().body(error);
        }

        // Check if user already exists
        if (repository.findByUsername(username).isPresent()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Username is already registered.");
            return ResponseEntity.badRequest().body(error);
        }

        // Hash password and save User
        String hash = JwtUtil.hashPassword(password);
        User user = new User(username, hash, role);
        repository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password are required.");
        }

        Optional<User> optUser = repository.findByUsername(username);
        
        // Auto-register first user as ADMIN on first run to simplify operator login!
        if (optUser.isEmpty()) {
            String hash = JwtUtil.hashPassword(password);
            User defaultUser = new User(username, hash, "ADMIN");
            repository.save(defaultUser);
            optUser = Optional.of(defaultUser);
        }

        User user = optUser.get();
        if (!JwtUtil.checkPassword(password, user.getPasswordHash())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid credentials.");
            return ResponseEntity.status(401).body(error);
        }

        // Generate tokens
        String token = JwtUtil.generateToken(username, user.getRole());
        String refreshToken = JwtUtil.generateRefreshToken();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("username", username);
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
