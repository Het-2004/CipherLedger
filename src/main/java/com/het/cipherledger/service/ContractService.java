package com.het.cipherledger.service;

import com.het.cipherledger.contract.ContractEngine;
import com.het.cipherledger.contract.SmartContract;
import com.het.cipherledger.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final ContractEngine contractEngine;

    public ContractService(ContractRepository contractRepository, ContractEngine contractEngine) {
        this.contractRepository = contractRepository;
        this.contractEngine = contractEngine;
    }

    public SmartContract deployContract(String creatorAddress, String code) {
        String contractAddress = "cx" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        SmartContract contract = new SmartContract(contractAddress, creatorAddress, code, "{}");
        return contractRepository.save(contract);
    }

    public SmartContract executeContract(String contractAddress, String functionName, Object... args) {
        Optional<SmartContract> optContract = contractRepository.findById(contractAddress);
        if (optContract.isEmpty()) {
            throw new RuntimeException("Contract not found: " + contractAddress);
        }

        SmartContract contract = optContract.get();
        try {
            String newState = contractEngine.executeContract(contract, functionName, args);
            contract.setStateJson(newState);
            return contractRepository.save(contract);
        } catch (Exception e) {
            throw new RuntimeException("Contract execution failed: " + e.getMessage(), e);
        }
    }

    public List<SmartContract> getAllContracts() {
        return contractRepository.findAll();
    }

    public Optional<SmartContract> getContract(String address) {
        return contractRepository.findById(address);
    }
}
