import useWallet from "../hooks/useWallet";
import WalletCard from "../components/wallet/WalletCard";
import { Cpu } from "lucide-react";

export default function Wallet() {
  const { wallet, refresh, loading } = useWallet();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 font-mono text-xs text-slate-500">
        <Cpu className="w-8 h-8 text-cyber-cyan animate-spin" />
        <span>Synchronizing cryptographic key storage...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-wide">DIGITAL HARDWARE WALLET</h2>
        <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1">Holographic node wallet keys & balances</p>
      </div>

      <WalletCard
        wallet={wallet}
        onRefresh={refresh}
      />
    </div>
  );
}

