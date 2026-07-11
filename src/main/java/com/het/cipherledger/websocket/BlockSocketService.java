package com.het.cipherledger.websocket;


import com.het.cipherledger.model.Block;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;



@Service
public class BlockSocketService {


    private final SimpMessagingTemplate template;



    public BlockSocketService(
            SimpMessagingTemplate template
    ){

        this.template = template;

    }




    public void sendBlock(
            Block block
    ){


        template.convertAndSend(

                "/topic/blocks",

                block

        );


    }


}