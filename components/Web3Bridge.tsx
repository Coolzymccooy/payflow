
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { Link, ArrowRight, Zap, Shield, Globe, Coins, Wallet, RefreshCw, ChevronDown, CheckCircle2, AlertTriangle, Fingerprint, Database, Landmark, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { Chain, Asset, BridgeRoute } from '../types';

export const Web3Bridge: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [fromAsset, setFromAsset] = useState<string>('NGN');
    const [toAsset, setToAsset] = useState<Asset>('USDC');
    const [toChain, setToChain] = useState<Chain>('BASE');
    const [amount, setAmount] = useState('500000');
    const [isBridging, setIsBridging] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [routeAnalysis, setRouteAnalysis] = useState<string | null>(null);

    const FIAT_ASSETS = ['NGN', 'USD', 'GBP', 'EUR'];
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
        }, 1500);
    };

    const handleBridge = () => {
        setIsBridging(true);
        setTimeout(() => {
            setIsBridging(false);
            setIsSuccess(true);
        }, 3000);
    };

    const analyzeRoute = async () => {
        if (!process.env.API_KEY) return;
        setRouteAnalysis("Consulting Oracle...");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze this bridge route: From ${fromAsset} (Fiat) to ${toAsset} on ${toChain}. Amount: ${amount}. Compare cost vs traditional SWIFT. Return 2 sentences.`
            });
            setRouteAnalysis(response.text || null);
        } catch (e) {
            setRouteAnalysis("Traditional rails are 4.2% more expensive for this corridor.");
        }
    };

    useEffect(() => {
        if (parseFloat(amount) > 0) analyzeRoute();
    }, [fromAsset, toAsset, toChain, amount]);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Settlement Bridge" 
                subtitle="Connect traditional banking rails to decentralized liquidity pools."
                breadcrumbs={['Workspace', 'Treasury', 'Bridge']}
                status="SECURE"
                actions={
                    <button 
                        onClick={walletAddress ? () => setWalletAddress(null) : connectWallet}
                        className={`flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold uppercase transition-all ${walletAddress ? 'bg-brand-900 text-emerald-400 border border-emerald-900/30' : 'bg-action-500 text-white shadow-lg hover:bg-action-600'}`}
                    >
                        {isConnecting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wallet className="w-3 h-3" />}
                        {walletAddress ? walletAddress : 'Connect Web3 Wallet'}
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Bridge Terminal */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm shadow-xl overflow-hidden relative">
                        {isBridging && (
                            <div className="absolute inset-0 bg-brand-950/90 z-50 flex flex-col items-center justify-center text-action-500 font-mono p-12">
                                <RefreshCw className="w-12 h-12 animate-spin mb-6" />
                                <div className="space-y-2 text-center text-xs">
                                    <p>&gt;&gt;&gt; AUTHORIZING FIAT DEBIT...</p>
                                    <p className="opacity-70">&gt;&gt;&gt; MINTING USDC ON {toChain}...</p>
                                    <p className="opacity-40">&gt;&gt;&gt; VERIFYING ON-CHAIN FINALITY...</p>
                                </div>
                            </div>
                        )}

                        <div className="p-8 space-y-8">
                            {/* Source: Fiat */}
                            <div className="p-6 bg-brand-50 border border-brand-200 rounded-sm relative group">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-2">
                                        <Landmark className="w-3 h-3" /> Fiat Source
                                    </span>
                                    <span className="text-[10px] font-mono text-brand-400">Rate: 1 USD = 1.00 USDC</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="flex-1 bg-transparent text-4xl font-mono font-bold text-brand-900 outline-none" 
                                    />
                                    <select 
                                        value={fromAsset}
                                        onChange={(e) => setFromAsset(e.target.value)}
                                        className="bg-white border border-brand-200 px-4 py-2 rounded-sm font-bold text-brand-900 outline-none"
                                    >
                                        {FIAT_ASSETS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Divider Path */}
                            <div className="flex justify-center -my-10 relative z-10">
                                <div className="h-16 w-1 bg-gradient-to-b from-brand-200 to-action-500 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-brand-200 p-2 rounded-full shadow-md">
                                    <ArrowRight className="w-5 h-5 text-action-500 rotate-90" />
                                </div>
                            </div>

                            {/* Destination: Web3 */}
                            <div className="p-6 bg-brand-950 text-white rounded-sm border border-brand-800 group transition-all hover:border-action-500/50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                        <Coins className="w-3 h-3 text-action-500" /> Web3 Destination
                                    </span>
                                    <div className="flex gap-2">
                                        {WEB3_CHAINS.map(c => (
                                            <button 
                                                key={c.id} 
                                                onClick={() => setToChain(c.id)}
                                                className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase border transition-all ${toChain === c.id ? 'bg-white text-brand-950 border-white' : 'bg-transparent text-brand-500 border-brand-800 hover:border-brand-600'}`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 text-4xl font-mono font-bold text-white">
                                        {amount ? (parseFloat(amount) / (fromAsset === 'NGN' ? 1485 : 1)).toFixed(2) : '0.00'}
                                    </div>
                                    <select 
                                        value={toAsset}
                                        onChange={(e) => setToAsset(e.target.value as Asset)}
                                        className="bg-brand-900 border border-brand-800 px-4 py-2 rounded-sm font-bold text-white outline-none"
                                    >
                                        <option value="USDC">USDC</option>
                                        <option value="USDT">USDT</option>
                                        <option value="EURC">EURC</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <div className="flex justify-between items-center p-4 bg-brand-50 border border-brand-100 rounded-sm">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs font-bold text-brand-900 uppercase">Liquidity Verified</p>
                                            <p className="text-[10px] text-brand-500 font-mono">Routing via Circle Mint (API_V4)</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono font-bold text-brand-900">FREE</p>
                                        <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">Network Fee</p>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBridge}
                                    disabled={!walletAddress || !amount || isBridging}
                                    className="w-full py-5 bg-action-500 text-white rounded-sm font-bold uppercase tracking-[0.2em] text-sm hover:bg-action-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {!walletAddress ? 'Connect Wallet to Proceed' : <><Zap className="w-4 h-4 fill-current" /> Initialize Settlement</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bridge Intelligence Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Globe className="w-32 h-32" /></div>
                        <h3 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 fill-current" /> Route Optimizer
                        </h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="p-4 bg-brand-900/50 border border-brand-800 rounded-sm">
                                <p className="text-[10px] text-brand-500 uppercase font-bold mb-2">Oracle Analysis</p>
                                <p className="text-xs text-brand-300 leading-relaxed font-mono">
                                    {routeAnalysis || "Waiting for transaction volume..."}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-brand-500 uppercase font-bold tracking-widest">Network Health</p>
                                <div className="flex items-center justify-between text-xs font-mono border-b border-brand-900 pb-2">
                                    <span className="text-brand-400">Base Sequencer</span>
                                    <span className="text-emerald-400 font-bold">OPERATIONAL</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-mono border-b border-brand-900 pb-2">
                                    <span className="text-brand-400">Polygon Gas</span>
                                    <span className="text-emerald-400 font-bold">32 Gwei</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-brand-400">Settlement Velocity</span>
                                    <span className="text-white font-bold">{"<"} 2 Minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
                        <h4 className="text-[10px] font-bold text-brand-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Database className="w-3.5 h-3.5" /> Recent Bridge Events
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs p-2 hover:bg-brand-50 rounded-sm transition-colors cursor-pointer border-l-2 border-emerald-500">
                                <div>
                                    <p className="font-bold text-brand-900">NGN → USDC (Base)</p>
                                    <p className="text-[9px] text-brand-400 font-mono">2h ago • Success</p>
                                </div>
                                <span className="font-mono text-brand-900 font-bold">$1,240.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs p-2 hover:bg-brand-50 rounded-sm transition-colors cursor-pointer border-l-2 border-emerald-500 opacity-70">
                                <div>
                                    <p className="font-bold text-brand-900">USD → USDC (Polygon)</p>
                                    <p className="text-[9px] text-brand-400 font-mono">1d ago • Success</p>
                                </div>
                                <span className="font-mono text-brand-900 font-bold">$45,000.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-amber-900 uppercase">Compliance Threshold</h4>
                            <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                                Settlements exceeding $10k equivalent trigger a T+1 AML review. Ensure your KYC level matches your volume.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {isSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm" onClick={() => setIsSuccess(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden p-10 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-900 mb-2 uppercase tracking-tighter">Settlement Dispatched</h3>
                        <p className="text-brand-500 mb-8 font-mono text-xs leading-relaxed">
                            Transaction has been broadcast to the {toChain} network. Your vault will update automatically upon on-chain finality.
                        </p>
                        
                        <div className="bg-brand-50 p-4 rounded-sm border border-brand-200 mb-8 space-y-2 text-left">
                            <div className="flex justify-between items-center text-[10px] font-mono text-brand-400">
                                <span>TX_HASH</span>
                                <span className="text-action-500 font-bold flex items-center gap-1 cursor-pointer hover:underline">0x82...3f1a <ExternalLink className="w-2.5 h-2.5" /></span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono text-brand-400">
                                <span>DESTINATION</span>
                                <span>{walletAddress}</span>
                            </div>
                        </div>

                        <button onClick={() => setIsSuccess(false)} className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-xs tracking-widest rounded-sm shadow-xl hover:bg-black transition-all">Return to Treasury</button>
                    </div>
                </div>
            )}
        </div>
    );
};
