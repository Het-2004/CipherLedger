import axiosClient from "./axiosClient";
import { mockBlockchain } from "../utils/mockBlockchain";

export const sendTransaction = async (data) => {
  try {
    const res = await axiosClient.post("/transactions", data);
    return res;
  } catch (err) {
    console.warn("Transaction API unavailable. Processing transaction locally.", err);
    return { data: mockBlockchain.addTransaction(data) };
  }
};

export const getTransactions = async () => {
  try {
    const res = await axiosClient.get("/transactions");
    return res;
  } catch (err) {
    console.warn("Transactions API unavailable. Retrieving local transaction history.", err);
    return { data: mockBlockchain.getTransactions() };
  }
};