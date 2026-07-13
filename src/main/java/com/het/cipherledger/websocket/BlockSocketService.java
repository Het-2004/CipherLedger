package com.het.cipherledger.websocket;

import com.het.cipherledger.model.Block;
import com.het.cipherledger.model.Transaction;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class BlockSocketService {

    private final SimpMessagingTemplate template;

    public BlockSocketService(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendBlock(Block block) {
        template.convertAndSend("/topic/blocks", block);
    }

    public void sendTransaction(Transaction transaction) {
        template.convertAndSend("/topic/transactions", transaction);
    }

    public void sendWalletUpdate(String address, double newBalance) {
        template.convertAndSend("/topic/wallets/" + address, newBalance);
    }
}