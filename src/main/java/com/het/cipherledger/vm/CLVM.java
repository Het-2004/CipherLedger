package com.het.cipherledger.vm;

import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

public class CLVM {

    private final Stack<Integer> stack = new Stack<>();
    private final Map<Integer, Integer> memory = new HashMap<>();

    public void execute(byte[] bytecode) {
        int pc = 0; // Program Counter

        while (pc < bytecode.length) {
            Opcode opcode = Opcode.fromByte(bytecode[pc]);

            switch (opcode) {
                case STOP:
                    return;

                case PUSH:
                    if (pc + 1 >= bytecode.length) throw new RuntimeException("PUSH expects 1 byte argument");
                    pc++;
                    stack.push((int) bytecode[pc]);
                    break;

                case ADD:
                    stack.push(stack.pop() + stack.pop());
                    break;

                case SUB:
                    int bSub = stack.pop();
                    int aSub = stack.pop();
                    stack.push(aSub - bSub);
                    break;

                case MUL:
                    stack.push(stack.pop() * stack.pop());
                    break;

                case DIV:
                    int bDiv = stack.pop();
                    int aDiv = stack.pop();
                    if (bDiv == 0) throw new RuntimeException("Division by zero");
                    stack.push(aDiv / bDiv);
                    break;

                case STORE:
                    int value = stack.pop();
                    int address = stack.pop();
                    memory.put(address, value);
                    break;

                case LOAD:
                    int loadAddress = stack.pop();
                    stack.push(memory.getOrDefault(loadAddress, 0));
                    break;

                case EQ:
                    int bEq = stack.pop();
                    int aEq = stack.pop();
                    stack.push(aEq == bEq ? 1 : 0);
                    break;

                case JUMPI:
                    int destination = stack.pop();
                    int condition = stack.pop();
                    if (condition != 0) {
                        pc = destination;
                        continue; // Skip the standard pc++ since we jumped
                    }
                    break;
            }
            
            pc++;
        }
    }

    public Stack<Integer> getStack() {
        return stack;
    }

    public Map<Integer, Integer> getMemory() {
        return memory;
    }
}
