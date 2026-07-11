package com.het.cipherledger.storage;

import com.google.gson.Gson;

public class JsonStorage {

    private final Gson gson = new Gson();

    public String toJson(Object object) {
        return gson.toJson(object);
    }

    public <T> T fromJson(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }
}