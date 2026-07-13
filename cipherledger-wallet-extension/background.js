// background.js - Service Worker for the CipherLedger Wallet
console.log("CipherLedger Wallet Service Worker Loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log("CipherLedger Wallet installed.");
});
