package com.het.cipherledger.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private DateUtil(){}
    public static String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}