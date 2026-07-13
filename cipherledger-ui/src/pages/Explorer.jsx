import React, { useState, useEffect } from 'react';

const Explorer = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [resultType, setResultType] = useState(''); // 'block', 'transaction', 'wallet'
    const [loading, setLoading] = useState(false);

    // Some basic stats
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/blocks')
            .then(res => res.json())
            .then(data => setBlocks(data))
            .catch(err => console.error(err));
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setLoading(true);
        setSearchResult(null);
        setResultType('');

        try {
            // 1. Try to find a Block by Hash
            const block = blocks.find(b => b.hash === searchQuery);
            if (block) {
                setSearchResult(block);
                setResultType('block');
                setLoading(false);
                return;
            }

            // 2. Try to find a Transaction by Hash
            for (let b of blocks) {
                const tx = b.transactions.find(t => t.transactionId === searchQuery);
                if (tx) {
                    setSearchResult(tx);
                    setResultType('transaction');
                    setLoading(false);
                    return;
                }
            }

            // 3. Try to fetch Wallet Balance (assume it's an address if not found above)
            const res = await fetch(`http://localhost:8080/api/wallets/${searchQuery}/balance`);
            if (res.ok) {
                const data = await res.json();
                setSearchResult(data);
                setResultType('wallet');
            } else {
                setSearchResult({ error: "Not found" });
                setResultType('error');
            }

        } catch (err) {
            console.error(err);
            setSearchResult({ error: "Search failed." });
            setResultType('error');
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>CipherLedger Explorer</h2>
            <p>Search by Block Hash, Transaction ID, or Wallet Address.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Enter Hash, TxID, or Address..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#1e293b', color: 'white' }}
                />
                <button 
                    onClick={handleSearch}
                    style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {searchResult && (
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
                    {resultType === 'error' && (
                        <h3 style={{ color: '#ef4444' }}>{searchResult.error}</h3>
                    )}
                    
                    {resultType === 'block' && (
                        <div>
                            <h3 style={{ color: '#10b981' }}>Block Found (Index: {searchResult.index})</h3>
                            <p><strong>Hash:</strong> {searchResult.hash}</p>
                            <p><strong>Previous Hash:</strong> {searchResult.previousHash}</p>
                            <p><strong>Timestamp:</strong> {new Date(searchResult.timestamp).toLocaleString()}</p>
                            <p><strong>Nonce:</strong> {searchResult.nonce}</p>
                            <h4>Transactions ({searchResult.transactions.length})</h4>
                            <pre style={{ background: '#0f172a', padding: '10px', borderRadius: '5px' }}>
                                {JSON.stringify(searchResult.transactions, null, 2)}
                            </pre>
                        </div>
                    )}

                    {resultType === 'transaction' && (
                        <div>
                            <h3 style={{ color: '#3b82f6' }}>Transaction Found</h3>
                            <p><strong>Tx ID:</strong> {searchResult.transactionId}</p>
                            <p><strong>Sender:</strong> {searchResult.sender}</p>
                            <p><strong>Recipient:</strong> {searchResult.recipient}</p>
                            <p><strong>Amount:</strong> {searchResult.amount}</p>
                            <p><strong>Gas Price:</strong> {searchResult.gasPrice}</p>
                            <p><strong>Signature:</strong> {searchResult.signature}</p>
                        </div>
                    )}

                    {resultType === 'wallet' && (
                        <div>
                            <h3 style={{ color: '#8b5cf6' }}>Wallet Portfolio</h3>
                            <p><strong>Address:</strong> {searchQuery}</p>
                            <h4>Balances:</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {Object.keys(searchResult).map(asset => (
                                    <li key={asset} style={{ padding: '5px 0', borderBottom: '1px solid #334155' }}>
                                        <strong>{asset}:</strong> {searchResult[asset]}
                                    </li>
                                ))}
                                {Object.keys(searchResult).length === 0 && <li>No assets found.</li>}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            
            <div style={{ marginTop: '40px' }}>
                <h3>Recent Blocks</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                    {Array.isArray(blocks) && blocks.slice().reverse().slice(0, 5).map(b => (
                        <div key={b.index} style={{ background: '#1e293b', padding: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Block #{b.index}</span>
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{b.hash.substring(0, 15)}...</span>
                            <span>{b.transactions ? b.transactions.length : 0} Txs</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explorer;
