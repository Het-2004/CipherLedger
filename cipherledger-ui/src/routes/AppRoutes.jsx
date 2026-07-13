import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Blockchain from "../pages/Blockchain";
import Mining from "../pages/Mining";
import Wallet from "../pages/Wallet";
import Transactions from "../pages/Transactions";
import Nodes from "../pages/Nodes";
import Login from "../pages/Login";
import CryptoPlayground from "../pages/CryptoPlayground";
import Contracts from "../pages/Contracts";
import Tokens from "../pages/Tokens";
import NFTs from "../pages/NFTs";
import Explorer from "../pages/Explorer";
import EnterpriseDashboard from "../pages/EnterpriseDashboard";
import { Toaster } from "react-hot-toast";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/blocks" element={<Blockchain />} />
          <Route path="/mining" element={<Mining />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/crypto-playground" element={<CryptoPlayground />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/enterprise" element={<EnterpriseDashboard />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "cyber-glass",
          style: {
            background: "rgba(9, 15, 30, 0.95)",
            border: "1px solid rgba(6, 182, 212, 0.15)",
            color: "#f1f5f9",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "11px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            borderRadius: "12px",
            padding: "12px 16px"
          }
        }}
      />
    </BrowserRouter>
  );
}

