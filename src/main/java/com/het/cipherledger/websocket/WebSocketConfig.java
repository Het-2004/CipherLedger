package com.het.cipherledger.websocket;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;



@Configuration
@EnableWebSocketMessageBroker

public class WebSocketConfig
        implements WebSocketMessageBrokerConfigurer {



    @Override

    public void configureMessageBroker(
            @org.springframework.lang.NonNull MessageBrokerRegistry config
    ){


        config.enableSimpleBroker(
                "/topic"
        );


        config.setApplicationDestinationPrefixes(
                "/app"
        );


    }



    @Override

    public void registerStompEndpoints(
            @org.springframework.lang.NonNull StompEndpointRegistry registry
    ){


        registry
                .addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();


    }


}