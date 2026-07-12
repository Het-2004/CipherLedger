package com.het.cipherledger.consensus;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ValidatorRegistry {

    // Tracks total staked tokens per node (Wallet Address -> Stake Amount)
    private final Map<String, Double> stakes = new HashMap<>();
    
    // Tracks Delegated Proof of Stake votes (Voter -> Delegate Address)
    private final Map<String, String> delegations = new HashMap<>();

    public void stake(String address, double amount) {
        stakes.put(address, stakes.getOrDefault(address, 0.0) + amount);
    }

    public void unstake(String address, double amount) {
        double current = stakes.getOrDefault(address, 0.0);
        if (current >= amount) {
            stakes.put(address, current - amount);
        } else {
            stakes.put(address, 0.0);
        }
    }

    public double getStake(String address) {
        return stakes.getOrDefault(address, 0.0);
    }

    public void delegate(String voterAddress, String delegateAddress) {
        delegations.put(voterAddress, delegateAddress);
    }

    public Map<String, Double> getDelegateVotingPower() {
        Map<String, Double> votingPower = new HashMap<>();
        for (Map.Entry<String, String> entry : delegations.entrySet()) {
            String voter = entry.getKey();
            String delegate = entry.getValue();
            double voterStake = getStake(voter);
            
            votingPower.put(delegate, votingPower.getOrDefault(delegate, 0.0) + voterStake);
        }
        return votingPower;
    }
    
    public Map<String, Double> getAllStakes() {
        return stakes;
    }
}
