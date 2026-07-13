package com.het.cipherledger;

import com.het.cipherledger.service.ChainlinkOracleService;
import com.het.cipherledger.service.CosmosIbcService;
import com.het.cipherledger.service.CosmosIbcService.IbcChannel;
import com.het.cipherledger.service.CrossChainBridgeService;
import com.het.cipherledger.service.CrossChainBridgeService.LockRecord;
import com.het.cipherledger.wallet.MultiChainWallet;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

public class CrossChainInteroperabilityTest {

    @Test
    public void testMultiChainWalletDerivation() {
        String mnemonic = "solar energy planet matrix gravity shadow liquid light tunnel echo space vortex";
        MultiChainWallet wallet = new MultiChainWallet(mnemonic);
        
        assertNotNull(wallet.getAddress("CIPHER_LEDGER"));
        assertNotNull(wallet.getAddress("ETHEREUM"));
        assertNotNull(wallet.getAddress("BITCOIN"));

        assertTrue(wallet.getAddress("CIPHER_LEDGER").startsWith("cl_"));
        assertTrue(wallet.getAddress("ETHEREUM").startsWith("0x"));
        assertTrue(wallet.getAddress("BITCOIN").startsWith("bc1q"));

        // Verify determinism
        MultiChainWallet wallet2 = new MultiChainWallet(mnemonic);
        assertEquals(wallet.getAddress("CIPHER_LEDGER"), wallet2.getAddress("CIPHER_LEDGER"));
        assertEquals(wallet.getAddress("ETHEREUM"), wallet2.getAddress("ETHEREUM"));
        assertEquals(wallet.getAddress("BITCOIN"), wallet2.getAddress("BITCOIN"));
    }

    @Test
    public void testCrossChainBridgeLockAndClaim() {
        CrossChainBridgeService bridge = new CrossChainBridgeService();
        
        String sender = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
        String recipient = "cl_ops_recipient";
        double amount = 2.5;
        String asset = "ETH";

        LockRecord record = bridge.lockAsset(sender, recipient, amount, asset);
        assertNotNull(record);
        assertNotNull(record.foreignTxId);
        assertFalse(record.claimed);

        // Claim it
        Map<String, Object> result = bridge.claimWrappedAsset(record.foreignTxId);
        assertTrue((Boolean) result.get("success"));
        assertNotNull(result.get("claimTxId"));
        assertEquals(recipient, result.get("recipient"));
        assertEquals(amount, result.get("amount"));
        assertEquals("wETH", result.get("asset"));

        // Verify balance updated
        Map<String, Double> balances = bridge.getWrappedBalances(recipient);
        assertEquals(2.5, balances.get("wETH"));

        // Double spent claim check
        Map<String, Object> duplicateResult = bridge.claimWrappedAsset(record.foreignTxId);
        assertFalse((Boolean) duplicateResult.get("success"));
        assertTrue(duplicateResult.get("error").toString().contains("Double-claiming"));
    }

    @Test
    public void testChainlinkOraclePriceFeeds() {
        ChainlinkOracleService oracle = new ChainlinkOracleService();
        Map<String, Object> feeds = oracle.getPriceFeeds();
        
        assertNotNull(feeds);
        assertTrue(feeds.containsKey("CL/USD"));
        assertTrue(feeds.containsKey("ETH/USD"));
        assertTrue(feeds.containsKey("BTC/USD"));

        Map<String, Object> clFeed = (Map<String, Object>) feeds.get("CL/USD");
        assertNotNull(clFeed.get("price"));
        assertNotNull(clFeed.get("deviation"));
        assertNotNull(clFeed.get("signature"));
    }

    @Test
    public void testCosmosIbcRelaying() {
        CosmosIbcService ibc = new CosmosIbcService();
        List<IbcChannel> channels = ibc.getActiveChannels();
        assertEquals(3, channels.size());

        Map<String, Object> relayResult = ibc.relayPacket("channel-0", "{\"transfer\": 10}");
        assertTrue((Boolean) relayResult.get("success"));
        assertNotNull(relayResult.get("packetId"));
        assertEquals("ACKNOWLEDGED", relayResult.get("status"));
        
        IbcChannel updatedChannel = (IbcChannel) relayResult.get("channel");
        assertEquals(125, updatedChannel.packetsRelayed); // 124 base + 1
    }
}
