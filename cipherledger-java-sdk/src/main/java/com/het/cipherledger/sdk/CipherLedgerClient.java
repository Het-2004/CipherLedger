package com.het.cipherledger.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class CipherLedgerClient {

    private final String nodeUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public CipherLedgerClient(String nodeUrl) {
        this.nodeUrl = nodeUrl;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }

    public String getChain() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(nodeUrl + "/api/blocks"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public String sendTransaction(String sender, String recipient, double amount) throws Exception {
        Map<String, Object> tx = Map.of(
            "sender", sender,
            "recipient", recipient,
            "amount", amount,
            "gasPrice", 0.00001,
            "gasLimit", 21000
        );
        String json = objectMapper.writeValueAsString(tx);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(nodeUrl + "/api/transactions"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();
                
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public String getWalletBalance(String address) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(nodeUrl + "/api/wallets/" + address + "/balance"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
