import axiosClient from "./axiosClient";
import { mockBlockchain } from "../utils/mockBlockchain";
import { normalizeBlocks } from "../utils/normalizeBlock";

export const getBlocks = async () => {
  try {
    const res = await axiosClient.get("/blockchain");
    return { data: normalizeBlocks(res.data) };
  } catch (err) {
    console.warn("Blockchain API unavailable. Falling back to local storage.", err);
    return { data: normalizeBlocks(mockBlockchain.getBlocks()) };
  }
};

export const validateChain = async () => {
  try {
    const res = await axiosClient.get("/blockchain/validate");
    return res;
  } catch (err) {
    console.warn("Chain validation API unavailable. Running local validator.", err);
    return { data: { valid: mockBlockchain.validateChain() } };
  }
};

export const saveBlock = async (block) => {
  try {
    const res = await axiosClient.post("/blockchain/save", block);
    return res;
  } catch (err) {
    console.warn("Save block API unavailable. Appending block to local storage.", err);
    return { data: mockBlockchain.saveBlock(block) };
  }
};