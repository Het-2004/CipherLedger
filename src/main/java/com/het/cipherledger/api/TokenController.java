package com.het.cipherledger.api;

import com.het.cipherledger.model.Token;
import com.het.cipherledger.service.TokenEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenEngine tokenEngine;

    public TokenController(TokenEngine tokenEngine) {
        this.tokenEngine = tokenEngine;
    }

    @PostMapping("/create")
    public ResponseEntity<Token> createToken(@RequestBody Map<String, Object> payload) {
        String symbol = (String) payload.get("symbol");
        String name = (String) payload.get("name");
        String creator = (String) payload.get("creator");
        double initialSupply = Double.parseDouble(payload.get("initialSupply").toString());
        int decimals = (int) payload.get("decimals");

        Token token = tokenEngine.createToken(symbol, name, creator, initialSupply, decimals);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/mint")
    public ResponseEntity<String> mint(@RequestBody Map<String, Object> payload) {
        String symbol = (String) payload.get("symbol");
        String to = (String) payload.get("to");
        double amount = Double.parseDouble(payload.get("amount").toString());

        tokenEngine.mint(symbol, to, amount);
        return ResponseEntity.ok("Successfully minted " + amount + " " + symbol + " to " + to);
    }

    @PostMapping("/burn")
    public ResponseEntity<String> burn(@RequestBody Map<String, Object> payload) {
        String symbol = (String) payload.get("symbol");
        String from = (String) payload.get("from");
        double amount = Double.parseDouble(payload.get("amount").toString());

        tokenEngine.burn(symbol, from, amount);
        return ResponseEntity.ok("Successfully burned " + amount + " " + symbol + " from " + from);
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody Map<String, Object> payload) {
        String symbol = (String) payload.get("symbol");
        String from = (String) payload.get("from");
        String to = (String) payload.get("to");
        double amount = Double.parseDouble(payload.get("amount").toString());

        tokenEngine.transfer(symbol, from, to, amount);
        return ResponseEntity.ok("Successfully transferred " + amount + " " + symbol + " from " + from + " to " + to);
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<Token> getToken(@PathVariable String symbol) {
        return ResponseEntity.ok(tokenEngine.getToken(symbol));
    }

    @GetMapping("/{symbol}/balance/{address}")
    public ResponseEntity<Double> getBalance(@PathVariable String symbol, @PathVariable String address) {
        return ResponseEntity.ok(tokenEngine.getBalance(symbol, address));
    }
}
