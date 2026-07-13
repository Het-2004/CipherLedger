import React, { useState } from 'react';
import { Network, Plus, Image as ImageIcon, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NFTs() {
  const [colName, setColName] = useState("");
  const [colSymbol, setColSymbol] = useState("");
  const [colCreator, setColCreator] = useState("GENESIS");

  const [mintCol, setMintCol] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [mintUri, setMintUri] = useState("");

  const [listId, setListId] = useState("");
  const [listSeller, setListSeller] = useState("");
  const [listPrice, setListPrice] = useState("");

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/nft/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: colName, symbol: colSymbol, creator: colCreator })
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Collection created: ${data.collectionId.substring(0,8)}`);
      } else {
        toast.error("Failed to create collection");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleMintNFT = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId: mintCol, to: mintTo, metadataURI: mintUri })
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`NFT minted: ${data.tokenId.substring(0,8)}`);
      } else {
        toast.error("Failed to mint NFT");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleListNFT = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/nft/marketplace/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: listId, seller: listSeller, price: parseFloat(listPrice) })
      });
      if (res.ok) toast.success(`NFT listed for ${listPrice} CLD`);
      else toast.error("Failed to list NFT");
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in pb-32">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
          <Network className="text-cyber-cyan w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-light text-slate-200 tracking-tight">NFT <span className="font-semibold text-cyber-cyan">Platform</span></h1>
          <p className="text-sm font-mono text-slate-500 mt-1 uppercase tracking-widest">ERC-721 Marketplace & Minting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Collection */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <Plus className="w-4 h-4 text-cyber-cyan" /> New Collection
          </h2>
          <form onSubmit={handleCreateCollection} className="space-y-4">
            <input type="text" placeholder="Collection Name (e.g. CryptoPunks)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={colName} onChange={e => setColName(e.target.value)} />
            <input type="text" placeholder="Symbol (e.g. PUNK)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={colSymbol} onChange={e => setColSymbol(e.target.value.toUpperCase())} />
            <input type="text" placeholder="Creator Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={colCreator} onChange={e => setColCreator(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 rounded-xl text-sm font-medium transition-all">Create Collection</button>
          </form>
        </div>

        {/* Mint NFT */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <ImageIcon className="w-4 h-4 text-cyber-cyan" /> Mint NFT
          </h2>
          <form onSubmit={handleMintNFT} className="space-y-4">
            <input type="text" placeholder="Collection ID Hash" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintCol} onChange={e => setMintCol(e.target.value)} />
            <input type="text" placeholder="To Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintTo} onChange={e => setMintTo(e.target.value)} />
            <input type="text" placeholder="Metadata URI (ipfs://...)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={mintUri} onChange={e => setMintUri(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">Mint Asset</button>
          </form>
        </div>

        {/* Marketplace List */}
        <div className="cyber-glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-lg font-medium text-slate-300 flex items-center gap-2 mb-6">
            <ShoppingCart className="w-4 h-4 text-cyber-cyan" /> List on Marketplace
          </h2>
          <form onSubmit={handleListNFT} className="space-y-4">
            <input type="text" placeholder="NFT Token ID" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={listId} onChange={e => setListId(e.target.value)} />
            <input type="text" placeholder="Seller Address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={listSeller} onChange={e => setListSeller(e.target.value)} />
            <input type="number" placeholder="Price (in CLD)" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:border-cyber-cyan/50 outline-none" value={listPrice} onChange={e => setListPrice(e.target.value)} />
            <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-sm font-medium transition-all">List NFT</button>
          </form>
        </div>

      </div>
    </div>
  );
}
