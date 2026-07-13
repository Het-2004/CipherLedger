package com.het.cipherledger.api;

import com.het.cipherledger.service.ChainlinkOracleService;
import com.het.cipherledger.service.CosmosIbcService;
import com.het.cipherledger.service.CrossChainBridgeService;
import com.het.cipherledger.service.CrossChainBridgeService.LockRecord;
import com.het.cipherledger.wallet.MultiChainWallet;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/crosschain")
@CrossOrigin(origins = "*")
public class CrossChainController {

    private final ChainlinkOracleService oracleService;
    private final CrossChainBridgeService bridgeService;
    private final CosmosIbcService ibcService;

    public CrossChainController(ChainlinkOracleService oracleService, 
                                CrossChainBridgeService bridgeService, 
                                CosmosIbcService ibcService) {
        this.oracleService = oracleService;
        this.bridgeService = bridgeService;
        this.ibcService = ibcService;
    }

    @GetMapping("/oracle/prices")
    public ResponseEntity<?> getOraclePrices() {
        return ResponseEntity.ok(oracleService.getPriceFeeds());
    }

    @GetMapping("/ibc/channels")
    public ResponseEntity<?> getIbcChannels() {
        return ResponseEntity.ok(ibcService.getActiveChannels());
    }

    @GetMapping("/ibc/packets")
    public ResponseEntity<?> getIbcPackets() {
        return ResponseEntity.ok(ibcService.getPacketLog());
    }

    @PostMapping("/ibc/relay")
    public ResponseEntity<?> relayIbcPacket(@RequestBody Map<String, String> request) {
        try {
            String sourceChannel = request.get("channelId");
            String data = request.get("data");
            return ResponseEntity.ok(ibcService.relayPacket(sourceChannel, data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/bridge/lock")
    public ResponseEntity<?> lockAsset(@RequestBody Map<String, Object> request) {
        try {
            String sender = (String) request.get("sender");
            String recipient = (String) request.get("recipient");
            double amount = Double.parseDouble(request.get("amount").toString());
            String asset = (String) request.get("asset");

            LockRecord record = bridgeService.lockAsset(sender, recipient, amount, asset);
            return ResponseEntity.ok(record);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/bridge/claim")
    public ResponseEntity<?> claimAsset(@RequestBody Map<String, String> request) {
        try {
            String foreignTxId = request.get("foreignTxId");
            Map<String, Object> claimResult = bridgeService.claimWrappedAsset(foreignTxId);
            return ResponseEntity.ok(claimResult);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bridge/balances/{address}")
    public ResponseEntity<?> getBridgeBalances(@PathVariable String address) {
        return ResponseEntity.ok(bridgeService.getWrappedBalances(address));
    }

    @PostMapping("/wallet/derive")
    public ResponseEntity<?> deriveAddresses(@RequestBody Map<String, String> request) {
        try {
            String mnemonic = request.get("mnemonic");
            MultiChainWallet wallet = new MultiChainWallet(mnemonic);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mnemonic", wallet.getMnemonic());
            
            Map<String, String> derived = new HashMap<>();
            derived.put("CIPHER_LEDGER", wallet.getAddress("CIPHER_LEDGER"));
            derived.put("ETHEREUM", wallet.getAddress("ETHEREUM"));
            derived.put("BITCOIN", wallet.getAddress("BITCOIN"));
            
            response.put("addresses", derived);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
