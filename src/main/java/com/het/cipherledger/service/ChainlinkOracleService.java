package com.het.cipherledger.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ChainlinkOracleService {

    private final Map<String, Double> basePrices = new HashMap<>();
    private final Random random = new Random();

    public ChainlinkOracleService() {
        basePrices.put("CL/USD", 1.84);
        basePrices.put("ETH/USD", 3450.25);
        basePrices.put("BTC/USD", 97200.50);
    }

    public Map<String, Object> getPriceFeeds() {
        Map<String, Object> feeds = new HashMap<>();
        for (Map.Entry<String, Double> entry : basePrices.entrySet()) {
            double pctChange = (random.nextDouble() * 0.04) - 0.02;
            double currentPrice = entry.getValue() * (1 + pctChange);
            
            Map<String, Object> feedData = new HashMap<>();
            feedData.put("price", Math.round(currentPrice * 100.0) / 100.0);
            feedData.put("deviation", Math.round(pctChange * 10000.0) / 100.0);
            feedData.put("lastUpdated", System.currentTimeMillis());
            feedData.put("oracleNodesReported", 14 + random.nextInt(3));
            feedData.put("signature", "cl_link_sig_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
            
            feeds.put(entry.getKey(), feedData);
        }
        return feeds;
    }
}
