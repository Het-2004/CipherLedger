package com.het.cipherledger;

import com.het.cipherledger.contract.ContractEngine;
import com.het.cipherledger.contract.SmartContract;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ContractEngineTest {

    @Test
    public void testContractExecution() throws Exception {
        ContractEngine engine = new ContractEngine();
        
        // A simple Counter smart contract
        String jsCode = 
            "function increment() { " +
            "  if (!state.count) state.count = 0; " +
            "  state.count += 1; " +
            "} " +
            "function add(amount) { " +
            "  if (!state.count) state.count = 0; " +
            "  state.count += amount; " +
            "}";

        SmartContract contract = new SmartContract("cx123", "user1", jsCode, "{}");

        // Execute increment
        String state1 = engine.executeContract(contract, "increment");
        assertTrue(state1.contains("\"count\":1"));
        contract.setStateJson(state1);

        // Execute add
        String state2 = engine.executeContract(contract, "add", 5);
        assertTrue(state2.contains("\"count\":6"));
    }
}
