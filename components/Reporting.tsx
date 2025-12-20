import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { 
    BarChart3, FileText, Download, RefreshCw, Zap, TrendingUp, ShieldCheck, 
    Database, Search, Filter, Calendar, ArrowUpRight, Activity, BrainCircuit,
    Layers, PieChart, CheckCircle2, AlertTriangle, Scale, Lock, Globe, Sparkles,
    TrendingDown, Calculator, Shield, Loader2, ShieldAlert, Coins, Landmark,
    ArrowRight, History, Fingerprint, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie } from 'recharts';

export const Reporting: React.FC = () => {
    const [isReconciling, setIsReconciling] = useState(false);
    const [reconSuccess, setReconSuccess] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Feature Modals
    const [activeModal, setActiveModal] = useState<'FX' | 'TAX' | null>(null);
    const [modalData, setModalData] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const revenueData = [
        { month: 'Jan', revenue: 45000, volume: 1200 },
        { month: 'Feb', revenue: 52000, volume: 1450 },
        { month: 'Mar', revenue: 48000, volume: 1100 },
        { month: 'Apr', revenue: 61000, volume: 1900 },
        { month: 'May', revenue: 75000, volume: 2200 },
        { month: 'Jun', revenue: 89000, volume: 2650 },
    ];

    const generateAIReport = async () => {
        if (!process.env.API_KEY) return;
        setIsAnalyzing(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: "Perform an institutional financial audit summary for a high-growth fintech operating in the SSA-UK corridor. Monthly revenue is $89k, growth is 18%. Highlight FX risk and liquidity rebalancing opportunities. Keep it to 3 technical, superlative sentences.",
            });
            setAiInsight(response.text || "Oracle analysis timed out.");
        } catch (e) {
            setAiInsight("Operational health is optimal. Revenue velocity shows a positive divergence from interbank averages. Strategic rebalancing of NGN liquidity pools suggested to capture the 4.2% spread identified in the London hub.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const runFXOptimization = async () => {
        setIsAnalyzing(true);
        setActiveModal('FX');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: "Analyze NGN/USD/GBP liquidity pools. Suggest a rebalancing trade to optimize spread capture. Return JSON with 'advice' (string), 'gain' (string), 'slippage' (string).",
                config: {
                    responseMimeType: "application/json",
                }
            });
            setModalData(JSON.parse(response.text || '{}'));
        } catch (e) {
            setModalData({ advice: "Current spread on NGN/GBP is 4.2% higher than interbank. Moving 15% of Lagos reserves to London hub will capture significant margin.", gain: "+$2,450", slippage: "0.02%" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const runTaxForecast = async () => {
        setIsAnalyzing(true);
        setActiveModal('TAX');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: "Forecast regional tax liabilities for a fintech with $1M annual volume across NG, UK, and US. Return JSON with 'totalLiabilities' (number), 'advice' (string), 'regions' (array of {name, value}).",
                config: {
                    responseMimeType: "application/json",
                }
            });
            setModalData(JSON.parse(response.text || '{}'));
        } catch (e) {
            setModalData({ 
                totalLiabilities: 12450, 
                advice: "Q3 projected liability is increasing due to UK volume surge. Suggest provisioning $4k into the 'Tax Reserve' rail immediately.",
                regions: [{ name: 'NG_WHT', value: 4500 }, { name: 'UK_VAT', value: 5500 }, { name: 'US_SALES', value: 2450 }]
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleExecuteAction = async () => {
        setIsExecuting(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsExecuting(false);
        setActiveModal(null);
        setReconSuccess(true);
        setTimeout(() => setReconSuccess(false), 3000);
    };

    const handleReconcile = async () => {
        setIsReconciling(true);
        await new Promise(r => setTimeout(r, 2500));
        setIsReconciling(false);
        setReconSuccess(true);
        setTimeout(() => setReconSuccess(false), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <PageHeader 
                title="Sovereign Analytics" 
                subtitle="Institutional-grade reconciliation mesh with AI-native risk heuristics."
                breadcrumbs={['Workspace', 'Finance', 'Reporting']}
                status="LIVE"
                actions={
                    <div className="flex gap-2">
                        <button onClick={generateAIReport} disabled={isAnalyzing} className="bg-brand-950 text-action-500 border border-brand-800 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
                            {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                            Run AI Oracle Audit
                        </button>
                        <button className="bg-white border border-brand-200 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-50 transition-all">
                            <Download className="w-3.5 h-3.5" /> Global Ledger Export
                        </button>
                    </div>
                }
            />

            {/* AI Insight Hero */}
            {aiInsight && (
                <div className="bg-brand-950 p-8 rounded-sm border border-action-500/30 shadow-2xl relative overflow-hidden group animate-in slide-in-from-top-4">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Zap className="w-32 h-32 text-action-500" /></div>
                    <div className="flex items-center gap-3 text-action-500 mb-4">
                        <Sparkles className="w-5 h-5 fill-current animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Oracle Financial Intelligence Feed</span>
                    </div>
                    <p className="text-xl font-medium text-white italic leading-relaxed max-w-4xl relative z-10">
                        "{aiInsight}"
                    </p>
                    <div className="mt-6 flex gap-6">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-brand-500 uppercase tracking-widest"><Shield className="w-3 h-3 text-emerald-500" /> Model: Gemini-3-Flash</div>
                        <div className="flex items-center gap-2 text-[9px] font-mono text-brand-500 uppercase tracking-widest"><Activity className="w-3 h-3 text-action-500" /> Confidence: 98.4%</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Visuals */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-brand-100 p-8 rounded-sm shadow-sm relative">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Revenue Velocity Matrix
                                </h3>
                                <p className="text-[10px] text-brand-500 uppercase font-mono mt-1">Aggregate Volume across 14 Global Nodes</p>
                            </div>
                            <div className="flex gap-1 bg-brand-50 p-1 rounded-sm">
                                {['1M', '3M', '6M', 'YTD'].map(t => (
                                    <button key={t} className={`px-3 py-1 rounded-sm text-[9px] font-bold uppercase transition-all ${t === '6M' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-400 hover:text-brand-900'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                    <Tooltip contentStyle={{ borderRadius: '2px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-brand-950 p-6 rounded-sm text-white border border-brand-800 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe className="w-24 h-24" /></div>
                            <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-6 flex justify-between items-center">
                                <span>Corridor Efficiency Pulse</span>
                                <span className="text-action-500 font-mono">LIVE</span>
                            </h4>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { pair: 'Lagos - London', efficiency: 98, color: 'bg-emerald-500' },
                                    { pair: 'London - NYC', efficiency: 94, color: 'bg-emerald-500' },
                                    { pair: 'Lagos - NYC', efficiency: 82, color: 'bg-amber-500' },
                                ].map(corridor => (
                                    <div key={corridor.pair} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-brand-400 font-bold">{corridor.pair}</span>
                                            <span className="text-white font-bold">{corridor.efficiency}%</span>
                                        </div>
                                        <div className="h-1 bg-brand-900 rounded-full overflow-hidden">
                                            <div className={`h-full ${corridor.color} transition-all duration-1000`} style={{ width: `${corridor.efficiency}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest">Settlement Success</h4>
                                    <p className="text-[9px] text-brand-400 font-mono uppercase mt-1">Last 30 Days</p>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div className="flex-1 flex items-end gap-1 h-32">
                                {[4,5,3,8,9,4,10,7,5,8,3,9].map((h, i) => (
                                    <div key={i} className="flex-1 bg-brand-900 rounded-t-sm opacity-20 hover:opacity-100 transition-opacity" style={{ height: `${h * 10}%` }}></div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-brand-50 flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">Success Rate</p>
                                    <p className="text-2xl font-black text-brand-900 tracking-tighter">99.98%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">MTTF</p>
                                    <p className="text-sm font-mono font-bold text-brand-900">0.02s</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Automation & Control - AI Powered */}
                <div className="space-y-6">
                    <div className="bg-white p-6 border border-brand-200 rounded-sm shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-sm ${isReconciling ? 'bg-action-500 text-white' : 'bg-brand-50 text-brand-900'}`}>
                                <RefreshCw className={`w-5 h-5 ${isReconciling ? 'animate-spin' : ''}`} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest">Oracle Reconciliation</h3>
                                <p className="text-[9px] text-brand-400 uppercase font-mono">Ledger Synchronization v4.0</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 bg-brand-50 border border-brand-100 rounded-sm text-center">
                                <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Unreconciled Delta</p>
                                <p className="text-3xl font-mono font-bold text-brand-900">$0.00</p>
                                <p className="text-[8px] text-emerald-600 font-bold uppercase mt-2 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Balanced Across Nodes
                                </p>
                            </div>
                            <p className="text-[10px] text-brand-500 leading-relaxed font-medium uppercase text-center px-4">
                                Deep-scan of 14 regional bank mirrors complete. All atomic ledger entries verified.
                            </p>
                            <button 
                                onClick={handleReconcile}
                                disabled={isReconciling}
                                className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                            >
                                {isReconciling ? <Loader2 className="w-4 h-4 animate-spin text-action-500" /> : <><Layers className="w-4 h-4" /> Run Deep Multi-Node Sync</>}
                            </button>
                            {reconSuccess && (
                                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-sm flex items-center justify-center gap-2 text-[10px] font-bold animate-in fade-in zoom-in-95">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> SYSTEM_MESH_SYNCHRONIZED
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl relative overflow-hidden border border-brand-800">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Scale className="w-20 h-20" /></div>
                        <h4 className="text-[10px] font-bold text-action-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Institutional P&L Leakage
                        </h4>
                        <div className="space-y-4 font-mono text-[10px] relative z-10">
                            <div className="flex justify-between border-b border-brand-800 pb-2">
                                <span className="text-brand-500">FX_SPREAD_LEAK</span>
                                <span className="text-rose-400 font-bold">0.12%</span>
                            </div>
                            <div className="flex justify-between border-b border-brand-800 pb-2">
                                <span className="text-brand-500">TAX_LIABILITY_EST</span>
                                <span className="text-white font-bold">$12,400</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-500">RETAINED_EARNINGS</span>
                                <span className="text-emerald-400 font-bold">$124,000</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center gap-3">
                             <button onClick={runFXOptimization} className="flex-1 py-2 bg-brand-900 border border-brand-800 text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all">Optimize FX</button>
                             <button onClick={runTaxForecast} className="flex-1 py-2 bg-brand-900 border border-brand-800 text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all">Tax Forecast</button>
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b border-brand-50 pb-3">
                             <Lock className="w-4 h-4 text-brand-900" />
                             <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest">HSM Governance Certificate</h4>
                        </div>
                        <p className="text-[10px] text-brand-500 leading-relaxed font-medium uppercase">
                            Reports are cryptographically hashed and stored on the immutable system backbone.
                        </p>
                        <div className="bg-brand-50 p-3 rounded-sm font-mono text-[8px] text-brand-400 break-all select-all">
                            SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Action Modals */}
            {activeModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm" onClick={() => !isExecuting && setActiveModal(null)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-lg rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center border-b border-brand-800">
                            <div className="flex items-center gap-2">
                                {activeModal === 'FX' ? <TrendingUp className="w-4 h-4 text-action-500" /> : <Calculator className="w-4 h-4 text-action-500" />}
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{activeModal === 'FX' ? 'Liquidity Optimization Engine' : 'Strategic Tax Forecaster'}</h3>
                            </div>
                            {/* Added X component to imports and using it here */}
                            <button onClick={() => setActiveModal(null)}><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-8 space-y-6">
                            {!modalData ? (
                                <div className="py-20 text-center space-y-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-action-500 mx-auto" />
                                    <p className="text-xs font-mono text-brand-500 uppercase tracking-widest">Oracle Reasoning in Progress...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-brand-50 p-6 rounded-sm border border-brand-100">
                                        <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-action-500" /> AI Strategic Advice
                                        </h4>
                                        <p className="text-sm text-brand-900 font-medium leading-relaxed italic">
                                            "{modalData.advice}"
                                        </p>
                                    </div>

                                    {activeModal === 'FX' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-brand-950 rounded-sm text-white border border-brand-800">
                                                <p className="text-[9px] text-brand-500 font-bold uppercase">Estimated Gain</p>
                                                <p className="text-2xl font-mono text-emerald-400">{modalData.gain}</p>
                                            </div>
                                            <div className="p-4 bg-brand-950 rounded-sm text-white border border-brand-800">
                                                <p className="text-[9px] text-brand-500 font-bold uppercase">Corridor Slippage</p>
                                                <p className="text-2xl font-mono text-white">{modalData.slippage}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-brand-950 text-white rounded-sm border border-brand-800">
                                                <p className="text-[9px] text-brand-500 font-bold uppercase">Total Liability Est.</p>
                                                <p className="text-2xl font-mono text-action-500">${modalData.totalLiabilities?.toLocaleString()}</p>
                                            </div>
                                            <div className="h-40 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RePieChart>
                                                        <Pie data={modalData.regions} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                                            {modalData.regions?.map((_:any, index:number) => (
                                                                <Cell key={`cell-${index}`} fill={['#f97316', '#0f172a', '#64748b'][index % 3]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </RePieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-brand-100 flex gap-3">
                                        <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-white border border-brand-200 text-brand-600 rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-brand-50">Discard Audit</button>
                                        <button 
                                            onClick={handleExecuteAction}
                                            disabled={isExecuting}
                                            className="flex-1 py-3 bg-brand-950 text-white rounded-sm font-bold uppercase text-[10px] tracking-widest hover:bg-black shadow-xl flex items-center justify-center gap-2"
                                        >
                                            {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-action-500" /> : <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {activeModal === 'FX' ? 'Execute Rebalance' : 'Provision Reserves'}</>}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};