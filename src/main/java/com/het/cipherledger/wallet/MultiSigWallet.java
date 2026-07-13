package com.het.cipherledger.wallet;

import com.het.cipherledger.crypto.HashUtil;
import java.util.*;

public class MultiSigWallet {
    private String address;
    private List<String> publicKeys; // hex-encoded public keys
    private int threshold; // M in M-of-N
    private Map<String, MultiSigTx> pendingTransactions; // txId -> MultiSigTx

    public static class MultiSigTx {
        private String txId;
        private String recipient;
        private double amount;
        private Set<String> signedPublicKeys; // list of participants who signed
        private boolean executed;

        public MultiSigTx(String txId, String recipient, double amount) {
            this.txId = txId;
            this.recipient = recipient;
            this.amount = amount;
            this.signedPublicKeys = new HashSet<>();
            this.executed = false;
        }

        public String getTxId() { return txId; }
        public String getRecipient() { return recipient; }
        public double getAmount() { return amount; }
        public Set<String> getSignedPublicKeys() { return signedPublicKeys; }
        public boolean isExecuted() { return executed; }
        public void setExecuted(boolean executed) { this.executed = executed; }
    }

    public MultiSigWallet(List<String> publicKeys, int threshold) {
        if (threshold > publicKeys.size() || threshold <= 0) {
            throw new IllegalArgumentException("Invalid multi-sig threshold settings");
        }
        this.publicKeys = new ArrayList<>(publicKeys);
        this.threshold = threshold;
        this.pendingTransactions = new HashMap<>();
        
        List<String> sortedKeys = new ArrayList<>(publicKeys);
        Collections.sort(sortedKeys);
        String addressInput = String.join(",", sortedKeys) + "|" + threshold;
        this.address = "multisig_" + HashUtil.generateHash(addressInput).substring(0, 40);
    }

    public MultiSigTx proposeTransaction(String txId, String recipient, double amount) {
        MultiSigTx tx = new MultiSigTx(txId, recipient, amount);
        pendingTransactions.put(txId, tx);
        return tx;
    }

    public boolean addSignature(String txId, String publicKey) {
        MultiSigTx tx = pendingTransactions.get(txId);
        if (tx == null || tx.isExecuted()) return false;
        
        if (!publicKeys.contains(publicKey)) return false;
        
        tx.getSignedPublicKeys().add(publicKey);
        return true;
    }

    public boolean isFullySigned(String txId) {
        MultiSigTx tx = pendingTransactions.get(txId);
        if (tx == null) return false;
        return tx.getSignedPublicKeys().size() >= threshold;
    }

    public String getAddress() { return address; }
    public List<String> getPublicKeys() { return publicKeys; }
    public int getThreshold() { return threshold; }
    public Map<String, MultiSigTx> getPendingTransactions() { return pendingTransactions; }
}
