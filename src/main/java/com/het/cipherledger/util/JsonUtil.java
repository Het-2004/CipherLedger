package com.het.cipherledger.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public final class JsonUtil {

    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private JsonUtil(){}

    public static String toJson(Object object){
        return gson.toJson(object);
    }
    public static <T> T fromJson(String json, Class<T> type){
        return gson.fromJson(json, type);
    }
}