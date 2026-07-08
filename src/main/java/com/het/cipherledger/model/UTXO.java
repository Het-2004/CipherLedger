package com.het.cipherledger.model;

import java.util.HashMap;
import java.util.Map;

public class UTXO {
    private Map<String, TransactionOutput> outputs;

    public UTXO(){
        outputs = new HashMap<>();
    }

    public void add (TransactionOutput output){
        outputs.put(output.getId(),output);
    }

    public void remove(String id){
        outputs.remove(id);
    }

    public TransactionOutput get(String id){
        return outputs.get(id);
    }
}