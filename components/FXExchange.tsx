
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { 
  RefreshCw, ArrowRightLeft, Send, Globe, Wallet, ArrowDown, ShieldCheck, 
  Zap, ChevronDown, CheckCircle2, Activity, Network, ArrowUpRight, 
  AlertCircle, Coins, Landmark, User, FileText, Loader2, Search, X, 
  Link as LinkIcon, Database, Braces, ShieldAlert
} from 'lucide-react';
import { FXProtocol } from '../types';
//jss
export const FXExchange: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'SWAP' | 'SEND'>('SWAP');
    const [protocol, setProtocol] = useState<FXProtocol>('PAYFLOW_MESH');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('NGN');
    const [amount, setAmount] = useState('5000');
    const [isExecuting, setIsExecuting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [settlementStep, setSettlementStep] = useState(0);

    // Protocol Specific Inputs
    const [swiftCode, setSwiftCode] = useState('');
    const [iban, setIban] = useState('');
    const [cryptoWallet, setCryptoWallet] = useState('');
    const [recipientName, setRecipientName] = useState('');

    // Live Telemetry State
    const [networkStats, setNetworkStats] = useState([
        { name: 'Lagos Mesh Hub', latency: 14, status: 'OPTIMAL' },
        { name: 'Swift Gateway', latency: 242, status: 'DEGRADED' },
        { name: 'Circle Rail', latency: 8, status: 'OPTIMAL' }
    ]);

    // Live rates
    const [liveRates, setLiveRates] = useState<Record<string, number>>({
        'USD_NGN': 1485.50,
        'GBP_NGN': 1892.40,
        'EUR_NGN': 1612.10,
        'NGN_USD': 0.00067,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveRates(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(k => {
                    next[k] = next[k] + (Math.random() - 0.5) * 0.15;
                });
                return next;
            });
            setNetworkStats(prev => prev.map(s => ({
                ...s,
                latency: Math.max(2, s.latency + Math.floor((Math.random() - 0.5) * 6))
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentRate = liveRates[`${fromCurrency}_${toCurrency}`] || 1;
    const resultValue = (parseFloat(amount) || 0) * currentRate;

    const getSettlementSteps = () => {
        switch(protocol) {
            case 'PAYFLOW_MESH':
                return [
                    "Authorizing Peer-to-Peer Handshake...",
                    "Mirroring Internal Liquidity Pool...",
                    "Committing Atomic Ledger Entry...",
                    "Settlement Finalized Locally."
                ];
            case 'STABLE_BRIDGE':
                return [
                    "Initiating Smart Contract Call...",
                    "Verifying On-Chain Liquidity...",
                    "Broadcasting to Network Mempool...",
                    "Transaction Confirmed on Layer-2."
                ];
            case 'BANK_SWIFT':
                return [
                    "Encoding ISO-20022 Message...",
                    "Validating Corresponding Rail...",
                    "Initiating Multi-Hop Routing...",
                    "Settlement Dispatched (Pending Bank)."
                ];
            default: return ["Processing..."];
        }
    };

    const handleExecute = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        
        // Basic validation for SEND mode
        if (activeMode === 'SEND') {
            if (protocol === 'BANK_SWIFT' && (!swiftCode || !iban)) {
                alert("Swift/IBAN required for Bank transfers.");
                return;
            }
            if (protocol === 'STABLE_BRIDGE' && !cryptoWallet) {
                alert("Destination Wallet Address required.");
                return;
            }
        }

        setIsExecuting(true);
        setSettlementStep(1);
        
        const steps = getSettlementSteps();
        let current = 1;
        
        const timer = setInterval(() => {
            current++;
            setSettlementStep(current);
            if (current > steps.length) {
                clearInterval(timer);
                setIsExecuting(false);
                setShowSuccess(true);
            }
        }, protocol === 'PAYFLOW_MESH' ? 800 : 1500); // Mesh is faster
    };

    const getEstimatedArrival = () => {
        if (protocol === 'PAYFLOW_MESH') return 'INSTANT';
        if (protocol === 'STABLE_BRIDGE') return '< 2 MINUTES';
        return '1 - 3 BUSINESS DAYS';
    };

    const getFee = () => {
        if (protocol === 'PAYFLOW_MESH') return '0.00';
        if (protocol === 'STABLE_BRIDGE') return '2.50';
        return '45.00';
    };

    const isButtonDisabled = isExecuting || !amount || parseFloat(amount) <= 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader 
                title="Global Liquidity Exchange" 
                subtitle="Differentiated high-performance rails for instant and traditional settlement."
                breadcrumbs={['Workspace', 'Treasury', 'FX Terminal']}
                status="LIVE"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Live Intelligence */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-950 text-white rounded-sm p-6 border border-brand-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Globe className="w-48 h-48" /></div>
                        <h3 className="text-xs font-bold text-action-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Real-time Corridor Pulse
                        </h3>
                        
                        <div className="space-y-4 relative z-10 font-mono">
                            {['GBP/NGN', 'USD/NGN', 'EUR/NGN'].map((pair) => {
                                const val = liveRates[pair.replace('/', '_')];
                                return (
                                    <div key={pair} className="p-4 bg-brand-900/40 border border-brand-800 rounded-sm group flex justify-between items-center hover:border-brand-600 transition-all">
                                        <div>
                                            <p className="text-[10px] text-brand-500 font-bold uppercase">{pair}</p>
                                            <p className="text-xl font-bold text-white tracking-tighter tabular-nums">
                                                {val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                                                <ArrowUpRight className="w-3 h-3" /> +{(Math.random() * 0.05).toFixed(3)}%
                                            </div>
                                            <p className="text-[8px] text-brand-600 mt-1 uppercase">ORACLE_VERIFIED</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-brand-800">
                             <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-sm flex gap-3 items-start">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">HSM ENCLAVE STATUS</p>
                                    <p className="text-[11px] text-brand-300 leading-relaxed font-mono">
                                        "Encrypted handshake available for 24 protocols. High liquidity detected in NGN buffers."
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Network className="w-3 h-3 text-brand-400" /> Mesh Latency Graph
                        </h4>
                        <div className="space-y-4">
                            {networkStats.map(stat => (
                                <div key={stat.name} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                                        <span className="text-brand-500 uppercase">{stat.name}</span>
                                        <span className={stat.status === 'OPTIMAL' ? 'text-emerald-600' : 'text-amber-600'}>{stat.latency}ms</span>
                                    </div>
                                    <div className="h-1 w-full bg-brand-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-700 ${stat.status === 'OPTIMAL' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                            style={{ width: `${Math.min(100, (stat.latency / 300) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Exchange Desk */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-xl flex flex-col min-h-[700px]">
                        {/* Terminal Tab Switcher */}
                        <div className="bg-brand-950 p-4 flex justify-between items-center border-b border-brand-800">
                            <div className="flex gap-1 bg-black p-1 rounded-sm">
                                <button 
                                    onClick={() => setActiveMode('SWAP')}
                                    className={`px-8 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'SWAP' ? 'bg-brand-800 text-white shadow-inner' : 'text-brand-500 hover:text-white'}`}
                                >
                                    Internal Rebalance
                                </button>
                                <button 
                                    onClick={() => setActiveMode('SEND')}
                                    className={`px-8 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${activeMode === 'SEND' ? 'bg-brand-800 text-white shadow-inner' : 'text-brand-500 hover:text-white'}`}
                                >
                                    Global Disbursement
                                </button>
                            </div>
                            <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-brand-500">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> READY</div>
                                <div className="w-px h-3 bg-brand-800"></div>
                                <span>TERMINAL: LND_04</span>
                            </div>
                        </div>

                        <div className="p-8 flex-1 space-y-8">
                            {/* Rail Selector */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'PAYFLOW_MESH', label: 'Payflow Mesh', icon: Zap, color: 'text-action-500', note: 'Instant / Internal' },
                                    { id: 'STABLE_BRIDGE', label: 'Token Rail', icon: Coins, color: 'text-blue-500', note: 'Web3 / L2 Base' },
                                    { id: 'BANK_SWIFT', label: 'Swift / Bank', icon: Landmark, color: 'text-brand-400', note: 'Global Fiat / T+1' },
                                ].map((p) => (
                                    <button 
                                        key={p.id}
                                        onClick={() => setProtocol(p.id as FXProtocol)}
                                        className={`p-5 border rounded-sm text-left transition-all relative group ${protocol === p.id ? 'border-brand-900 bg-brand-50 shadow-md ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-300 opacity-60'}`}
                                    >
                                        <p.icon className={`w-6 h-6 mb-3 ${p.color}`} />
                                        <p className="text-xs font-bold uppercase text-brand-900">{p.label}</p>
                                        <p className="text-[9px] font-mono text-brand-400 mt-1 uppercase tracking-tighter">{p.note}</p>
                                        {protocol === p.id && <div className="absolute top-3 right-3"><CheckCircle2 className="w-5 h-5 text-brand-900" /></div>}
                                    </button>
                                ))}
                            </div>

                            {/* Detailed Inputs based on Rail */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    <div className="md:col-span-12 p-6 bg-brand-50 border border-brand-200 rounded-sm group relative">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-2"><Wallet className="w-3 h-3" /> Settlement Value</label>
                                            <span className="text-[10px] font-mono text-brand-400">HSM_AUTH: ACTIVE</span>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <input 
                                                type="number" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="flex-1 bg-transparent text-5xl font-mono font-bold text-brand-900 outline-none" 
                                                placeholder="0.00"
                                            />
                                            <div className="flex items-center gap-3 bg-brand-950 text-white rounded-sm px-5 py-3 shrink-0 shadow-lg">
                                                <select 
                                                    value={fromCurrency}
                                                    onChange={(e) => setFromCurrency(e.target.value)}
                                                    className="bg-transparent text-white border-none outline-none font-mono font-bold text-base cursor-pointer"
                                                >
                                                    <option value="USD" className="bg-brand-900">USD</option>
                                                    <option value="GBP" className="bg-brand-900">GBP</option>
                                                    <option value="EUR" className="bg-brand-900">EUR</option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-brand-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center -my-10 relative z-10">
                                    <div className="bg-white border-2 border-brand-100 p-2 rounded-full">
                                        <div className="bg-brand-950 p-4 rounded-full shadow-2xl text-action-500 hover:rotate-180 transition-transform cursor-pointer group">
                                            <ArrowDown className="w-6 h-6 group-hover:scale-110 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-brand-950 text-white rounded-sm border border-brand-800 transition-all hover:border-action-500/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
                                            {activeMode === 'SWAP' ? 'Target Treasury Vault' : 'External Recipient Rail'}
                                        </label>
                                        <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                                            <ShieldCheck className="w-3.5 h-3.5" /> SECURE_ORACLE_RATE
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 text-5xl font-mono font-bold text-white tabular-nums">
                                            {resultValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="flex items-center gap-3 bg-action-500 text-white rounded-sm px-5 py-3 shrink-0 shadow-lg">
                                            <select 
                                                value={toCurrency}
                                                onChange={(e) => setToCurrency(e.target.value)}
                                                className="bg-transparent text-white border-none outline-none font-mono font-bold text-base cursor-pointer"
                                            >
                                                <option value="NGN" className="bg-action-600">NGN</option>
                                                <option value="USD" className="bg-action-600">USD</option>
                                                <option value="GBP" className="bg-action-600">GBP</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-white/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rail Specific Dynamic Inputs */}
                            {activeMode === 'SEND' && (
                                <div className="animate-in slide-in-from-bottom-4 duration-300 p-8 border border-brand-100 bg-brand-50 rounded-sm space-y-6">
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest border-b border-brand-200 pb-3 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Settlement Instructions
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-brand-500 uppercase">Beneficiary Identity</label>
                                            <input 
                                                type="text" 
                                                placeholder="Recipient Full Name"
                                                className="w-full px-4 py-2.5 border border-brand-200 rounded-sm text-sm focus:ring-1 focus:ring-action-500 outline-none"
                                                value={recipientName}
                                                onChange={e => setRecipientName(e.target.value)}
                                            />
                                        </div>
                                        
                                        {protocol === 'BANK_SWIFT' && (
                                            <>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-brand-500 uppercase">SWIFT / BIC Code</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="e.g. GTBINGLA"
                                                        className="w-full px-4 py-2.5 border border-brand-200 rounded-sm text-sm font-mono focus:ring-1 focus:ring-action-500 outline-none uppercase"
                                                        value={swiftCode}
                                                        onChange={e => setSwiftCode(e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1.5 md:col-span-2">
                                                    <label className="text-[10px] font-bold text-brand-500 uppercase">IBAN / Account Number</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="NG01 1234 5678 9012"
                                                        className="w-full px-4 py-2.5 border border-brand-200 rounded-sm text-sm font-mono focus:ring-1 focus:ring-action-500 outline-none uppercase"
                                                        value={iban}
                                                        onChange={e => setIban(e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {protocol === 'STABLE_BRIDGE' && (
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[10px] font-bold text-brand-500 uppercase">Destination Wallet Address (BASE / ETH)</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        placeholder="0x..."
                                                        className="w-full px-4 py-2.5 border border-brand-200 rounded-sm text-sm font-mono focus:ring-1 focus:ring-action-500 outline-none"
                                                        value={cryptoWallet}
                                                        onChange={e => setCryptoWallet(e.target.value)}
                                                    />
                                                    <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                                </div>
                                            </div>
                                        )}

                                        {protocol === 'PAYFLOW_MESH' && (
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[10px] font-bold text-brand-500 uppercase">Mesh Peer ID / Tag</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        placeholder="@username or Entity ID"
                                                        className="w-full px-4 py-2.5 border border-brand-200 rounded-sm text-sm font-mono focus:ring-1 focus:ring-action-500 outline-none"
                                                    />
                                                    <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-action-500" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Protocol-Specific Fee & Detail Strip */}
                            <div className="bg-brand-950 p-6 rounded-sm border border-brand-800 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Oracle Rate</p>
                                    <p className="text-sm font-mono font-bold text-white">1 {fromCurrency} = {currentRate.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Protocol Fee</p>
                                    <p className="text-sm font-mono font-bold text-action-500">${getFee()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Settle Speed</p>
                                    <p className="text-sm font-mono font-bold text-emerald-400">{getEstimatedArrival()}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Trust Rating</p>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <span className="text-sm font-mono font-bold text-white">A+</span>
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleExecute}
                                disabled={isButtonDisabled}
                                className="w-full py-6 bg-brand-950 text-white rounded-sm font-bold uppercase tracking-[0.4em] text-xs hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                            >
                                {isExecuting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin text-action-500" />
                                        <span className="animate-pulse">{getSettlementSteps()[settlementStep-1]}</span>
                                    </>
                                ) : (
                                    <><Zap className="w-5 h-5 fill-current text-action-500 group-hover:scale-110 transition-transform" /> Authorize Global Protocol</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-md" onClick={() => setShowSuccess(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-lg rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-900 mb-2 uppercase tracking-tighter">Settlement Authorized</h3>
                            <p className="text-brand-500 text-xs font-mono mb-10 uppercase tracking-widest">ORACLE_REF: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            
                            <div className="space-y-5 text-left mb-10">
                                <div className="p-5 bg-brand-50 border border-brand-200 rounded-sm space-y-4 font-mono text-[11px] text-brand-800">
                                    <div className="flex justify-between border-b border-brand-200 pb-2">
                                        <span className="text-brand-400">NET_VOLUME</span>
                                        <span className="font-bold text-brand-900">{resultValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} {toCurrency}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand-200 pb-2">
                                        <span className="text-brand-400">PROTOCOL_RAIL</span>
                                        <span className="font-bold text-action-600">{protocol}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand-200 pb-2">
                                        <span className="text-brand-400">ARRIVAL_EST</span>
                                        <span className="font-bold text-emerald-600">{getEstimatedArrival()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-brand-400">HSM_AUDIT_HASH</span>
                                        <span className="font-bold">SHA256_ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-left mb-8 flex gap-4">
                                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[10px] font-bold text-amber-900 uppercase">Ledger Notification:</p>
                                    <p className="text-[9px] text-amber-700 mt-1 leading-relaxed font-medium">
                                        The transaction has been committed to the {protocol} settlement tree. 
                                        {protocol === 'BANK_SWIFT' ? ' Confirmation will depend on corresponding bank clearing latency.' : ' Funds are immediately accessible in target vault.'}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowSuccess(false)}
                                className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm shadow-xl hover:bg-black transition-all"
                            >
                                Back to Control Deck
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
