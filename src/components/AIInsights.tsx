
import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { askOracle, analyzeAnomalies, getCashFlowForecast } from '../services/geminiService';
import { 
    Terminal, TrendingUp, AlertTriangle, Lightbulb, Activity, ArrowRight, 
    Sparkles, BrainCircuit, Search, MessageSquare, Send, RefreshCw, 
    BarChart3, ShieldAlert, History, Zap, PieChart, TrendingDown,
    FileText, Download, Target, ChevronRight, X, UserSearch, ShieldCheck, 
    Smartphone, Mail, CheckCircle2, Sliders, Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type InsightAction = 'TRADE' | 'CONTACT' | 'BREAKDOWN' | 'ASSUMPTIONS' | null;

export const AIInsights: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [activeTab, setActiveTab] = useState<'INSIGHTS' | 'ORACLE'>('INSIGHTS');
    const [oracleQuery, setOracleQuery] = useState('');
    const [oracleResponse, setOracleResponse] = useState<string | null>(null);
    const [isThinking, setIsThinking] = useState(false);

    // Contextual Action Modal State
    const [activeAction, setActiveAction] = useState<InsightAction>(null);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [actionSuccess, setActionSuccess] = useState(false);

    const handleAskOracle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oracleQuery) return;
        setIsThinking(true);
        setOracleResponse(null);
        
        const response = await askOracle(oracleQuery, { transactions: transactions.slice(0, 20), treasury: 1842500 });
        setOracleResponse(response);
        setIsThinking(false);
    };

    const triggerAction = async (type: InsightAction) => {
        setActiveAction(type);
        setActionSuccess(false);
    };

    const executeActionProtocol = async () => {
        setIsProcessingAction(true);
        // Protocol Simulation
        await new Promise(r => setTimeout(r, 2000));
        setIsProcessingAction(false);
        setActionSuccess(true);
        setTimeout(() => {
            setActiveAction(null);
            setActionSuccess(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-brand-100 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-brand-900 tracking-tight flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-action-500" /> Intelligence Center
                    </h2>
                    <p className="text-brand-500 text-xs font-mono mt-1 uppercase tracking-widest">Oracle Mesh Protocol v4.2</p>
                </div>
                <div className="flex gap-1 bg-brand-50 p-1 rounded-sm border border-brand-200">
                    <button 
                        onClick={() => setActiveTab('INSIGHTS')}
                        className={`px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'INSIGHTS' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-500 hover:text-brand-900'}`}
                    >
                        Strategic Feed
                    </button>
                    <button 
                        onClick={() => setActiveTab('ORACLE')}
                        className={`px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'ORACLE' ? 'bg-brand-900 text-white shadow-md' : 'text-brand-500 hover:text-brand-900'}`}
                    >
                        Ask Oracle
                    </button>
                </div>
            </div>

            {activeTab === 'INSIGHTS' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Anomaly Detection */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-sm">
                            <div className="p-4 bg-rose-50 border-b border-rose-100 flex justify-between items-center">
                                <div className="flex items-center gap-3 text-rose-700">
                                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest">Anomaly Detected: Volume Variation</h3>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-rose-500">SEVERITY: HIGH</span>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="flex-1 space-y-6">
                                        <p className="text-xl font-bold text-brand-900 italic leading-snug">
                                            "⚠️ Transaction volume dropped 34% today vs. 7-day average."
                                        </p>
                                        <div className="h-40 w-full bg-brand-50 rounded-sm p-4 border border-brand-100 relative">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                <Activity className="w-24 h-24 text-rose-500" />
                                            </div>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={[{v:100},{v:90},{v:110},{v:40},{v:35}]}>
                                                    <Area type="monotone" dataKey="v" stroke="#e11d48" fill="#fff1f2" strokeWidth={3} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-64 space-y-6">
                                        <div className="p-4 bg-brand-950 text-white rounded-sm border border-brand-800">
                                            <p className="text-[9px] font-bold text-action-500 uppercase mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3" /> AI Analysis</p>
                                            <p className="text-xs font-mono text-brand-200 leading-relaxed italic">
                                                "Decline correlates with UK Bank Holiday (92% confidence) and 3 merchant outages in Lagos Hub."
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-bold text-brand-500 uppercase tracking-widest">Recommended Actions</p>
                                            <button onClick={() => triggerAction('CONTACT')} className="w-full text-left p-2 border border-brand-200 rounded-sm text-[10px] font-bold hover:bg-brand-50 flex justify-between items-center group">
                                                [1] Contact Offline Merchants <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <button onClick={() => triggerAction('ASSUMPTIONS')} className="w-full text-left p-2 border border-brand-200 rounded-sm text-[10px] font-bold hover:bg-brand-50 flex justify-between items-center group">
                                                [2] Review Holiday Strategy <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 border-t border-brand-100 pt-6">
                                    <button onClick={() => triggerAction('BREAKDOWN')} className="px-6 py-2 bg-brand-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Investigate</button>
                                    <button className="px-6 py-2 bg-white border border-brand-200 text-brand-500 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-50">Dismiss</button>
                                </div>
                            </div>
                        </div>

                        {/* Forecast Oracle */}
                        <div className="bg-brand-950 text-white p-8 rounded-sm shadow-xl border border-brand-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="w-48 h-48" /></div>
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <h3 className="text-xs font-bold text-action-500 uppercase tracking-[0.4em]">Cash Flow Forecast (30D)</h3>
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest">94% Confidence</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-500 uppercase mb-1">Expected Inflow</p>
                                            <p className="text-4xl font-mono font-bold text-white tracking-tighter">$2,450,000 <span className="text-xs text-emerald-500 font-bold tracking-normal ml-2">[+18% VS LM]</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-500 uppercase mb-1">Expected Outflow</p>
                                            <p className="text-4xl font-mono font-bold text-white tracking-tighter opacity-60">$1,680,000</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-brand-900 border border-brand-800 rounded-sm">
                                        <p className="text-[10px] font-bold text-action-500 uppercase mb-3 flex items-center gap-2"><Zap className="w-3.5 h-3.5 fill-current" /> Key Drivers</p>
                                        <ul className="text-xs space-y-2 font-mono text-brand-300 italic">
                                            <li>• Festive Shopping Peak (+22% vol)</li>
                                            <li>• 12 New Merchant Onboardings</li>
                                            <li>• Historical Dec Trend Acceleration</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => triggerAction('BREAKDOWN')} className="flex-1 py-3 bg-white text-brand-950 font-bold uppercase text-[10px] rounded-sm hover:bg-brand-100 transition-all">Full Breakdown</button>
                                        <button onClick={() => triggerAction('ASSUMPTIONS')} className="px-4 py-3 border border-brand-800 text-brand-500 font-bold uppercase text-[10px] rounded-sm hover:text-white hover:border-white transition-colors">Adjust Assumptions</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advisor Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-brand-200 p-6 rounded-sm shadow-sm">
                            <h3 className="text-xs font-bold text-brand-950 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-100 pb-4">
                                <Lightbulb className="w-4 h-4 text-action-500" /> AI Advisor: Top Moves
                            </h3>
                            <div className="space-y-6">
                                <div className="group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[11px] font-bold text-brand-900 uppercase">1. FX Arbitrage Detected</h4>
                                        <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">LOW RISK</span>
                                    </div>
                                    <p className="text-[11px] text-brand-500 leading-relaxed italic">Convert $45k USD → GBP now. Save £380 vs tomorrow's predicted rate.</p>
                                    <button onClick={() => triggerAction('TRADE')} className="mt-3 w-full py-2 bg-brand-950 text-white text-[9px] font-bold uppercase rounded-sm hover:bg-black transition-all">Execute Trade</button>
                                </div>
                                <div className="group cursor-pointer border-t border-brand-100 pt-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[11px] font-bold text-brand-900 uppercase">2. Treasury Yield</h4>
                                        <span className="text-[8px] font-bold text-brand-400 bg-brand-50 px-2 py-0.5 rounded-sm">NOMINAL</span>
                                    </div>
                                    <p className="text-[11px] text-brand-500 leading-relaxed italic">Move ₦15M from NGN_POOL → US_TREASURY. Target: +2.3% APY.</p>
                                    <button onClick={() => triggerAction('TRADE')} className="mt-3 w-full py-2 border border-brand-200 text-brand-900 text-[9px] font-bold uppercase rounded-sm hover:bg-brand-50 transition-all">Simulate</button>
                                </div>
                                <div className="group cursor-pointer border-t border-brand-100 pt-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-[11px] font-bold text-brand-900 uppercase">3. Merchant Risk</h4>
                                        <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-sm">ACTION REQ</span>
                                    </div>
                                    <p className="text-[11px] text-brand-500 leading-relaxed italic">"Digital Nomads Inc" churn probability: 68% (next 14 days).</p>
                                    <button onClick={() => triggerAction('CONTACT')} className="mt-3 w-full py-2 bg-rose-600 text-white text-[9px] font-bold uppercase rounded-sm hover:bg-rose-700 transition-all">Contact Merchant</button>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 border border-dashed border-brand-200 text-brand-400 font-bold uppercase text-[10px] hover:border-brand-900 hover:text-brand-900 transition-all">View All Recommendations</button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ORACLE' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-brand-950 p-10 rounded-sm border border-brand-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5"><MessageSquare className="w-64 h-64" /></div>
                        <div className="text-center mb-10 relative z-10">
                            <div className="w-16 h-16 bg-action-500/20 rounded-sm flex items-center justify-center mx-auto mb-6 border border-action-500/30 shadow-lg">
                                <Sparkles className="w-8 h-8 text-action-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Ask Oracle</h3>
                            <p className="text-brand-50 font-mono text-[10px] mt-1 uppercase tracking-widest">Direct Interface to Global Ledger Reasoning</p>
                        </div>

                        <form onSubmit={handleAskOracle} className="relative z-10 max-w-2xl mx-auto">
                            <div className="relative group">
                                <input 
                                    type="text"
                                    value={oracleQuery}
                                    onChange={(e) => setOracleQuery(e.target.value)}
                                    placeholder="e.g. Show me top 10 merchants by volume this quarter..."
                                    className="w-full bg-brand-900 border border-brand-800 p-6 rounded-sm text-white text-sm outline-none focus:border-action-500 focus:bg-brand-950 transition-all placeholder:text-brand-700 font-medium pr-16"
                                />
                                <button 
                                    type="submit"
                                    disabled={isThinking || !oracleQuery}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-action-500 text-white rounded-sm hover:bg-action-600 transition-all shadow-lg disabled:opacity-50"
                                >
                                    {isThinking ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>

                        {oracleResponse && (
                            <div className="mt-10 bg-black/60 border border-brand-800 p-8 rounded-sm animate-in fade-in zoom-in-95 relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Oracle_Found:</span>
                                    <button onClick={() => setOracleResponse(null)}><X className="w-4 h-4 text-brand-600 hover:text-white" /></button>
                                </div>
                                <div className="font-mono text-xs text-brand-100 leading-relaxed whitespace-pre-wrap overflow-x-auto prose prose-invert max-w-none">
                                    {oracleResponse}
                                </div>
                                <div className="mt-8 pt-4 border-t border-brand-900 flex justify-end gap-3">
                                    <button className="px-4 py-2 border border-brand-800 text-brand-400 font-bold uppercase text-[9px] hover:text-white transition-colors">Export .CSV</button>
                                    <button className="px-4 py-2 bg-brand-800 text-white font-bold uppercase text-[9px] hover:bg-brand-700 transition-colors">Save Report</button>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50 hover:opacity-100 transition-opacity">
                            {[
                                "What's my FX exposure?",
                                "Compare this month to last",
                                "Failed TX reasons?"
                            ].map(q => (
                                <button key={q} onClick={() => setOracleQuery(q)} className="p-4 bg-brand-900/40 border border-brand-800 rounded-sm text-left hover:border-action-500 transition-all">
                                    <p className="text-[10px] text-brand-500 uppercase font-bold mb-1 italic">Try asking:</p>
                                    <p className="text-[11px] text-white font-bold">"{q}"</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ACTION MODAL */}
            {activeAction && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-md" onClick={() => !isProcessingAction && setActiveAction(null)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-lg rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center border-b border-brand-800">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-action-500" />
                                <h3 className="text-xs font-bold uppercase tracking-widest">
                                    {activeAction === 'TRADE' && 'Execute Bilateral Trade'}
                                    {activeAction === 'CONTACT' && 'Establish Secure Comms'}
                                    {activeAction === 'BREAKDOWN' && 'Forecast Intelligence Drill-down'}
                                    {activeAction === 'ASSUMPTIONS' && 'Actuarial Parameter Adjustment'}
                                </h3>
                            </div>
                            <button onClick={() => setActiveAction(null)}><X className="w-4 h-4 text-brand-500 hover:text-white" /></button>
                        </div>

                        <div className="p-10 space-y-6">
                            {actionSuccess ? (
                                <div className="text-center space-y-6 py-8 animate-in fade-in">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-xl font-bold text-brand-900 uppercase tracking-tighter italic">Protocol Successful</h4>
                                    <p className="text-brand-500 text-xs font-mono uppercase tracking-widest">Action Synchronized across Lagos/London nodes.</p>
                                </div>
                            ) : (
                                <>
                                    {activeAction === 'TRADE' && (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-brand-50 border border-brand-100 rounded-sm font-mono text-[10px] space-y-2">
                                                <div className="flex justify-between"><span>CURRENCY_PAIR</span> <span className="text-brand-900 font-bold">USD/GBP</span></div>
                                                <div className="flex justify-between"><span>TARGET_MARGIN</span> <span className="text-emerald-600 font-bold">+4.2%</span></div>
                                                <div className="flex justify-between"><span>SETTLEMENT_RAIL</span> <span className="text-brand-900">HSM_ATOM_SWAP</span></div>
                                            </div>
                                            <p className="text-xs text-brand-600 leading-relaxed italic">"Oracle recommends immediate rebalancing of the London Liquidity Pool to exploit the 14ms spread detected."</p>
                                        </div>
                                    )}

                                    {activeAction === 'CONTACT' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <button className="p-4 border border-brand-200 rounded-sm hover:border-brand-900 text-left transition-all group">
                                                    <Smartphone className="w-5 h-5 text-action-500 mb-2" />
                                                    <p className="text-[10px] font-bold text-brand-900 uppercase">Secure Push</p>
                                                    <p className="text-[8px] text-brand-400 uppercase">Immediate Alert</p>
                                                </button>
                                                <button className="p-4 border border-brand-200 rounded-sm hover:border-brand-900 text-left transition-all group">
                                                    <Mail className="w-5 h-5 text-brand-400 mb-2" />
                                                    <p className="text-[10px] font-bold text-brand-900 uppercase">Email Dossier</p>
                                                    <p className="text-[8px] text-brand-400 uppercase">Technical Breakdown</p>
                                                </button>
                                            </div>
                                            <textarea className="w-full h-24 p-3 bg-brand-50 border border-brand-200 rounded-sm text-xs outline-none focus:border-action-500" placeholder="Enter secure message for merchant..." />
                                        </div>
                                    )}

                                    {activeAction === 'BREAKDOWN' && (
                                        <div className="space-y-4">
                                            <div className="max-h-60 overflow-y-auto space-y-1 font-mono text-[10px] text-brand-600">
                                                {[
                                                    { cat: 'REVENUE:SAAS', val: '+$84,200', node: 'LAG-01' },
                                                    { cat: 'REVENUE:CARDS', val: '+$12,400', node: 'LON-02' },
                                                    { cat: 'OPEX:PAYROLL', val: '-$45,000', node: 'SYSTEM' },
                                                    { cat: 'OPEX:TAX_NG', val: '-$12,100', node: 'REGION' },
                                                    { cat: 'FX_GAIN:ARBITRAGE', val: '+$1,420', node: 'ORACLE' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex justify-between p-2 border-b border-brand-50 hover:bg-brand-50">
                                                        <span>{item.cat}</span>
                                                        <span className={item.val.startsWith('+') ? 'text-emerald-600 font-bold' : 'text-rose-600'}>{item.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[9px] text-brand-400 uppercase font-bold text-center">Data aggregated from 14 global nodes</p>
                                        </div>
                                    )}

                                    {activeAction === 'ASSUMPTIONS' && (
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-brand-500 uppercase">
                                                    <span className="flex items-center gap-2"><Sliders className="w-3 h-3" /> Growth Baseline</span>
                                                    <span className="text-brand-900 font-mono">18% /Mo</span>
                                                </div>
                                                <input type="range" className="w-full h-1 bg-brand-100 rounded-full appearance-none cursor-pointer accent-action-500" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-[10px] font-bold text-brand-500 uppercase">
                                                    <span className="flex items-center gap-2"><Target className="w-3 h-3" /> Churn Coefficient</span>
                                                    <span className="text-brand-900 font-mono">2.4% /Mo</span>
                                                </div>
                                                <input type="range" className="w-full h-1 bg-brand-100 rounded-full appearance-none cursor-pointer accent-action-500" />
                                            </div>
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex gap-3">
                                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                                <p className="text-[10px] text-amber-700 leading-relaxed uppercase">Adjusting assumptions impacts the Oracle confidence score. Re-simulation will be required.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={executeActionProtocol}
                                        disabled={isProcessingAction}
                                        className="w-full py-4 bg-brand-950 text-white rounded-sm font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessingAction ? (
                                            <><RefreshCw className="w-4 h-4 animate-spin text-action-500" /> COMMITTING_LEDGER...</>
                                        ) : (
                                            <><Zap className="w-4 h-4 text-action-500 fill-current" /> Authorize Intelligence Protocol</>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                        
                        {!actionSuccess && (
                            <div className="p-4 bg-brand-50 border-t border-brand-100 flex justify-between items-center px-8">
                                <div className="flex items-center gap-2 text-[9px] font-mono text-brand-400 uppercase">
                                    <Globe className="w-3 h-3" /> HSM_TUNNEL: ACTIVE
                                </div>
                                <span className="text-[10px] font-bold text-brand-900 uppercase italic">SHA-256 Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
