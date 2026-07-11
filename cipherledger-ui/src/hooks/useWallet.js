import { useState, useEffect } from "react";
import { getCurrentWallet, getBalance } from "../api/walletApi";

export default function useWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await getCurrentWallet();
      const walletData = res.data;
      
      // Update balance
      const balRes = await getBalance(walletData.address);
      walletData.balance = balRes.data.balance;
      
      setWallet(walletData);
    } catch (err) {
      console.error("Failed to load wallet", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return {
    wallet,
    setWallet,
    refresh: fetchWallet,
    loading
  };
}

