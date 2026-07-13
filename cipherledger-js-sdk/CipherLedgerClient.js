const axios = require('axios');

class CipherLedgerClient {
    constructor(nodeUrl = 'http://localhost:8080') {
        this.nodeUrl = nodeUrl;
    }

    async getChain() {
        const response = await axios.get(`${this.nodeUrl}/api/blocks`);
        return response.data;
    }

    async getBlockByIndex(index) {
        const chain = await this.getChain();
        return chain.find(b => b.index === parseInt(index));
    }

    async sendTransaction(sender, recipient, amount, gasPrice = 0.00001, gasLimit = 21000) {
        const response = await axios.post(`${this.nodeUrl}/api/transactions`, {
            sender, recipient, amount, gasPrice, gasLimit
        });
        return response.data;
    }

    async getWalletBalance(address) {
        const response = await axios.get(`${this.nodeUrl}/api/wallets/${address}/balance`);
        return response.data;
    }

    async mintNFT(address, metadataUri, collectionId) {
        const response = await axios.post(`${this.nodeUrl}/api/nfts/mint?address=${address}&metadataUri=${metadataUri}&collectionId=${collectionId}`);
        return response.data;
    }
}

module.exports = CipherLedgerClient;
