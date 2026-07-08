package com.het.cipherledger.model;

public class TransactionInput {

    private String outputId;
    private TransactionOutput utxo;

    public TransactionInput(String outputId) {
        this.outputId = outputId;
    }

    public String getOutputId() {
        return outputId;
    }

    public TransactionOutput getUtxo() {
        return utxo;
    }

    public void setUtxo(TransactionOutput utxo) {
        this.utxo = utxo;
    }
}