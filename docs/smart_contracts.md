# 💻 Smart Contracts & CLVM

The **CipherLedger Virtual Machine (CLVM)** is the heart of programmatic execution on the blockchain.

## Overview
The CLVM is a stack-based, lightweight virtual machine designed to execute deterministic byte-code safely. Every node in the network runs the CLVM to ensure state synchronization.

## Features
- **Turing Complete**: Supports loops, conditionals, and complex arithmetic.
- **Gas Metering**: Prevents the Halting Problem by requiring "Gas" (transaction fees) to execute opcodes. Execution halts if gas is depleted.
- **Isolated Sandbox**: Contracts cannot access the host machine's network, file system, or arbitrary memory.

## Writing Contracts
Currently, smart contracts are deployed using CLVM bytecode. High-level language compilers are in development.

**Opcode Examples**:
- `PUSH`: Pushes a value onto the stack.
- `ADD`/`SUB`/`MUL`: Arithmetic operations.
- `STORE`/`LOAD`: State manipulation on the blockchain.

## Contract Invocation
Contracts are invoked by sending a `Transaction` to the contract's unique address with the `data` payload containing the function signature and arguments.
