package com.het.cipherledger.storage;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileManager {

    public void write(String path, String content) {
        try (FileWriter writer = new FileWriter(path)) {
            writer.write(content);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String read(String path) {
        try {
            File file = new File(path);
            if (!file.exists()) {
                return "";
            }
            return new String(Files.readAllBytes(Paths.get(path)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}