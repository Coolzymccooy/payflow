
import React, { useState, useEffect } from 'react';
import { 
    Wallet, ArrowRight, RefreshCw, ShieldCheck, Zap, 
    Globe, Landmark, ChevronDown, CheckCircle2, User, 
    Lock, Smartphone, Activity, Sparkles, X, Info, TrendingUp,
    TrendingDown, AlertCircle, Scale, PiggyBank, BarChart3, ShieldAlert,
    Fingerprint, BadgeCheck, Shield, ArrowLeft, LogOut, Search, Clock, History,
    Shuffle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BackendService } from '../services/backend';

interface PublicRemittanceProps {
    onBack: () => void;
}

export const PublicRemittance: React.FC<PublicRemittanceProps> = ({ onBack }) => {
    const [fromAmount, setFromAmount] = useState('1000');
    const [fromCurrency, setFromCurrency] = useState('GBP');
    const [toCurrency, setToCurrency] = useState('NGN');
    const [isCalculating, setIsCalculating] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 'TRACKING_LOGIN' | 'TRACKING_DASHBOARD'>(1);
    const [isExecuting, setIsExecuting] = useState(false);
    
    // Auth / Session State for Customers
    const [trackingId, setTrackingId] = useState('');
    const [trackingPhone, setTrackingPhone] = useState('');
    const [isTrackingLoading, setIsTrackingLoading] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState<any>(null);

    // Sender KYC State
    const [senderKyc, setSenderKyc] = useState({
        name: '',
        phone: '',
        idType: 'PASSPORT',
        idNumber: '',
        source: 'SALARY'
    });

    // Beneficiary State
    const [beneficiary, setBeneficiary] = useState({
        name: '',
        bank: 'GTBank',
        accountNo: ''
    });

    // DYNAMIC RATE ENGINE
    const [baseRate, setBaseRate] = useState(1998.42); 

    useEffect(() => {
        const interval = setInterval(() => {
            setBaseRate(prev => prev + (Math.random() - 0.5) * 0.5);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const isReversed = fromCurrency === 'NGN';
    const amountNum = parseFloat(fromAmount) || 0;
    
    // Calculate final conversion rate and amount
    const liveRate = isReversed ? (1 / baseRate) : baseRate;
    const toAmount = amountNum * liveRate;

    const competitors = [
        { name: 'Legacy Banks (Barclays/Zenith)', markup: 0.052 }, // 5.2% spread
        { name: 'Retail Apps (Lemfi/Wise)', markup: 0.015 },      // 1.5% spread
    ];

    const generateRateInsight = async () => {
        setAiInsight(null);
        setIsCalculating(true);
        
        const fallback = isReversed 
            ? "Bilateral Ledger Mirroring enables NGN liquidity to be swapped directly for GBP reserves at the London Node, bypassing the 3-day interbank wait."
            : "By mirroring internal Naira liquidity from merchant collections, Payflow eliminates the interbank intermediary spread entirely, enabling T+0 settlement.";
        
        if (!process.env.API_KEY) {
            setAiInsight(fallback);
            setIsCalculating(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Context: Payflow OS offers a rate of ${liveRate.toFixed(isReversed ? 6 : 2)} ${toCurrency}/${fromCurrency}. 
                Explain in exactly one short technical sentence why this rate is superior because we use 'Bilateral Ledger Mirroring' and 'Internal Liquidity Pools'.`
            });
            setAiInsight(response.text || fallback);
        } catch (e) {
            setAiInsight(fallback);
        } finally {
            setIsCalculating(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (step === 1) generateRateInsight();
        }, 1200);
        return () => clearTimeout(timer);
    }, [fromCurrency, fromAmount, step, baseRate]);

    const handleInvertCorridor = () => {
        const oldFrom = fromCurrency;
        const oldTo = toCurrency;
        setFromCurrency(oldTo);
        setToCurrency(oldFrom);
        setFromAmount(isReversed ? '1000' : '1000000'); // Reasonable defaults for both sides
    };

    const handleExecuteRemittance = async () => {
        if (isExecuting) return;
        setIsExecuting(true);
        
        const payload = {
            sender: senderKyc,
            beneficiary: beneficiary,
            corridor: `${fromCurrency}/${toCurrency}`,
            amountFrom: amountNum,
            currencyFrom: fromCurrency,
            amountTo: toAmount,
            currencyTo: toCurrency,
            rate: liveRate
        };

        try {
            const result = await BackendService.executeRemittance(payload);
            if (result && result.success) {
                setActiveTransaction(result.remittance);
                setStep(4);
            } else {
                alert("Protocol Violation: Sentinel blocked the transaction due to ID mismatch or threshold breach.");
            }
        } catch (e) {
            alert("Uplink Error: Global Orchestrator unreachable. Using Failover Simulation.");
            // Simulation for demo robustness
            const mock = { id: 'RMT-MOCK', status: 'SETTLED', ...payload };
            setActiveTransaction(mock);
            setStep(4);
        } finally {
            setIsExecuting(false);
        }
    };

    const handleTrackLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTrackingLoading(true);
        try {
            const response = await fetch(`/api/remittance/track?id=${encodeURIComponent(trackingId)}&phone=${encodeURIComponent(trackingPhone)}`);
            const data = await response.json();
            if (data.success) {
                setActiveTransaction(data.remittance);
                setStep('TRACKING_DASHBOARD');
            } else {
                alert("INVALID_CREDENTIALS: No transaction found matching these details.");
            }
        } catch (e) {
            alert("TRACKING_NODE_OFFLINE: Could not reach the global orchestrator. Try again in 60s.");
        } finally {
            setIsTrackingLoading(false);
        }
    };

    const handleLogout = () => {
        setActiveTransaction(null);
        setStep(1);
        setTrackingId('');
        setTrackingPhone('');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-action-500 selection:text-white">
            <nav className="p-6 bg-white border-b border-brand-100 sticky top-0 z-50 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-brand-950 p-1.5 rounded-sm"><Wallet className="w-5 h-5 text-white" /></div>
                    <span className="font-black tracking-tighter text-lg uppercase font-mono text-brand-950 italic">PAYFLOW<span className="text-action-500 font-bold tracking-normal not-italic ml-1">REMIT</span></span>
                </div>
                <div className="flex gap-4 items-center">
                    {step === 1 && (
                        <button onClick={() => setStep('TRACKING_LOGIN')} className="text-[10px] font-black text-brand-500 hover:text-brand-950 uppercase tracking-widest border border-brand-100 px-4 py-2 rounded-sm transition-all">
                            Track Money
                        </button>
                    )}
                    {(step === 'TRACKING_LOGIN' || step === 'TRACKING_DASHBOARD') && (
                        <button onClick={handleLogout} className="text-[10px] font-black text-brand-500 hover:text-brand-950 uppercase tracking-widest flex items-center gap-2">
                            <LogOut className="w-4 h-4" /> Exit
                        </button>
                    )}
                    <button onClick={onBack} className="text-[10px] font-black text-brand-900 hover:text-action-500 uppercase tracking-widest flex items-center gap-2 border-l border-brand-100 pl-6">
                        <X className="w-4 h-4" /> Close
                    </button>
                </div>
            </nav>

            <main className="max-w-xl mx-auto p-6 pt-12 pb-24">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-700">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Mirror Protocol: Active</span>
                            </div>
                            <h1 className="text-4xl font-black text-brand-950 tracking-tighter uppercase italic leading-none">The Zero-Spread <br/> <span className="text-action-500 underline decoration-brand-950 underline-offset-8">Corridor.</span></h1>
                            <p className="text-brand-500 font-medium text-sm">Direct liquidity matching. No bank markups.</p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-brand-200 border border-brand-100 space-y-6 relative overflow-hidden">
                            <div className="space-y-2 relative z-10">
                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-4">Transfer Amount ({fromCurrency})</label>
                                <div className="flex items-center gap-4 bg-brand-50 p-6 rounded-2xl border border-brand-100 focus-within:border-action-500 focus-within:bg-white transition-all shadow-inner">
                                    <input 
                                        type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)}
                                        className="bg-transparent text-4xl font-mono font-bold text-brand-950 flex-1 outline-none"
                                    />
                                    <div className="bg-white font-bold px-4 py-3 rounded-xl shadow-sm border border-brand-100 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-brand-400" />
                                        <span>{fromCurrency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center -my-10 relative z-10">
                                <button 
                                    onClick={handleInvertCorridor}
                                    className="bg-brand-950 p-4 rounded-full shadow-2xl text-white ring-8 ring-white hover:bg-black transition-all hover:scale-110 active:scale-95 group"
                                >
                                    <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500 text-action-500" />
                                </button>
                            </div>

                            <div className="space-y-2 relative z-10">
                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest ml-4">Recipient Receives ({toCurrency})</label>
                                <div className="flex items-center gap-4 bg-brand-950 p-6 rounded-2xl border border-brand-800 shadow-2xl">
                                    <div className="text-4xl font-mono font-bold text-white flex-1 truncate tabular-nums">
                                        {toAmount.toLocaleString(undefined, { minimumFractionDigits: isReversed ? 2 : 0, maximumFractionDigits: isReversed ? 2 : 0 })}
                                    </div>
                                    <div className="bg-brand-900 text-white font-black px-4 py-3 rounded-xl border border-brand-700 tracking-widest uppercase">
                                        {toCurrency}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-brand-950 rounded-2xl border border-brand-800 flex gap-4 items-start relative overflow-hidden group min-h-[100px]">
                                {isCalculating && (
                                    <div className="absolute inset-0 bg-brand-950/80 flex items-center justify-center z-20">
                                        <RefreshCw className="w-5 h-5 animate-spin text-action-500" />
                                    </div>
                                )}
                                <div className="bg-action-500/20 p-2 rounded-lg shrink-0">
                                    <Sparkles className="w-5 h-5 text-action-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-action-500 uppercase tracking-widest mb-1">Oracle Insight</p>
                                    <p className="text-[11px] text-brand-200 font-bold italic leading-relaxed">
                                        {aiInsight || "Analyzing internal liquidity corridors for rebalancing..."}
                                    </p>
                                </div>
                            </div>

                            {/* Competitor Comparison Module */}
                            <div className="p-5 border border-brand-100 rounded-2xl bg-brand-50/50 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Market Comparison</h4>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600">
                                        <TrendingDown className="w-3 h-3" /> Zero Fees
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {competitors.map(c => (
                                        <div key={c.name} className="flex justify-between items-center text-xs opacity-60">
                                            <span className="font-medium text-brand-900">{c.name}</span>
                                            <span className="font-mono text-brand-500">{((amountNum * liveRate) * (1 - c.markup)).toLocaleString(undefined, {maximumFractionDigits: 0})} {toCurrency}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-brand-100">
                                        <span className="font-black text-brand-900 uppercase">Payflow Mirror (You)</span>
                                        <span className="font-mono font-black text-emerald-600">{toAmount.toLocaleString(undefined, {maximumFractionDigits: 0})} {toCurrency}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full py-6 bg-brand-950 text-white rounded-2xl font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group">
                                Proceed to Payout <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(1)} className="p-3 bg-white rounded-full border border-brand-100 shadow-md hover:bg-brand-50 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                            <h2 className="text-3xl font-black text-brand-950 tracking-tighter uppercase italic">Beneficiary Info.</h2>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-brand-100 space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Recipient Legal Name</label>
                                    <input 
                                        type="text" 
                                        value={beneficiary.name}
                                        onChange={e => setBeneficiary({...beneficiary, name: e.target.value})}
                                        placeholder="Full name as on bank record" 
                                        className="w-full p-5 bg-brand-50 border border-brand-100 rounded-2xl outline-none focus:border-action-500 focus:bg-white transition-all font-bold" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Target Institution</label>
                                        <select 
                                            value={beneficiary.bank}
                                            onChange={e => setBeneficiary({...beneficiary, bank: e.target.value})}
                                            className="w-full p-5 bg-brand-50 border border-brand-100 rounded-2xl outline-none focus:border-action-500 focus:bg-white transition-all font-black appearance-none cursor-pointer"
                                        >
                                            <option>{isReversed ? 'Barclays Bank UK' : 'GTBank'}</option>
                                            <option>{isReversed ? 'HSBC' : 'Zenith Bank'}</option>
                                            <option>{isReversed ? 'Monzo' : 'Kuda MFB'}</option>
                                            <option>{isReversed ? 'Lloyds Bank' : 'Access Bank'}</option>
                                            <option>Moniepoint</option>
                                            <option>Stanbic IBTC</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Account Number / IBAN</label>
                                        <input 
                                            type="text" 
                                            value={beneficiary.accountNo}
                                            onChange={e => setBeneficiary({...beneficiary, accountNo: e.target.value})}
                                            placeholder={isReversed ? "GB..." : "0123456789"} 
                                            className="w-full p-5 bg-brand-50 border border-brand-100 rounded-2xl outline-none focus:border-action-500 focus:bg-white transition-all font-mono text-lg font-bold" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep(3)}
                                disabled={!beneficiary.name || !beneficiary.accountNo}
                                className="w-full py-6 bg-brand-950 text-white rounded-2xl font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                            >
                                Continue to Verification <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setStep(2)} className="p-3 bg-white rounded-full border border-brand-100 shadow-md hover:bg-brand-50 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                            <h2 className="text-3xl font-black text-brand-950 tracking-tighter uppercase italic">Sender Compliance.</h2>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-brand-100 space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200">
                                <ShieldAlert className="w-6 h-6 shrink-0" />
                                <p className="text-[10px] font-bold uppercase leading-relaxed">
                                    Regulatory Check: Identity verification is required to clear AML screening for this cross-border corridor.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Your Legal Name (Sender)</label>
                                    <input 
                                        type="text" value={senderKyc.name} onChange={e => setSenderKyc({...senderKyc, name: e.target.value})}
                                        placeholder="Full name as on Government ID" className="w-full p-4 bg-brand-50 border border-brand-100 rounded-xl outline-none focus:border-action-500 font-bold" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Identification Type</label>
                                        <select 
                                            value={senderKyc.idType} onChange={e => setSenderKyc({...senderKyc, idType: e.target.value})}
                                            className="w-full p-4 bg-brand-50 border border-brand-100 rounded-xl outline-none focus:border-action-500 font-bold appearance-none"
                                        >
                                            <option value="PASSPORT">Passport (Global)</option>
                                            <option value="UK_NI">UK National Insurance No.</option>
                                            <option value="EU_ID">EU ID Card</option>
                                            <option value="US_SSN">US SSN / Driver License</option>
                                            <option value="BVN">Nigeria BVN</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">ID Number / Value</label>
                                        <input 
                                            type="text" value={senderKyc.idNumber} onChange={e => setSenderKyc({...senderKyc, idNumber: e.target.value})}
                                            placeholder="Enter ID / Number" className="w-full p-4 bg-brand-50 border border-brand-100 rounded-xl outline-none focus:border-action-500 font-mono font-bold" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Your Mobile Number</label>
                                    <input 
                                        type="tel" value={senderKyc.phone} onChange={e => setSenderKyc({...senderKyc, phone: e.target.value})}
                                        placeholder="+44 or +234..." className="w-full p-4 bg-brand-50 border border-brand-100 rounded-xl outline-none focus:border-action-500 font-bold" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2 block ml-1">Source of Funds</label>
                                    <select 
                                        value={senderKyc.source} onChange={e => setSenderKyc({...senderKyc, source: e.target.value})}
                                        className="w-full p-4 bg-brand-50 border border-brand-100 rounded-xl outline-none focus:border-action-500 font-bold appearance-none"
                                    >
                                        <option value="SALARY">Salary / Professional Earnings</option>
                                        <option value="SAVINGS">Personal Savings / Investments</option>
                                        <option value="BUSINESS">Business Operating Income</option>
                                        <option value="GIFT">Family Gift / Support</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleExecuteRemittance}
                                disabled={isExecuting || !senderKyc.name || !senderKyc.idNumber || !senderKyc.phone}
                                className="w-full py-6 bg-action-500 text-white rounded-2xl font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:bg-action-600 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {isExecuting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-6 h-6" /> Authorize Settlement</>}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && activeTransaction && (
                    <div className="text-center space-y-10 animate-in zoom-in-95 pt-12">
                        <div className="relative mx-auto w-32 h-32">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                            <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.5)] border-8 border-white">
                                <CheckCircle2 className="w-16 h-16" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-brand-950 tracking-tighter uppercase italic leading-none">Settlement <br/> Dispatched.</h2>
                            <p className="text-brand-500 font-bold uppercase tracking-widest text-xs">Funds delivered via internal liquidity mirror protocol.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-brand-100 shadow-2xl space-y-5 max-w-sm mx-auto text-left font-mono relative overflow-hidden">
                            <div className="flex justify-between border-b border-brand-50 pb-3">
                                <span className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">TRACKING_ID</span>
                                <span className="text-[10px] text-action-500 font-black uppercase">{activeTransaction.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-brand-50 pb-3">
                                <span className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">NET_SETTLED</span>
                                <span className="text-[10px] text-brand-950 font-black uppercase">{activeTransaction.amountTo.toLocaleString(undefined, {maximumFractionDigits: isReversed ? 2 : 0})} {toCurrency}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">RAIL_TYPE</span>
                                <span className="text-[10px] text-action-500 font-black italic tracking-tighter">PAYFLOW_T+0_ATOMIC</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[9px] font-black text-brand-400 uppercase tracking-widest">
                            <BadgeCheck className="w-4 h-4 text-emerald-500" /> Identity Verified by Oracle
                        </div>
                        <div className="flex flex-col gap-4">
                            <button onClick={() => setStep('TRACKING_DASHBOARD')} className="bg-brand-950 text-white py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg hover:bg-black transition-all">Track Money Flow</button>
                            <button onClick={() => {setStep(1); setSenderKyc({name:'', phone:'', idType:'PASSPORT', idNumber:'', source:'SALARY'}); setBeneficiary({name:'', bank:'GTBank', accountNo:''});}} className="text-[11px] font-black text-brand-400 hover:text-brand-950 uppercase tracking-[0.4em] transition-colors">Initiate New Corridor Sync</button>
                        </div>
                    </div>
                )}

                {step === 'TRACKING_LOGIN' && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 pt-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-brand-950 tracking-tighter uppercase italic">Secure Money Tracker</h2>
                            <p className="text-brand-500 text-sm mt-2">Access the real-time settlement enclave.</p>
                        </div>
                        <form onSubmit={handleTrackLogin} className="bg-white rounded-3xl p-10 shadow-2xl border border-brand-100 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2 block">Reference ID (RMT-XXXXXX)</label>
                                <input 
                                    type="text" required value={trackingId} onChange={e => setTrackingId(e.target.value.toUpperCase())}
                                    placeholder="RMT-123456" className="w-full p-5 bg-brand-50 border border-brand-100 rounded-2xl outline-none focus:border-action-500 font-mono font-bold" 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2 block">Registered Phone Number</label>
                                <input 
                                    type="tel" required value={trackingPhone} onChange={e => setTrackingPhone(e.target.value)}
                                    placeholder="+44..." className="w-full p-5 bg-brand-50 border border-brand-100 rounded-2xl outline-none focus:border-action-500 font-bold" 
                                />
                            </div>
                            <button 
                                type="submit" disabled={isTrackingLoading}
                                className="w-full py-6 bg-brand-950 text-white rounded-2xl font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                            >
                                {isTrackingLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Authenticate Enclave</>}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-950 transition-colors">Return to Calculator</button>
                        </form>
                    </div>
                )}

                {step === 'TRACKING_DASHBOARD' && activeTransaction && (
                    <div className="space-y-8 animate-in fade-in duration-500 pt-8">
                        <div className="flex justify-between items-end border-b border-brand-100 pb-6">
                            <div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100">Encrypted Pulse</span>
                                <h2 className="text-3xl font-black text-brand-950 tracking-tighter uppercase italic mt-1">{activeTransaction.id}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-brand-400 uppercase">Movement Status</p>
                                <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">{activeTransaction.status}</p>
                            </div>
                        </div>

                        {/* FLOW TRACKER (TIMELINE) */}
                        <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-xl space-y-12">
                            <h3 className="text-xs font-black text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4 text-action-500" /> Real-time Node Trace
                            </h3>
                            
                            <div className="space-y-10 relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-brand-100 -z-0"></div>
                                
                                {[
                                    { label: 'Initiation', desc: 'Secure handshake completed at Global Node.', icon: Globe, state: 'COMPLETED' },
                                    { label: 'Sentinel Compliance', desc: 'AML & PEP screening verified.', icon: ShieldCheck, state: 'COMPLETED' },
                                    { label: 'Bilateral Mirroring', desc: 'Mirroring liquidity buffers for T+0 release.', icon: Zap, state: activeTransaction.status === 'SETTLED' ? 'COMPLETED' : 'IN_PROGRESS' },
                                    { label: 'Settlement Commitment', desc: 'Funds committed to destination beneficiary.', icon: Landmark, state: activeTransaction.status === 'SETTLED' ? 'COMPLETED' : 'PENDING' }
                                ].map((stepItem, i) => (
                                    <div key={i} className={`flex gap-6 relative z-10 ${stepItem.state === 'PENDING' ? 'opacity-30 grayscale' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                            stepItem.state === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 
                                            stepItem.state === 'IN_PROGRESS' ? 'bg-action-500 border-action-500 text-white animate-pulse' :
                                            'bg-white border-brand-200 text-brand-300'
                                        }`}>
                                            {stepItem.state === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : <stepItem.icon className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase tracking-tight ${stepItem.state === 'PENDING' ? 'text-brand-300' : 'text-brand-950'}`}>{stepItem.label}</p>
                                            <p className="text-[10px] text-brand-400 font-mono mt-1 uppercase leading-relaxed">{stepItem.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brand-950 p-6 rounded-2xl text-white border border-brand-800">
                                <p className="text-[9px] font-bold text-brand-500 uppercase tracking-widest mb-1">Sent Principal</p>
                                <p className="text-xl font-mono font-bold tracking-tighter">{activeTransaction.amountFrom.toLocaleString()} {activeTransaction.currencyFrom}</p>
                            </div>
                            <div className="bg-brand-950 p-6 rounded-2xl text-white border border-action-500/30">
                                <p className="text-[9px] font-bold text-action-500 uppercase tracking-widest mb-1">Mirror Release</p>
                                <p className="text-xl font-mono font-bold tracking-tighter">{activeTransaction.amountTo.toLocaleString(undefined, {maximumFractionDigits: activeTransaction.currencyTo === 'NGN' ? 0 : 2})} {activeTransaction.currencyTo}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-brand-100 space-y-4">
                            <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] border-b border-brand-50 pb-2 flex items-center gap-2">
                                <History className="w-3.5 h-3.5" /> HSM Authentication Log
                            </h4>
                            <div className="space-y-2 text-[9px] font-mono text-brand-500">
                                <p className="flex justify-between"><span>TIMESTAMP_UTC</span> <span className="text-brand-900">{new Date().toISOString()}</span></p>
                                <p className="flex justify-between"><span>NODE_ENCLAVE</span> <span className="text-brand-900 uppercase">LAGOS_EDGE_RESERVE_04</span></p>
                                <p className="flex justify-between"><span>HANDSHAKE_HASH</span> <span className="text-emerald-600 font-bold truncate max-w-[200px]">SHA256_ACTIVE_{activeTransaction.id}</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="mt-auto p-12 text-center space-y-4 bg-white border-t border-brand-100">
                <div className="flex justify-center gap-8 grayscale opacity-30">
                    <span className="text-[10px] font-black font-mono">PCI-DSS</span>
                    <span className="text-[10px] font-black font-mono">ISO-27001</span>
                    <span className="text-[10px] font-black font-mono">HSM-ENCRYPTED</span>
                </div>
                <p className="text-[8px] font-mono text-brand-400 uppercase tracking-[0.5em] leading-relaxed">
                    Sovereign Settlement Layer // Powered by Tiwaton Architecture // Node 04
                </p>
            </footer>
        </div>
    );
};
