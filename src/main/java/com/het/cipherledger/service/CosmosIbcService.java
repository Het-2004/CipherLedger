package com.het.cipherledger.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CosmosIbcService {

    private final List<IbcChannel> activeChannels = new ArrayList<>();
    private final List<IbcPacket> packetLog = new ArrayList<>();

    public static class IbcChannel {
        public String channelId;
        public String destChain;
        public String status;
        public int packetsRelayed;

        public IbcChannel(String channelId, String destChain, String status, int packetsRelayed) {
            this.channelId = channelId;
            this.destChain = destChain;
            this.status = status;
            this.packetsRelayed = packetsRelayed;
        }
    }

    public static class IbcPacket {
        public String packetId;
        public String sourceChannel;
        public String destChannel;
        public String sequence;
        public String data;
        public String status;

        public IbcPacket(String packetId, String sourceChannel, String destChannel, String sequence, String data, String status) {
            this.packetId = packetId;
            this.sourceChannel = sourceChannel;
            this.destChannel = destChannel;
            this.sequence = sequence;
            this.data = data;
            this.status = status;
        }
    }

    public CosmosIbcService() {
        activeChannels.add(new IbcChannel("channel-0", "Cosmos Hub", "OPEN", 124));
        activeChannels.add(new IbcChannel("channel-1", "Osmosis Dex", "OPEN", 89));
        activeChannels.add(new IbcChannel("channel-2", "Evmos EVM", "OPEN", 42));
    }

    public Map<String, Object> relayPacket(String sourceChannel, String data) {
        IbcChannel channel = activeChannels.stream()
                .filter(c -> c.channelId.equals(sourceChannel))
                .findFirst()
                .orElse(null);

        Map<String, Object> result = new HashMap<>();
        if (channel == null || !"OPEN".equals(channel.status)) {
            result.put("success", false);
            result.put("error", "Target IBC channel is closed or unavailable.");
            return result;
        }

        channel.packetsRelayed++;
        String seq = String.valueOf(channel.packetsRelayed);
        String packetId = "packet_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        
        IbcPacket packet = new IbcPacket(packetId, sourceChannel, "channel-cl-0", seq, data, "ACKNOWLEDGED");
        packetLog.add(packet);

        result.put("success", true);
        result.put("packetId", packetId);
        result.put("sequence", seq);
        result.put("status", "ACKNOWLEDGED");
        result.put("channel", channel);
        return result;
    }

    public List<IbcChannel> getActiveChannels() {
        return activeChannels;
    }

    public List<IbcPacket> getPacketLog() {
        return packetLog;
    }
}
