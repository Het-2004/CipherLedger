package com.het.cipherledger.service;

import com.het.cipherledger.crypto.HashUtil;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CrossChainBridgeService {

    private final Map<String, LockRecord> lockRecords = new HashMap<>();
    private final Map<String, Map<String, Double>> wrappedBalances = new HashMap<>();

    public static class LockRecord {
        public String foreignTxId;
        public String sender;
        public String recipient;
        public double amount;
        public String asset;
        public boolean claimed;
        public String claimTxId;

        public LockRecord(String foreignTxId, String sender, String recipient, double amount, String asset) {
            this.foreignTxId = foreignTxId;
            this.sender = sender;
            this.recipient = recipient;
            this.amount = amount;
            this.asset = asset;
            this.claimed = false;
        }
    }

    public LockRecord lockAsset(String sender, String recipient, double amount, String asset) {
        String foreignTxId = "ext_tx_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        LockRecord record = new LockRecord(foreignTxId, sender, recipient, amount, asset);
        lockRecords.put(foreignTxId, record);
        return record;
    }

    public synchronized Map<String, Object> claimWrappedAsset(String foreignTxId) {
        Map<String, Object> response = new HashMap<>();
        LockRecord record = lockRecords.get(foreignTxId);
        
        if (record == null) {
            response.put("success", false);
            response.put("error", "Lock record not found on foreign chain. Verification failed.");
            return response;
        }
        
        if (record.claimed) {
            response.put("success", false);
            response.put("error", "Double-claiming prevention triggered. This lock hash has already been redeemed.");
            return response;
        }

        String wrappedAsset = "w" + record.asset;
        wrappedBalances.putIfAbsent(record.recipient, new HashMap<>());
        Map<String, Double> balances = wrappedBalances.get(record.recipient);
        balances.put(wrappedAsset, balances.getOrDefault(wrappedAsset, 0.0) + record.amount);
        
        record.claimed = true;
        record.claimTxId = "claim_cl_" + HashUtil.generateHash(foreignTxId).substring(0, 16);

        response.put("success", true);
        response.put("claimTxId", record.claimTxId);
        response.put("recipient", record.recipient);
        response.put("amount", record.amount);
        response.put("asset", wrappedAsset);
        return response;
    }

    public Map<String, Double> getWrappedBalances(String address) {
        return wrappedBalances.getOrDefault(address, new HashMap<>());
    }

    public Map<String, LockRecord> getLockRecords() {
        return lockRecords;
    }
}
