package com.het.cipherledger.vm;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class CLVMTest {

    @Test
    public void testAddition() {
        CLVM vm = new CLVM();
        
        // PUSH 5, PUSH 10, ADD, STOP
        byte[] bytecode = {
            Opcode.PUSH.getCode(), 5,
            Opcode.PUSH.getCode(), 10,
            Opcode.ADD.getCode(),
            Opcode.STOP.getCode()
        };

        vm.execute(bytecode);

        assertEquals(1, vm.getStack().size());
        assertEquals(15, vm.getStack().peek());
    }

    @Test
    public void testStoreAndLoad() {
        CLVM vm = new CLVM();
        
        // Address: 0, Value: 99
        // PUSH 0, PUSH 99, STORE, PUSH 0, LOAD, STOP
        byte[] bytecode = {
            Opcode.PUSH.getCode(), 0,   // Address
            Opcode.PUSH.getCode(), 99,  // Value
            Opcode.STORE.getCode(),
            Opcode.PUSH.getCode(), 0,   // Address
            Opcode.LOAD.getCode(),
            Opcode.STOP.getCode()
        };

        vm.execute(bytecode);

        assertEquals(1, vm.getStack().size());
        assertEquals(99, vm.getStack().peek());
        assertEquals(99, vm.getMemory().get(0));
    }

    @Test
    public void testConditionalJump() {
        CLVM vm = new CLVM();

        // Goal: PUSH 1, PUSH 1, EQ, PUSH 10 (jump dest), JUMPI, PUSH 99, STOP (index 10 is here)
        // If EQ == 1 (true), JUMPI to index 10. Index 10 has PUSH 42.
        
        byte[] bytecode = {
            Opcode.PUSH.getCode(), 1,    // 0, 1
            Opcode.PUSH.getCode(), 1,    // 2, 3
            Opcode.EQ.getCode(),         // 4
            Opcode.PUSH.getCode(), 10,   // 5, 6 (jump destination)
            Opcode.JUMPI.getCode(),      // 7
            Opcode.PUSH.getCode(), 99,   // 8, 9 (this should be skipped)
            Opcode.PUSH.getCode(), 42,   // 10, 11 (jump destination lands here)
            Opcode.STOP.getCode()        // 12
        };

        vm.execute(bytecode);

        assertEquals(1, vm.getStack().size());
        assertEquals(42, vm.getStack().peek()); // Should be 42, not 99.
    }
}
