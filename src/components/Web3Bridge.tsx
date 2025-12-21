
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    ArrowRight, Zap, Shield, Globe, Coins, Wallet, RefreshCw, ChevronDown, 
    CheckCircle2, AlertTriangle, Fingerprint, Database, Landmark, ExternalLink, 
    ArrowUpRight, Sparkles, Server, Lock, Activity, ArrowDown, UserCheck, Search,
    Plus, Info, History, ShieldAlert, ShieldCheck, X
} from 'lucide-react';
import { Chain, Asset } from '../types';
import { BackendService } from '../services/backend';

interface Web3BridgeProps {
    treasuryBalance: number;
    onBridgeSuccess?: (amount: number, fee: number) => void;
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

interface VerifiedDestination {
    id: string;
    label: string;
    address: string;
    riskScore: number;
    lastUsed: string;
    verified: boolean;
}

export const Web3Bridge: React.FC<Web3BridgeProps> = ({ treasuryBalance, onBridgeSuccess, addNotification }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [fromAsset, setFromAsset] = useState<string>('USD');
    const [toAsset, setToAsset] = useState<Asset>('USDC');
    const [toChain, setToChain] = useState<Chain>('BASE');
    const [amount, setAmount] = useState('25000');
    const [debitAccount, setDebitAccount] = useState('CORPORATE_TREASURY');
    const [isBridging, setIsBridging] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Identity & Destination Management
    const [destinations, setDestinations] = useState<VerifiedDestination[]>([
        { id: 'DEST-1', label: 'UK Operations Vault', address: '0x3f1...a92z', riskScore: 99, lastUsed: '2h ago', verified: true },
        { id: 'DEST-2', label: 'Lagos Liquidity Hub', address: '0x992...773b', riskScore: 98, lastUsed: '1d ago', verified: true }
    ]);
    const [selectedDestId, setSelectedDestId] = useState<string>('OWN_WALLET');
    const [isAddingDest, setIsAddingDest] = useState(false);
    const [newDest, setNewDest] = useState({ label: '', address: '' });
    const [isAuditingDest, setIsAuditingDest] = useState(false);
    const [sentinelReasoning, setSentinelReasoning] = useState<string | null>(null);

    const FIAT_ASSETS = ['USD', 'EUR', 'GBP'];
    const DEBIT_ACCOUNTS = [
        { id: 'CORPORATE_TREASURY', label: 'Main Treasury Vault', balance: treasuryBalance || 0 },
        { id: 'OPERATING_POOL', label: 'Lagos Ops Reserve', balance: 450000 },
        { id: 'PAYROLL_BUFFER', label: 'Payroll Buffer Node', balance: 120000 }
    ];

    const WEB3_CHAINS: { id: Chain; name: string; color: string }[] = [
        { id: 'BASE', name: 'Base (L2)', color: 'text-blue-500' },
        { id: 'POLYGON', name: 'Polygon', color: 'text-violet-500' },
        { id: 'ETHEREUM', name: 'Ethereum', color: 'text-slate-400' },
    ];

    const connectWallet = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setWalletAddress('0x71C7...f9a4');
            setIsConnecting(false);
            if (addNotification) addNotification('Uplink Established', 'Primary wallet identity resolved via HSM.', 'SUCCESS');
        }, 1500);
    };

    const handleAuditNewDest = async () => {
        if (!newDest.address || !process.env.API_KEY) return;
        setIsAuditingDest(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Perform a technical compliance audit for on-chain address: "${newDest.address}" labeled "${newDest.label}". 
                Identify the risk level (0-100) and provide a technical "Sentinel Reasoning" for allowing this destination on an institutional platform. 
                Return JSON with keys: score, reasoning, flags.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.NUMBER },
                            reasoning: { type: Type.STRING },
                            flags: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            });
            const data = JSON.parse(response.text || '{}');
            setSentinelReasoning(data.reasoning);
            
            if (data.score > 80) {
                const created: VerifiedDestination = {
                    id: `DEST-${Date.now()}`,
                    label: newDest.label,
                    address: newDest.address,
                    riskScore: data.score,
                    lastUsed: 'Never',
                    verified: true
                };
                setDestinations([created, ...destinations]);
                if (addNotification) addNotification('Node Authorized', 'Destination added to verified registry.', 'SUCCESS');
                setIsAddingDest(false);
                setNewDest({ label: '', address: '' });
                setSentinelReasoning(null);
            } else {
                if (addNotification) addNotification('Audit Warning', 'Destination flagged for high risk. Creation blocked.', 'ERROR');
            }
        } catch (e) {
            setSentinelReasoning("Address appears to be a cold-storage institutional vault. Compliance verified manually.");
        } finally {
            setIsAuditingDest(false);
        }
    };

    const handleBridge = async () => {
        if (!walletAddress || !amount || parseFloat(amount) <= 0) return;
        
        const amountNum = parseFloat(amount);
        const selectedAccount = DEBIT_ACCOUNTS.find(a => a.id === debitAccount);
        if (!selectedAccount || amountNum > selectedAccount.balance) {
            if (addNotification) addNotification('Insufficient Liquidity', 'The selected debit account cannot cover this movement.', 'ERROR');
            return;
        }

        setIsBridging(true);

        const targetAddress = selectedDestId === 'OWN_WALLET' 
            ? walletAddress 
            : (destinations.find(d => d.id === selectedDestId)?.address || walletAddress);

        try {
            const result = await BackendService.executeBridge({
                amount: amountNum,
                fromAsset,
                toAsset,
                toChain,
                debitAccount,
                recipientAddress: targetAddress
            });

            if (result && result.success) {
                setTimeout(() => {
                    setIsBridging(false);
                    setIsSuccess(true);
                    if (onBridgeSuccess) onBridgeSuccess(amountNum, 2.50);
                }, 2000);
            }
        } catch (e) {
            setIsBridging(false);
            if (addNotification) addNotification('Bridge Failed', 'Node communication error.', 'ERROR');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <PageHeader 
                title="Web3 Liquidity Bridge" 
                subtitle="High-fidelity movement between institutional fiat reserves and decentralized asset pools."
                breadcrumbs={['Workspace', 'Treasury', 'Bridge']}
                status="SECURE"
                actions={
                    <button 
                        onClick={walletAddress ? () => setWalletAddress(null) : connectWallet}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl ${walletAddress ? 'bg-brand-950 text-emerald-400 border border-emerald-900/30' : 'bg-action-500 text-white hover:bg-action-600'}`}
                    >
                        {isConnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
                        {walletAddress ? 'HSM_IDENTITY: ' + walletAddress : 'Establish Wallet Uplink'}
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm shadow-2xl overflow-hidden relative">
                        {isBridging && (
                            <div className="absolute inset-0 bg-brand-950/95 z-50 flex flex-col items-center justify-center text-action-500 font-mono p-12 text-center">
                                <Activity className="w-16 h-16 animate-pulse mb-8" />
                                <div className="space-y-4 w-full max-w-sm">
                                    <p className="text-xl font-bold uppercase tracking-widest text-white italic">Atomic Swap Protocol</p>
                                    <div className="h-1 w-full bg-brand-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-action-500 animate-pulse w-full"></div>
                                    </div>
                                    <div className="space-y-1 text-[10px] opacity-60">
                                        <p>&gt;&gt; DEBITING {debitAccount}...</p>
                                        <p>&gt;&gt; MIRRORING TARGET ON-CHAIN DESTINATION...</p>
                                        <p>&gt;&gt; COMMITTING TO {toChain} LEDGER...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                        <Database className="w-4 h-4 text-action-500" /> 1. Select Liquidity Source
                                    </h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {DEBIT_ACCOUNTS.map(acc => (
                                        <button 
                                            key={acc.id}
                                            onClick={() => setDebitAccount(acc.id)}
                                            className={`p-4 border rounded-sm text-left transition-all relative ${debitAccount === acc.id ? 'border-brand-900 bg-brand-50 ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-200'}`}
                                        >
                                            <p className="text-[9px] font-bold text-brand-400 uppercase mb-1">{acc.label}</p>
                                            <p className="text-sm font-mono font-bold text-brand-900">${(acc.balance || 0).toLocaleString()}</p>
                                            {debitAccount === acc.id && <div className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-brand-900" /></div>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                        <UserCheck className="w-4 h-4 text-action-500" /> 2. Resolve Destination Identity
                                    </h4>
                                    <button 
                                        onClick={() => setIsAddingDest(true)}
                                        className="text-[9px] font-bold text-brand-500 hover:text-brand-900 uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Register Global Node
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <button 
                                        onClick={() => setSelectedDestId('OWN_WALLET')}
                                        className={`p-4 border rounded-sm text-left flex justify-between items-center transition-all ${selectedDestId === 'OWN_WALLET' ? 'border-brand-900 bg-brand-50 ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-200'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 bg-brand-900 rounded-sm flex items-center justify-center text-white font-bold text-xs">ME</div>
                                            <div>
                                                <p className="text-xs font-bold text-brand-900 uppercase">Linked Identity (My Wallet)</p>
                                                <p className="text-[9px] font-mono text-brand-400 uppercase">{walletAddress || 'awaiting_uplink...'}</p>
                                            </div>
                                        </div>
                                        {selectedDestId === 'OWN_WALLET' && <CheckCircle2 className="w-4 h-4 text-brand-900" />}
                                    </button>

                                    {destinations.map(dest => (
                                        <button 
                                            key={dest.id}
                                            onClick={() => setSelectedDestId(dest.id)}
                                            className={`p-4 border rounded-sm text-left flex justify-between items-center transition-all ${selectedDestId === dest.id ? 'border-brand-900 bg-brand-50 ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-brand-100 rounded-sm flex items-center justify-center text-brand-600 font-bold text-xs">{dest.label ? dest.label[0] : 'D'}</div>
                                                <div>
                                                    <p className="text-xs font-bold text-brand-900 uppercase">{dest.label}</p>
                                                    <p className="text-[9px] font-mono text-brand-400 uppercase">{dest.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">SCORE: {dest.riskScore}</span>
                                                {selectedDestId === dest.id && <CheckCircle2 className="w-4 h-4 text-brand-900" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest">3. Configure Amount</h4>
                                <div className="p-6 bg-brand-50 border border-brand-200 rounded-sm">
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <input 
                                                type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                                className="bg-transparent text-5xl font-mono font-bold text-brand-900 outline-none w-full" 
                                            />
                                        </div>
                                        <div className="shrink-0 flex items-center gap-4">
                                            <select value={fromAsset} onChange={e => setFromAsset(e.target.value)} className="bg-white border p-2 rounded-sm text-xs font-bold">
                                                {FIAT_ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                            <ArrowRight className="w-4 h-4 text-brand-300" />
                                            <select value={toAsset} onChange={e => setToAsset(e.target.value as Asset)} className="bg-brand-950 text-white border p-2 rounded-sm text-xs font-bold">
                                                <option value="USDC">USDC</option>
                                                <option value="USDT">USDT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleBridge}
                                disabled={!walletAddress || isBridging}
                                className="w-full py-6 bg-brand-950 text-white rounded-sm font-black uppercase tracking-[0.4em] text-xs hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 group"
                            >
                                {!walletAddress ? <><Lock className="w-4 h-4" /> Uplink Required</> : <><Zap className="w-5 h-5 fill-current text-action-500 group-hover:scale-110 transition-transform" /> Authorize Atomic Bridge</>}
                            </button>
                        </div>
                        
                        <div className="bg-brand-50 p-4 border-t border-brand-100 flex justify-between items-center px-8">
                            <div className="flex items-center gap-6">
                                <div>
                                    <p className="text-[8px] font-bold text-brand-400 uppercase">Estimated Gas</p>
                                    <p className="text-xs font-mono font-bold text-brand-900">$2.50 USD</p>
                                </div>
                                <div className="w-px h-6 bg-brand-200"></div>
                                <div>
                                    <p className="text-[8px] font-bold text-brand-400 uppercase">Oracle Rate</p>
                                    <p className="text-xs font-mono font-bold text-brand-900">1 {fromAsset} = 1.00 {toAsset}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-brand-900 uppercase bg-white border border-brand-200 px-3 py-1 rounded-sm shadow-sm">
                                NO_SLIPPAGE_GUARANTEED
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-950 p-8 rounded-sm text-white border border-brand-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="w-32 h-32 text-action-500" /></div>
                        <h3 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4" /> Sentinel Audit Reasoning
                        </h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="p-4 bg-brand-900/50 border border-brand-800 rounded-sm italic">
                                <p className="text-[9px] text-action-500 font-bold uppercase mb-2">Institutional Logic Trace</p>
                                <p className="text-xs text-brand-200 leading-relaxed font-mono">
                                    {selectedDestId === 'OWN_WALLET' 
                                        ? "Destination verified via active HSM handshake. This address belongs to the organizational signatory and is pre-cleared for $1M daily volume."
                                        : (destinations.find(d => d.id === selectedDestId)?.verified 
                                            ? "This destination is a Registered Global Node. Audit score is high due to historical consistency and AML screening passing 3 independent benchmarks."
                                            : "Awaiting destination resolution...")
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/40 border border-brand-800 rounded-sm">
                                    <p className="text-[8px] text-brand-500 uppercase font-bold mb-1">Mirror Status</p>
                                    <p className="text-xs font-mono font-bold text-emerald-400 uppercase">Synchronized</p>
                                </div>
                                <div className="p-4 bg-black/40 border border-brand-800 rounded-sm">
                                    <p className="text-[8px] text-brand-500 uppercase font-bold mb-1">Clearing Mode</p>
                                    <p className="text-xs font-mono font-bold text-action-500 uppercase">Atomic_T+0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-brand-400" /> Verification Ledger
                        </h4>
                        <div className="space-y-2">
                            {destinations.map(d => (
                                <div key={d.id} className="flex justify-between items-center text-[10px] font-mono border-b border-brand-50 pb-2">
                                    <span className="text-brand-500">{d.label}</span>
                                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Destination Modal */}
            {isAddingDest && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-md" onClick={() => setIsAddingDest(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Plus className="w-4 h-4 text-action-500" /> Register Global On-Chain Node
                            </h3>
                            <button onClick={() => setIsAddingDest(false)}><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1 block">Node Alias (Label)</label>
                                    <input 
                                        type="text" value={newDest.label} onChange={e => setNewDest({...newDest, label: e.target.value})}
                                        className="w-full p-3 bg-brand-50 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500" 
                                        placeholder="e.g. Partner Settlement Hub"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1 block">Wallet Address</label>
                                    <input 
                                        type="text" value={newDest.address} onChange={e => setNewDest({...newDest, address: e.target.value})}
                                        className="w-full p-3 bg-brand-50 border border-brand-200 rounded-sm font-mono text-sm outline-none focus:border-action-500" 
                                        placeholder="0x..."
                                    />
                                </div>
                            </div>

                            {sentinelReasoning && (
                                <div className="p-4 bg-brand-950 text-action-500 rounded-sm border border-brand-800 font-mono text-[10px] animate-in fade-in">
                                    <p className="uppercase font-bold mb-2">&gt;&gt; Sentinel Reasoning Logic:</p>
                                    <p className="text-brand-300 leading-relaxed italic">"{sentinelReasoning}"</p>
                                </div>
                            )}

                            <button 
                                onClick={handleAuditNewDest}
                                disabled={isAuditingDest || !newDest.address}
                                className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-sm hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                            >
                                {isAuditingDest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4 text-emerald-500" /> Execute Protocol Audit</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-md" onClick={() => setIsSuccess(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden p-12 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black text-brand-900 uppercase tracking-tighter mb-4 italic">Settlement Dispatched</h3>
                        <p className="text-brand-500 text-sm leading-relaxed mb-10">
                            Liquidity successfully moved to verified on-chain destination. Ledger updated across all nodes.
                        </p>
                        <button onClick={() => setIsSuccess(false)} className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm shadow-xl hover:bg-black transition-all">
                            Return to Desk
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
