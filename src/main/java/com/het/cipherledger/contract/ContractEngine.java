package com.het.cipherledger.contract;

import org.springframework.stereotype.Component;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

@Component
public class ContractEngine {

    public String executeContract(SmartContract contract, String functionName, Object... args) throws Exception {
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");

        if (engine == null) {
            throw new RuntimeException("JavaScript engine not found! Ensure rhino-engine dependency is present.");
        }

        // We bind the state into the engine context so the JS can modify it
        engine.put("stateJson", contract.getStateJson() != null ? contract.getStateJson() : "{}");

        // We prepend a polyfill to parse and stringify state easily
        String setupScript = 
            "var state = JSON.parse(stateJson);\n" +
            contract.getCode() + "\n" +
            "function getFinalState() { return JSON.stringify(state); }";

        engine.eval(setupScript);

        Invocable invocable = (Invocable) engine;
        
        // Execute the targeted function
        invocable.invokeFunction(functionName, args);

        // Retrieve the mutated state
        String newState = (String) invocable.invokeFunction("getFinalState");
        return newState;
    }
}
