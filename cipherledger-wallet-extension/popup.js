// popup.js - Extension Logic for CipherLedger Wallet

const API_BASE = "http://localhost:8080/api";
let currentAddress = "";

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initialize Wallet
    await initWallet();

    // 2. Fetch Balance
    await refreshBalance();

    // 3. Setup Event Listeners
    document.getElementById("refreshBtn").addEventListener("click", refreshBalance);
    
    document.getElementById("sendBtn").addEventListener("click", () => {
        document.querySelector(".actions").style.display = "none";
        document.getElementById("sendForm").style.display = "flex";
    });

    document.getElementById("cancelSendBtn").addEventListener("click", () => {
        document.getElementById("sendForm").style.display = "none";
        document.querySelector(".actions").style.display = "flex";
        document.getElementById("txStatus").innerText = "";
    });

    document.getElementById("confirmSendBtn").addEventListener("click", sendTransaction);
    
    document.getElementById("walletAddress").addEventListener("click", () => {
        navigator.clipboard.writeText(currentAddress);
        const addrEl = document.getElementById("walletAddress");
        const origText = addrEl.innerText;
        addrEl.innerText = "Copied!";
        setTimeout(() => addrEl.innerText = origText, 1500);
    });
});

async function initWallet() {
    // Check if we have an address stored
    const result = await chrome.storage.local.get(['cipherAddress']);
    if (result.cipherAddress) {
        currentAddress = result.cipherAddress;
    } else {
        // Generate a new mock address for this demo
        // In a real wallet, we would generate a true ECDSA KeyPair here.
        const array = new Uint8Array(20);
        window.crypto.getRandomValues(array);
        currentAddress = "0x" + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        await chrome.storage.local.set({ cipherAddress: currentAddress });
    }
    
    // Truncate for display: 0x1234...5678
    const displayAddr = currentAddress.substring(0, 6) + "..." + currentAddress.substring(currentAddress.length - 4);
    document.getElementById("walletAddress").innerText = displayAddr;
}

async function refreshBalance() {
    try {
        const response = await fetch(`${API_BASE}/wallets/${currentAddress}/balance`);
        if (response.ok) {
            const data = await response.json();
            // Data might be a map of token -> balance
            const cldBalance = data["CLD"] || 0.0;
            document.getElementById("cldBalance").innerText = cldBalance.toFixed(2);
        } else {
            document.getElementById("cldBalance").innerText = "0.00";
        }
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        document.getElementById("cldBalance").innerText = "Err";
    }
}

async function sendTransaction() {
    const recipient = document.getElementById("recipientInput").value;
    const amount = parseFloat(document.getElementById("amountInput").value);
    const statusEl = document.getElementById("txStatus");

    if (!recipient || isNaN(amount) || amount <= 0) {
        statusEl.innerText = "Invalid input.";
        statusEl.style.color = "var(--error)";
        return;
    }

    statusEl.innerText = "Sending...";
    statusEl.style.color = "var(--text-secondary)";

    const tx = {
        sender: currentAddress,
        recipient: recipient,
        amount: amount,
        gasPrice: 0.00001, // Default base fee
        gasLimit: 21000
    };

    try {
        const response = await fetch(`${API_BASE}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tx)
        });

        if (response.ok) {
            const result = await response.json();
            statusEl.innerText = "Success!";
            statusEl.style.color = "var(--success)";
            
            // Clear form
            document.getElementById("recipientInput").value = "";
            document.getElementById("amountInput").value = "";
            
            // Wait a sec then go back
            setTimeout(() => {
                document.getElementById("cancelSendBtn").click();
                refreshBalance();
            }, 1500);
        } else {
            statusEl.innerText = "Transaction failed.";
            statusEl.style.color = "var(--error)";
        }
    } catch (error) {
        console.error("Error sending tx:", error);
        statusEl.innerText = "Network error.";
        statusEl.style.color = "var(--error)";
    }
}
