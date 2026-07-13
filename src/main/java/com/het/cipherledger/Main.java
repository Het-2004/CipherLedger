package com.het.cipherledger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
    RedisAutoConfiguration.class,
    RedisRepositoriesAutoConfiguration.class
})
@EnableScheduling
@EnableCaching
public class Main {

    public static void main(String[] args) {

        SpringApplication.run(
                Main.class,
                args
        );
    }
}