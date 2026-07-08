package com.het.cipherledger.model;

import java.util.HashMap;
import java.util.Map;

public class UTXO {

    private Map<String, TransactionOutput> outputs = new HashMap<>();

    public void add(TransactionOutput output) {
        outputs.put(output.getId(), output);
    }

    public void remove(String id) {
        outputs.remove(id);
    }

    public TransactionOutput find(String id) {
        return outputs.get(id);
    }

    public double getBalance(java.security.PublicKey owner) {

        double total = 0;

        for(TransactionOutput output : outputs.values()) {

            if(output.belongsTo(owner)) {
                total += output.getAmount();
            }
        }

        return total;
    }
}