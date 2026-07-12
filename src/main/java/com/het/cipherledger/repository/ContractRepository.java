package com.het.cipherledger.repository;

import com.het.cipherledger.contract.SmartContract;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends MongoRepository<SmartContract, String> {
}
