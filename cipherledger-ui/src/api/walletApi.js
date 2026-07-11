import axiosClient from "./axiosClient";
import { mockBlockchain } from "../utils/mockBlockchain";

export const createWallet = async () => {
  try {
    const res = await axiosClient.post("/wallet/create");
    // If backend returns a raw address string, format it as an object
    const data = typeof res.data === 'string' ? { address: res.data } : res.data;
    return { data };
  } catch (err) {
    console.warn("Wallet creation API unavailable. Generating local keys.", err);
    return { data: mockBlockchain.createWallet() };
  }
};

export const getBalance = async (address) => {
  try {
    const res = await axiosClient.get(`/wallet/${address}`);
    return res;
  } catch (err) {
    console.warn("Balance API unavailable. Querying local ledger balance.", err);
    const w = mockBlockchain.getWallet(address);
    return { data: { address, balance: w ? w.balance : 0 } };
  }
};

export const getCurrentWallet = async () => {
  try {
    const res = await axiosClient.get("/wallet/current");
    return res;
  } catch (err) {
    console.warn("Current wallet API unavailable. Reading local wallet.", err);
    return { data: mockBlockchain.getCurrentWallet() };
  }
};