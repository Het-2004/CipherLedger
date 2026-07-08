package com.het.cipherledger.storage;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JsonStorage {

    private final Gson gson;

    public JsonStorage(){
        gson = new GsonBuilder().setPrettyPrinting().create();
    }

    public String toJson(Object object){
        return gson.toJson(object);
    }

    public <T> T fromJson(String json, Class<T> type){
        return gson.fromJson(json, type);
    }
}