package com.het.cipherledger.storage;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileManager {

    public void write(String path, String data){
        try {
            Files.writeString(Paths.get(path), data);
        }catch(IOException e){
            throw new RuntimeException("File write failed", e);
        }

    }

    public String read(String path){
        try {
            if(!Files.exists(Paths.get(path))){
                return "";
            }
            return Files.readString(Paths.get(path));
        }catch(IOException e){
            throw new RuntimeException("File read failed", e);
        }
    }
}