
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { analyzeTradeOpportunity } from '../services/geminiService';
import { BackendService } from '../services/backend';
import { MarketPulse, TradeOpportunity, WebhookEvent } from '../types';
import { BrainCircuit, TrendingUp, TrendingDown, Zap, RefreshCw, Lock, ShieldCheck, Activity, Globe, ArrowRight, BarChart3, Coins, Database, AlertCircle, Play, Eye, Share2 } from 'lucide-react';

interface AITradeTerminalProps {
    treasuryBalance: number;
    updateBalance: (delta: number) => void;
    onWebhookDispatched?: (event: WebhookEvent) => void;
}

export const AITradeTerminal: React.FC<AITradeTerminalProps> = ({ treasuryBalance, updateBalance, onWebhookDispatched }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [marketData, setMarketData] = useState<MarketPulse[]>([
        { pair: 'USD/NGN', rate: 1485.50, change: 0.12, volatility: 'MODERATE' },
        { pair: 'GBP/NGN', rate: 1892.40, change: -0.45, volatility: 'EXTREME' },
        { pair: 'EUR/NGN', rate: 1612.10, change: 0.05, volatility: 'STABLE' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => prev.map(p => ({
                ...p,
                rate: p.rate + (Math.random() - 0.5) * 0.5,
                change: p.change + (Math.random() - 0.5) * 0.05
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleScan = async () => {
        setIsScanning(true);
        setLogs(prev => [...prev, `>> INITIATING SCAN OF ${marketData.length} ACTIVE CORRIDORS...`]);
        const results = await analyzeTradeOpportunity(marketData);
        setOpportunities(results);
        setIsScanning(false);
        setLogs(prev => [...prev, `>> SCAN COMPLETE: ${results.length} SIGNALS DETECTED.`]);
    };

    const executeTrade = async (opportunity: TradeOpportunity) => {
        if (isExecuting) return;
        setIsExecuting(true);
        setLogs(prev => [...prev, `>> STARTING EXECUTION FOR ${opportunity.pair}...`]);
        
        const phases = [
            ">> ESTABLISHING BIMODAL HANDSHAKE...",
            ">> MIRRORING EXTERNAL LIQUIDITY NODE...",
            ">> AUTHORIZING HSM ATOMIC SWAP...",
            ">> BROADCASTING SETTLEMENT TO ORCHESTRATOR..."
        ];

        for (const phase of phases) {
            await new Promise(r => setTimeout(r, 800));
            setLogs(prev => [...prev, phase]);
        }

        try {
            const result = await BackendService.executeFXTrade(opportunity);
            if (result && result.success) {
                updateBalance(result.delta);
                if (onWebhookDispatched) onWebhookDispatched(result.event);
                
                setLogs(prev => [
                    ...prev, 
                    `>> SUCCESS: SETTLED DELTA $${result.delta.toFixed(2)}`,
                    `>> WEBHOOK DISPATCHED: ${result.event.id}`
                ]);
                setOpportunities(prev => prev.filter(o => o.id !== opportunity.id));
            } else {
                setLogs(prev => [...prev, ">> ERROR: SETTLEMENT RAIL REJECTED HANDSHAKE."]);
            }
        } catch (e) {
            setLogs(prev => [...prev, ">> CRITICAL: BACKEND UNREACHABLE."]);
        } finally {
            setIsExecuting(false);
        }
    };
const PROMPT = ">>> ";
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHeader 
                title="AI Trade Terminal" 
                subtitle="Autonomous corridor rebalancing and algorithmic hedging engine."
                breadcrumbs={['Treasury', 'Intelligence', 'Trade Terminal']}
                status="LIVE"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5"><BrainCircuit className="w-24 h-24" /></div>
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Trading NAV</p>
                    <p className="text-3xl font-mono font-medium text-action-500">${treasuryBalance.toLocaleString()}</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[9px] font-bold">
                       <Activity className="w-3 h-3" /> ORACLE_LINK_OPTIMAL
                    </div>
                </div>
                {marketData.map(pulse => (
                    <div key={pulse.pair} className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-brand-400 uppercase">{pulse.pair}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm border ${pulse.volatility === 'EXTREME' ? 'bg-rose-50 text-data-rose border-rose-100 animate-pulse' : 'bg-brand-50 text-brand-500 border-brand-100'}`}>{pulse.volatility}</span>
                        </div>
                        <div className="mt-2">
                            <p className="text-xl font-mono font-bold text-brand-900">{pulse.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <p className={`text-[10px] font-bold flex items-center gap-1 ${pulse.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {pulse.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {pulse.change.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-sm min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Zap className="w-4 h-4 text-action-500 fill-current" /> Opportunity Scan
                            </h3>
                            <button 
                                onClick={handleScan}
                                disabled={isScanning}
                                className="px-6 py-2 bg-brand-950 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                            >
                                {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <><BrainCircuit className="w-3.5 h-3.5" /> Initialize Reasoning</>}
                            </button>
                        </div>

                        <div className="flex-1 p-6 space-y-4">
                            {opportunities.length === 0 && !isScanning ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                    <Globe className="w-16 h-16 mb-4" />
                                    <p className="text-sm font-bold uppercase tracking-widest">No Active Signals</p>
                                    <p className="text-xs font-mono mt-2 uppercase">{PROMPT}ORACLE_STATE: STANDBY</p>
                                </div>
                            ) : (
                                opportunities.map((opp) => (
                                    <div key={opp.id} className="p-6 bg-brand-50 border border-brand-200 rounded-sm hover:border-action-500 transition-all group animate-in slide-in-from-right-4">
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-sm text-[10px] font-bold text-white uppercase ${opp.action === 'BUY' ? 'bg-emerald-600' : opp.action === 'HEDGE' ? 'bg-amber-600' : 'bg-rose-600'}`}>{opp.action}</span>
                                                    <h4 className="text-lg font-black text-brand-900 font-mono tracking-tighter">{opp.pair}</h4>
                                                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-l border-brand-200 pl-3">CONFIDENCE: {(opp.confidence * 100).toFixed(0)}%</span>
                                                </div>
                                                <p className="text-sm text-brand-700 leading-relaxed font-medium italic">"{opp.reasoning}"</p>
                                                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-brand-50">
                                                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Target Gain: {opp.expectedGain}</span>
                                                    <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand-900" /> Risk: {opp.riskFactor}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => executeTrade(opp)}
                                                    disabled={isExecuting}
                                                    className="w-full md:w-auto px-8 py-4 bg-action-500 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm shadow-xl hover:bg-action-600 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Execute Atomic Swap'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-950 p-6 rounded-sm border border-brand-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Lock className="w-32 h-32" /></div>
                        <h4 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Activity className="w-4 h-4" /> Reasoning Console
                        </h4>
                        <div className="bg-black/60 p-4 border border-brand-800 rounded-sm font-mono text-[9px] text-action-500 space-y-1 h-64 overflow-y-auto scrollbar-hide shadow-inner">
                            <p className="opacity-40">{PROMPT} System online. Synchronized with Gemini-3-Pro.</p>
                            <p className="opacity-60">{PROMPT} Pinging liquidity corridors (Lagos, London, NYC)...</p>
                            {logs.map((log, i) => (
                                <p key={i} className={i === logs.length - 1 && (isExecuting || isScanning) ? 'animate-pulse' : ''}>{log}</p>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm space-y-4">
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> External Sink Protocol
                        </h4>
                        <div className="space-y-4">
                            <div className="p-3 bg-brand-50 rounded-sm border border-brand-200">
                                <p className="text-[9px] text-brand-500 font-mono uppercase tracking-tighter">{PROMPT} Broker: Lagos Capital Rail v2</p>
                                <p className="text-[9px] text-brand-500 font-mono uppercase tracking-tighter">{PROMPT} Sync: Bilateral Ledger Handshake</p>
                                <div className="h-1 bg-brand-100 mt-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
