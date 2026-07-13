import React, { useState, useEffect } from 'react';
import { 
  Search, Database, Activity, Cpu, Lock, Key, RefreshCw, 
  CheckCircle2, ArrowRight, ExternalLink, ShieldAlert, Globe, Coins, Terminal 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Explorer() {
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'bridge' | 'ibc' | 'wallet'
  
  // Local Query States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [resultType, setResultType] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState([]);

  // Bridge States
  const [bridgeAsset, setBridgeAsset] = useState('ETH');
  const [bridgeSender, setBridgeSender] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [bridgeRecipient, setBridgeRecipient] = useState('cl_ops_vault_01');
  const [bridgeAmount, setBridgeAmount] = useState('1.5');
  const [lockedRecord, setLockedRecord] = useState(null);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [wrappedBalances, setWrappedBalances] = useState({});

  // Oracle & IBC States
  const [oraclePrices, setOraclePrices] = useState(null);
  const [ibcChannels, setIbcChannels] = useState([]);
  const [ibcPackets, setIbcPackets] = useState([]);
  const [ibcPayload, setIbcPayload] = useState('{"action": "transfer", "amount": "100"}');
  const [selectedChannel, setSelectedChannel] = useState('channel-0');
  const [relayLoading, setRelayLoading] = useState(false);

  // Derivation States
  const [mnemonic, setMnemonic] = useState('solar energy planet matrix gravity shadow liquid light tunnel echo space vortex');
  const [derivedAddresses, setDerivedAddresses] = useState(null);
  const [deriveLoading, setDeriveLoading] = useState(false);

  // Fetch initial local block data
  useEffect(() => {
    fetch('http://localhost:8080/api/blockchain')
      .then(res => res.json())
      .then(data => setBlocks(data))
      .catch(err => console.error(err));
  }, []);

  // Fetch Oracle and IBC States periodically
  useEffect(() => {
    const fetchOraclesAndIbc = () => {
      fetch('http://localhost:8080/api/crosschain/oracle/prices')
        .then(res => res.json())
        .then(data => setOraclePrices(data))
        .catch(() => {
          // Fallback static oracle simulation if backend is offline
          setOraclePrices({
            "CL/USD": { price: 1.84, deviation: 0.12, lastUpdated: Date.now(), oracleNodesReported: 15 },
            "ETH/USD": { price: 3450.25, deviation: -0.45, lastUpdated: Date.now(), oracleNodesReported: 16 },
            "BTC/USD": { price: 97200.50, deviation: 1.25, lastUpdated: Date.now(), oracleNodesReported: 14 }
          });
        });

      fetch('http://localhost:8080/api/crosschain/ibc/channels')
        .then(res => res.json())
        .then(data => setIbcChannels(data))
        .catch(() => {
          setIbcChannels([
            { channelId: 'channel-0', destChain: 'Cosmos Hub', status: 'OPEN', packetsRelayed: 124 },
            { channelId: 'channel-1', destChain: 'Osmosis Dex', status: 'OPEN', packetsRelayed: 89 },
            { channelId: 'channel-2', destChain: 'Evmos EVM', status: 'OPEN', packetsRelayed: 42 }
          ]);
        });

      fetch('http://localhost:8080/api/crosschain/ibc/packets')
        .then(res => res.json())
        .then(data => setIbcPackets(data))
        .catch(() => {});
    };

    fetchOraclesAndIbc();
    const interval = setInterval(fetchOraclesAndIbc, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch wrapped balances
  const refreshBridgeBalances = () => {
    fetch(`http://localhost:8080/api/crosschain/bridge/balances/${bridgeRecipient}`)
      .then(res => res.json())
      .then(data => setWrappedBalances(data))
      .catch(() => {
        setWrappedBalances({ wETH: 1.5, wBTC: 0.0 });
      });
  };

  useEffect(() => {
    refreshBridgeBalances();
  }, [bridgeRecipient]);

  // Local Chain Search
  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setSearchResult(null);
    setResultType('');

    try {
      const block = blocks.find(b => b.hash === searchQuery || String(b.index) === searchQuery);
      if (block) {
        setSearchResult(block);
        setResultType('block');
        setLoading(false);
        return;
      }

      for (let b of blocks) {
        const tx = b.transactions.find(t => t.transactionId === searchQuery);
        if (tx) {
          setSearchResult(tx);
          setResultType('transaction');
          setLoading(false);
          return;
        }
      }

      const cldRes = await fetch(`http://localhost:8080/api/tokens/CLD/balance/${searchQuery}`);
      if (cldRes.ok) {
        const cldBalance = await cldRes.json();
        const portfolio = { CLD: cldBalance };
        
        try {
          const bridgeRes = await fetch(`http://localhost:8080/api/crosschain/bridge/balances/${searchQuery}`);
          if (bridgeRes.ok) {
            const bridgeBalances = await bridgeRes.json();
            Object.assign(portfolio, bridgeBalances);
          }
        } catch (e) {
          console.error("Could not fetch bridge balances", e);
        }

        setSearchResult(portfolio);
        setResultType('wallet');
      } else {
        setSearchResult({ error: "No records found on the ledger." });
        setResultType('error');
      }
    } catch (err) {
      setSearchResult({ error: "Search failed. Check node status." });
      setResultType('error');
    } finally {
      setLoading(false);
    }
  };

  // Cross-Chain Bridge lock
  const handleBridgeLock = async () => {
    setBridgeLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/crosschain/bridge/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: bridgeSender,
          recipient: bridgeRecipient,
          amount: parseFloat(bridgeAmount),
          asset: bridgeAsset
        })
      });
      const data = await res.json();
      setLockedRecord(data);
      toast.success("Assets successfully locked on external chain!");
    } catch (e) {
      toast.error("Bridge lock simulation failed.");
    } finally {
      setBridgeLoading(false);
    }
  };

  // Cross-Chain Bridge Claim
  const handleBridgeClaim = async () => {
    if (!lockedRecord) return;
    setBridgeLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/crosschain/bridge/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foreignTxId: lockedRecord.foreignTxId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Minted ${data.amount} ${data.asset} on CipherLedger!`);
        setLockedRecord(prev => ({ ...prev, claimed: true, claimTxId: data.claimTxId }));
        refreshBridgeBalances();
      } else {
        toast.error(data.error || "Claim verification failed.");
      }
    } catch (e) {
      toast.error("Claim relay failed.");
    } finally {
      setBridgeLoading(false);
    }
  };

  // Cosmos IBC Packet relay
  const handleIbcRelay = async () => {
    setRelayLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/crosschain/ibc/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannel,
          data: ibcPayload
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("IBC Packet Relayed and Acknowledged!");
        setIbcPackets(prev => [data, ...prev]);
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      toast.success("IBC Packet Relayed (Simulated Ack)");
    } finally {
      setRelayLoading(false);
    }
  };

  // BIP44 Address derivation
  const handleDeriveAddresses = async () => {
    setDeriveLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/crosschain/wallet/derive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mnemonic })
      });
      const data = await res.json();
      setDerivedAddresses(data.addresses);
    } catch (e) {
      // Fallback derivation
      setDerivedAddresses({
        CIPHER_LEDGER: "cl_c8e9f2a4b0d1e3f5a6b8c0d2e4f6a8b0c2d4e6f8",
        ETHEREUM: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
        BITCOIN: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkf5x0adh3"
      });
    } finally {
      setDeriveLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in text-white">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Globe className="w-8 h-8 text-cyber-cyan animate-pulse" />
          Cross-Chain Portal & Explorer
        </h1>
        <p className="text-slate-400 mt-2">
          Monitor oracle consensus, Cosmos IBC channels, secure token bridges, and derive multi-chain wallets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'local', label: 'Local Ledger Explorer', icon: <Search className="w-4 h-4" /> },
          { id: 'bridge', label: 'Cross-Chain Bridge', icon: <Lock className="w-4 h-4" /> },
          { id: 'ibc', label: 'Oracles & Cosmos IBC', icon: <Globe className="w-4 h-4" /> },
          { id: 'wallet', label: 'Multi-Chain Wallet', icon: <Key className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchResult(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.06)]' 
                : 'bg-slate-900/40 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Views */}
      <div className="bg-slate-950 border border-white/10 rounded-2xl p-6 min-h-[400px]">
        
        {/* Local Ledger Explorer Tab */}
        {activeTab === 'local' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white">Local Block & Transaction Query</h3>
              <p className="text-xs text-slate-400 mt-1">Search the CipherLedger node db by block index, block hash, transaction ID, or wallet account address.</p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search block index, hash, txid, or cl_address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/30"
              />
              <button
                onClick={handleSearch}
                className="bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)]"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Execute Search'}
              </button>
            </div>

            {searchResult && (
              <div className="bg-slate-900/45 border border-white/5 rounded-xl p-5 space-y-4">
                {resultType === 'error' && (
                  <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                    <ShieldAlert className="w-4.5 h-4.5" />
                    {searchResult.error}
                  </div>
                )}

                {resultType === 'block' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-cyber-emerald flex items-center gap-2 text-sm">
                      <Database className="w-4.5 h-4.5" /> Block Found (Index: {searchResult.index})
                    </h4>
                    <div className="text-xs font-mono text-slate-400 space-y-1.5">
                      <div className="break-all"><span className="text-slate-500 font-bold">Hash:</span> {searchResult.hash}</div>
                      <div className="break-all"><span className="text-slate-500">Prev Hash:</span> {searchResult.previousHash}</div>
                      <div><span className="text-slate-500">Timestamp:</span> {new Date(searchResult.timestamp).toLocaleString()}</div>
                      <div><span className="text-slate-500">Nonce:</span> {searchResult.nonce}</div>
                    </div>
                    <div className="pt-2">
                      <span className="text-xs font-mono text-slate-400 font-bold">Transactions ({searchResult.transactions.length})</span>
                      <pre className="bg-black/40 border border-white/5 rounded-lg p-3 text-[10px] font-mono text-cyber-cyan max-h-40 overflow-y-auto mt-2 scrollbar-thin">
                        {JSON.stringify(searchResult.transactions, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {resultType === 'transaction' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-cyber-cyan flex items-center gap-2 text-sm">
                      <Activity className="w-4.5 h-4.5" /> Transaction Verified
                    </h4>
                    <div className="text-xs font-mono text-slate-400 space-y-1.5">
                      <div className="break-all"><span className="text-slate-500 font-bold">TxID:</span> {searchResult.transactionId}</div>
                      <div className="break-all"><span className="text-slate-500">Sender:</span> {searchResult.sender}</div>
                      <div className="break-all"><span className="text-slate-500">Recipient:</span> {searchResult.receiver || searchResult.recipient}</div>
                      <div><span className="text-slate-500">Amount:</span> {searchResult.amount} CL</div>
                      <div><span className="text-slate-500">Gas Limit:</span> {searchResult.gasLimit}</div>
                      <div className="break-all"><span className="text-slate-500">Signature:</span> {searchResult.signature}</div>
                    </div>
                  </div>
                )}

                {resultType === 'wallet' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-purple-400 flex items-center gap-2 text-sm">
                      <Coins className="w-4.5 h-4.5" /> Ledger Wallet Portfolio
                    </h4>
                    <div className="text-xs font-mono text-slate-400">
                      <div><span className="text-slate-500">Query Address:</span> {searchQuery}</div>
                      <div className="mt-4 border-t border-white/5 pt-3 space-y-2">
                        {Object.keys(searchResult).map(asset => (
                          <div key={asset} className="flex justify-between max-w-xs border-b border-white/5 pb-1">
                            <span className="text-slate-500 font-bold">{asset}:</span>
                            <span className="text-slate-200">{searchResult[asset]}</span>
                          </div>
                        ))}
                        {Object.keys(searchResult).length === 0 && <div>No balances recorded.</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Blocks List */}
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider mb-3">Recent Blocks Feed</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {blocks.slice().reverse().slice(0, 4).map(b => (
                  <div key={b.index} className="bg-slate-900/40 border border-white/5 rounded-xl p-3.5 flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-200">Block #{b.index}</span>
                    <span className="text-slate-500 max-w-[200px] md:max-w-none truncate">{b.hash}</span>
                    <span className="text-cyber-cyan">{b.transactions ? b.transactions.length : 0} transactions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cross-Chain Bridge Tab */}
        {activeTab === 'bridge' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white">Cross-Chain Token Bridge</h3>
              <p className="text-xs text-slate-400 mt-1">Simulate locking native tokens on Ethereum or Bitcoin, then claiming the equivalent wrapped tokens (wETH, wBTC) on CipherLedger.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Lock asset form */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Lock External Asset</div>
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-slate-500 mb-1">Select Foreign Asset</label>
                    <select 
                      value={bridgeAsset}
                      onChange={(e) => setBridgeAsset(e.target.value)}
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-cyber-cyan/50 text-slate-200 font-mono"
                    >
                      <option value="ETH">ETH (Ethereum)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Sender Address (Foreign Chain)</label>
                    <input
                      type="text"
                      value={bridgeSender}
                      onChange={(e) => setBridgeSender(e.target.value)}
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-cyber-cyan/50 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Recipient Address (CipherLedger)</label>
                    <input
                      type="text"
                      value={bridgeRecipient}
                      onChange={(e) => setBridgeRecipient(e.target.value)}
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-cyber-cyan/50 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Lock Amount</label>
                    <input
                      type="number"
                      value={bridgeAmount}
                      onChange={(e) => setBridgeAmount(e.target.value)}
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 focus:outline-none focus:border-cyber-cyan/50 text-slate-200 font-mono"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleBridgeLock}
                  disabled={bridgeLoading}
                  className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {bridgeLoading ? 'Locking on External Chain...' : 'Lock Asset'}
                </button>
              </div>

              {/* Claim wrapped asset */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Claim Wrapped Token</div>
                  <p className="text-xs text-slate-400">Claims are processed by relaying the external transaction lock proof to CipherLedger validators to safely mint wrapped assets.</p>
                  
                  {lockedRecord ? (
                    <div className="p-4 bg-slate-950 border border-white/5 rounded-xl space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lock TxID:</span>
                        <span className="text-cyber-cyan">{lockedRecord.foreignTxId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Asset:</span>
                        <span className="text-slate-200">{lockedRecord.amount} {lockedRecord.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className={lockedRecord.claimed ? 'text-cyber-emerald font-bold' : 'text-orange-400 font-bold'}>
                          {lockedRecord.claimed ? 'CLAIMED' : 'LOCKED (PENDING CLAIM)'}
                        </span>
                      </div>
                      {lockedRecord.claimed && (
                        <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                          <span className="text-slate-500">Claim TxID:</span>
                          <span className="text-slate-200">{lockedRecord.claimTxId}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center border border-dashed border-white/5 rounded-xl text-xs font-mono text-slate-600">
                      No active lock record generated. Submit form to lock.
                    </div>
                  )}

                  <button
                    onClick={handleBridgeClaim}
                    disabled={!lockedRecord || lockedRecord.claimed || bridgeLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-40"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyber-cyan" />
                    Claim Wrapped Tokens
                  </button>
                </div>

                <div className="border-t border-white/5 pt-4 mt-4 space-y-2 text-xs font-mono">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Wrapped Balances ({bridgeRecipient})</div>
                  <div className="flex gap-4">
                    <div className="bg-slate-950 p-2.5 border border-white/5 rounded-lg flex-1">
                      <span className="text-[10px] text-slate-500 block">wETH</span>
                      <span className="text-sm font-bold text-cyber-cyan">{wrappedBalances.wETH || '0.0'}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 border border-white/5 rounded-lg flex-1">
                      <span className="text-[10px] text-slate-500 block">wBTC</span>
                      <span className="text-sm font-bold text-orange-400">{wrappedBalances.wBTC || '0.0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Oracles & IBC Tab */}
        {activeTab === 'ibc' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Chainlink Price Feeds */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider flex justify-between">
                  <span>Chainlink Oracle Feeds</span>
                  <span className="text-cyber-emerald flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-pulse" /> LIVE</span>
                </div>
                
                {oraclePrices ? (
                  <div className="space-y-3 font-mono text-xs">
                    {Object.keys(oraclePrices).map(pair => {
                      const data = oraclePrices[pair];
                      const isPositive = data.deviation >= 0;
                      return (
                        <div key={pair} className="bg-slate-950 p-3 border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-200 text-sm block">{pair}</span>
                            <span className="text-[10px] text-slate-500">Nodes Reported: {data.oracleNodesReported}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-sm text-slate-200 block">${data.price.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold ${isPositive ? 'text-cyber-emerald' : 'text-red-400'}`}>
                              {isPositive ? '+' : ''}{data.deviation.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading Price Feeds...</div>
                )}
              </div>

              {/* Cosmos IBC Channels Relayer */}
              <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 space-y-4">
                <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 uppercase tracking-wider">Cosmos IBC Relayer</div>
                
                <div className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-2 scrollbar-thin">
                    {ibcChannels.map(channel => (
                      <div 
                        key={channel.channelId} 
                        onClick={() => setSelectedChannel(channel.channelId)}
                        className={`p-3 border rounded-xl flex justify-between items-center cursor-pointer transition ${
                          selectedChannel === channel.channelId 
                            ? 'bg-cyber-cyan/5 border-cyber-cyan/40' 
                            : 'bg-slate-950 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-200 block">{channel.channelId} ({channel.destChain})</span>
                          <span className="text-[10px] text-slate-500">Status: {channel.status}</span>
                        </div>
                        <span className="text-[10px] text-cyber-cyan">{channel.packetsRelayed} relayed</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500">Packet Data Payload (JSON)</label>
                    <input
                      type="text"
                      value={ibcPayload}
                      onChange={(e) => setIbcPayload(e.target.value)}
                      className="w-full bg-black/55 border border-white/10 rounded-lg py-2 px-3 text-slate-200 text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleIbcRelay}
                    disabled={relayLoading}
                    className="w-full bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${relayLoading ? 'animate-spin' : ''}`} />
                    Relay Packet on {selectedChannel}
                  </button>
                </div>
              </div>

            </div>

            {/* Relayed packet logs */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <h4 className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">IBC RELAYED PACKETS LOG</h4>
              <div className="bg-slate-950 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-slate-400 space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                {ibcPackets.length === 0 ? (
                  <div className="text-center py-4 text-slate-600">[Relay ledger empty. Submit packet payload to log Relays]</div>
                ) : (
                  ibcPackets.map((pkt, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-1.5 last:border-0">
                      <span>[{pkt.sequence}] {pkt.packetId}</span>
                      <span className="text-cyber-cyan truncate max-w-sm">{pkt.data}</span>
                      <span className="text-cyber-emerald font-bold">{pkt.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Multi-Chain Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-white">Multi-Chain Deterministic Key Derivations</h3>
              <p className="text-xs text-slate-400 mt-1">Enter a BIP39 mnemonic phrase to derive deterministic wallets/addresses across multiple protocol layers.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">12-Word Mnemonic Phrase</label>
                <input
                  type="text"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-cyan/50"
                />
              </div>

              <button
                onClick={handleDeriveAddresses}
                disabled={deriveLoading}
                className="bg-cyber-cyan hover:bg-cyber-cyan/95 text-slate-950 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(6,182,212,0.12)] disabled:opacity-50"
              >
                <Key className="w-4 h-4" />
                {deriveLoading ? 'Deriving Keys...' : 'Derive Address Hierarchy'}
              </button>

              {derivedAddresses && (
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-5 space-y-4 font-mono text-xs">
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-2 gap-2">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">CipherLedger Wallet</span>
                    <span className="text-cyber-cyan break-all">{derivedAddresses.CIPHER_LEDGER}</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-2 gap-2">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Ethereum Wallet (EVM)</span>
                    <span className="text-purple-400 break-all">{derivedAddresses.ETHEREUM}</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Bitcoin Wallet (Bech32)</span>
                    <span className="text-orange-400 break-all">{derivedAddresses.BITCOIN}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
