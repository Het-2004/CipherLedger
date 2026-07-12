package com.het.cipherledger.contract;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "contracts")
public class SmartContract {

    @Id
    private String contractAddress;
    private String creatorAddress;
    private String code;
    private String stateJson;

    public SmartContract() {}

    public SmartContract(String contractAddress, String creatorAddress, String code, String stateJson) {
        this.contractAddress = contractAddress;
        this.creatorAddress = creatorAddress;
        this.code = code;
        this.stateJson = stateJson;
    }

    public String getContractAddress() {
        return contractAddress;
    }

    public void setContractAddress(String contractAddress) {
        this.contractAddress = contractAddress;
    }

    public String getCreatorAddress() {
        return creatorAddress;
    }

    public void setCreatorAddress(String creatorAddress) {
        this.creatorAddress = creatorAddress;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStateJson() {
        return stateJson;
    }

    public void setStateJson(String stateJson) {
        this.stateJson = stateJson;
    }
}
