package com.het.cipherledger.vm;

public enum Opcode {
    STOP((byte) 0x00),
    PUSH((byte) 0x01), // PUSH a value onto the stack
    ADD((byte) 0x02),
    SUB((byte) 0x03),
    MUL((byte) 0x04),
    DIV((byte) 0x05),
    STORE((byte) 0x06), // STORE value in memory at address
    LOAD((byte) 0x07),  // LOAD value from memory at address
    EQ((byte) 0x08),    // Equality check
    JUMPI((byte) 0x09); // Conditional jump

    private final byte code;

    Opcode(byte code) {
        this.code = code;
    }

    public byte getCode() {
        return code;
    }

    public static Opcode fromByte(byte b) {
        for (Opcode opcode : values()) {
            if (opcode.code == b) {
                return opcode;
            }
        }
        throw new IllegalArgumentException("Unknown opcode: " + b);
    }
}
