package com.het.cipherledger.api;

import com.het.cipherledger.contract.SmartContract;
import com.het.cipherledger.service.ContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "*") // Needed for local dev sandbox
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping("/deploy")
    public ResponseEntity<SmartContract> deployContract(@RequestBody Map<String, String> payload) {
        String creatorAddress = payload.get("creatorAddress");
        String code = payload.get("code");
        if (creatorAddress == null || code == null) {
            return ResponseEntity.badRequest().build();
        }
        SmartContract contract = contractService.deployContract(creatorAddress, code);
        return ResponseEntity.ok(contract);
    }

    @PostMapping("/{address}/execute")
    public ResponseEntity<SmartContract> executeContract(
            @PathVariable String address,
            @RequestBody Map<String, Object> payload) {
        
        String functionName = (String) payload.get("functionName");
        List<?> argsList = (List<?>) payload.get("args");
        Object[] args = argsList != null ? argsList.toArray() : new Object[0];

        if (functionName == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            SmartContract updatedContract = contractService.executeContract(address, functionName, args);
            return ResponseEntity.ok(updatedContract);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<SmartContract>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/{address}")
    public ResponseEntity<SmartContract> getContract(@PathVariable String address) {
        Optional<SmartContract> contract = contractService.getContract(address);
        return contract.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
