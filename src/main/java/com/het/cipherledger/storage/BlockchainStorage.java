package com.het.cipherledger.storage;

import com.het.cipherledger.blockchain.Blockchain;
import com.het.cipherledger.config.Constants;

public class BlockchainStorage {

    private final JsonStorage jsonStorage;
    private final FileManager fileManager;

    public BlockchainStorage(){
        jsonStorage = new JsonStorage();
        fileManager = new FileManager();
    }

    public void save(Blockchain blockchain){
        String json = jsonStorage.toJson(blockchain);
        fileManager.write(Constants.BLOCKCHAIN_FILE, json);
    }

    public Blockchain load(){
        String json = fileManager.read(Constants.BLOCKCHAIN_FILE);

        if(json.isEmpty()){
            return new Blockchain();
        }

        return jsonStorage.fromJson(json, Blockchain.class);
    }
}