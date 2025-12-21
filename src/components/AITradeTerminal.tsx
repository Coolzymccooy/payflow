
import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from './PageHeader';
import { analyzeTradeOpportunity } from '../services/geminiService';
import { BackendService } from '../services/backend';
import { MarketPulse, TradeOpportunity, WebhookEvent } from '../types';
import { 
    BrainCircuit, TrendingUp, TrendingDown, Zap, RefreshCw, Lock, ShieldCheck, 
    Activity, Globe, ArrowRight, BarChart3, Coins, Database, AlertCircle, 
    Play, Eye, Share2, Plus, Network, Building, Landmark, CheckCircle2, 
    X, ShieldAlert, ChevronRight, Sliders, ArrowLeftRight,
    Smartphone, Search, Layers, Fingerprint, Clock, Gauge, Target, Siren, 
    ChevronDown, Shield, ShieldPlus, BarChart, History, Lightbulb, Map,
    AlertTriangle, ToggleLeft, ToggleRight, Scale
} from 'lucide-react';

interface Hypothesis {
    id: string;
    type: 'IMBALANCE' | 'VOLATILITY' | 'ARBITRAGE';
    content: string;
    confidence: number;
    trigger: string;
    action: string;
    timestamp: string;
}

interface MarketSession {
    city: string;
    open: number; // Hour in 24h
    close: number;
    timezone: string;
    days: string;
}

const SESSIONS: MarketSession[] = [
    { city: 'London', open: 8, close: 17, timezone: 'GMT', days: 'Mon-Fri' },
    { city: 'Lagos', open: 9, close: 16, timezone: 'WAT', days: 'Mon-Fri' },
    { city: 'New York', open: 13, close: 20, timezone: 'EST', days: 'Mon-Fri' }
];

interface TerminalProps {
    treasuryBalance: number;
    updateBalance: (delta: number) => void;
    onWebhookDispatched?: (event: WebhookEvent) => void;
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const AITradeTerminal: React.FC<TerminalProps> = ({ treasuryBalance, updateBalance, onWebhookDispatched, addNotification }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([]);
    const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
    const [linkedNodes, setLinkedNodes] = useState<any[]>([]);
    const [marketData, setMarketData] = useState<MarketPulse[]>([
        { pair: 'USD/NGN', rate: 1485.50, change: 0.12, volatility: 'MODERATE' },
        { pair: 'GBP/NGN', rate: 1892.40, change: -0.45, volatility: 'EXTREME' },
        { pair: 'EUR/NGN', rate: 1612.10, change: 0.05, volatility: 'STABLE' },
    ]);

    // --- TERMINAL INTELLIGENCE STATE ---
    const [intent, setIntent] = useState<'CORRIDOR_STABILITY' | 'NAV_PRESERVATION' | 'YIELD_MAX'>('CORRIDOR_STABILITY');
    const [activePlaybook, setActivePlaybook] = useState<string | null>(null);
    const [isProcessingPlaybook, setIsProcessingPlaybook] = useState(false);
    const [trustLevel, setTrustLevel] = useState<'MANUAL' | 'ASSISTED' | 'AUTONOMOUS'>('ASSISTED');

    // --- NAV DEFENSE STATE ---
    const [isNavDefenseOpen, setIsNavDefenseOpen] = useState(false);
    const [navDefenseConfig, setNavDefenseConfig] = useState({
        enabled: true,
        threshold: 1.2,
        mode: 'HEDGE_ONLY' as 'HEDGE_ONLY' | 'LIQUIDATE'
    });

    // --- NODE CONNECTION FLOW STATE ---
    const [isConnectingNode, setIsConnectingNode] = useState(false);
    const [nodeWizardStep, setNodeWizardStep] = useState(1);
    const [nodeForm, setNodeForm] = useState({ bank: '', accountNo: '', routing: '', protocol: 'DIRECT_ISO', currency: 'USD' });
    const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
    const [isWizardProcessing, setIsWizardProcessing] = useState(false);

    // --- EXECUTION MODAL STATE ---
    const [activeSwap, setActiveSwap] = useState<TradeOpportunity | null>(null);
    const [selectedSourceNode, setSelectedSourceNode] = useState<string | null>(null);
    const [selectedTargetNode, setSelectedTargetNode] = useState<string | null>(null);

    useEffect(() => {
        fetchNodes();
        const interval = setInterval(() => {
            setMarketData(prev => prev.map(p => ({
                ...p,
                rate: p.rate + (Math.random() - 0.5) * 0.5,
                change: p.change + (Math.random() - 0.5) * 0.05
            })));
            
            // Random Hypothesis Generation to make it feel alive
            if (Math.random() > 0.8) {
                const types: Hypothesis['type'][] = ['IMBALANCE', 'VOLATILITY', 'ARBITRAGE'];
                const newHyp: Hypothesis = {
                    id: Math.random().toString(36).substr(2, 5).toUpperCase(),
                    type: types[Math.floor(Math.random() * types.length)],
                    content: "Liquidity drain detected in Lagos Hub due to UK holiday latency shift.",
                    confidence: 85 + Math.random() * 10,
                    trigger: "Latency > 240ms",
                    action: "Rebalance from USD Treasury",
                    timestamp: new Date().toLocaleTimeString()
                };
                setHypotheses(prev => [newHyp, ...prev].slice(0, 5));
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchNodes = async () => {
        const nodes = await BackendService.getNodes();
        setLinkedNodes(nodes);
    };

    const handleScan = async () => {
        setIsScanning(true);
        const results = await analyzeTradeOpportunity(marketData);
        setOpportunities(results || []);
        setIsScanning(false);
    };

    const togglePlaybook = async () => {
        setIsProcessingPlaybook(true);
        // Simulated AI analysis of current corridor state
        await new Promise(r => setTimeout(r, 1500));
        
        const newState = activePlaybook ? null : 'CORRIDOR_STAB';
        setActivePlaybook(newState);
        setIsProcessingPlaybook(false);
        
        if (addNotification) {
            addNotification(
                newState ? 'Protocol Engaged' : 'Protocol Terminated', 
                newState ? 'Corridor Stabilization Loop synchronized across all regional nodes.' : 'Manual control restored to terminal.',
                newState ? 'SUCCESS' : 'INFO'
            );
        }
    };

    const handleConnectNode = async () => {
        setIsWizardProcessing(true);
        setHandshakeLogs([]);
        const logs = [">> RESOLVING ENCLAVE...", ">> CHALLENGING HSM_SIG...", ">> DIFFIE-HELLMAN KEY EXCHANGE...", ">> COMMITTING MIRROR..."];
        for (const log of logs) {
            await new Promise(r => setTimeout(r, 600));
            setHandshakeLogs(prev => [...prev, log]);
        }
        const result = await BackendService.bindMirrorNode(nodeForm);
        if (result && result.success) {
            setLinkedNodes(prev => [...prev, result.node]);
            setIsWizardProcessing(false);
            setNodeWizardStep(3);
        } else {
            setHandshakeLogs(prev => [...prev, ">> CRITICAL_ERROR: REMOTE_REJECTION."]);
            setIsWizardProcessing(false);
        }
    };

    const executeTrade = async () => {
        if (!activeSwap || !selectedSourceNode || !selectedTargetNode || isExecuting) return;
        setIsExecuting(true);
        try {
            const result = await BackendService.executeFXTrade(activeSwap, { sourceNode: selectedSourceNode, targetNode: selectedTargetNode });
            if (result && result.success) {
                updateBalance(result.delta);
                if (onWebhookDispatched) onWebhookDispatched(result.event);
                setOpportunities(prev => prev.filter(o => o.id !== activeSwap.id));
                setActiveSwap(null);
                fetchNodes();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsExecuting(false);
        }
    };

    const getMarketSessionStatus = (session: MarketSession) => {
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 6 is Saturday
        const hour = now.getHours();

        // Check for Weekend (Sunday = 0, Saturday = 6)
        if (day === 0 || day === 6) {
            return 'WEEKEND_HALT';
        }

        return (hour >= session.open && hour < session.close) ? 'OPEN' : 'CLOSED';
    };

    const corridorHealth = useMemo(() => {
        return marketData.map(pulse => ({
            pair: pulse.pair,
            score: Math.floor(70 + Math.random() * 30),
            status: pulse.volatility === 'EXTREME' ? 'STRESSED' : 'STABLE'
        }));
    }, [marketData]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center bg-brand-950 px-6 py-3 border-b border-brand-800 shrink-0">
                <div className="flex gap-8 items-center overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-2 text-action-500 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Market Context:</span>
                    </div>
                    {SESSIONS.map(s => {
                        const status = getMarketSessionStatus(s);
                        return (
                            <div key={s.city} className="flex items-center gap-3 shrink-0">
                                <div>
                                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-tighter block">{s.city}</span>
                                    <span className="text-[7px] text-brand-600 font-mono uppercase leading-none">{s.days} {s.timezone}</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded-sm text-[8px] font-black tracking-widest ${
                                    status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                    status === 'WEEKEND_HALT' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                    'bg-brand-900 text-brand-600 border border-brand-800'
                                }`}>
                                    {status}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="hidden lg:flex items-center gap-3 text-brand-50 text-[9px] font-mono shrink-0">
                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                    SYSTEM_STABILITY: 99.98%
                </div>
            </div>

            <PageHeader 
                title="AI Trade Terminal" 
                subtitle="The institutional standard for autonomous rebalancing and bilateral ledger mirroring."
                breadcrumbs={['Treasury', 'Intelligence', 'Trade Terminal']}
                status="LIVE"
                actions={
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsConnectingNode(true)}
                            className="bg-brand-950 text-white border border-brand-800 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                        >
                            <Network className="w-3.5 h-3.5 text-action-500" /> Provision Node
                        </button>
                        <button 
                            onClick={() => setTrustLevel(trustLevel === 'MANUAL' ? 'ASSISTED' : trustLevel === 'ASSISTED' ? 'AUTONOMOUS' : 'MANUAL')}
                            className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${trustLevel === 'AUTONOMOUS' ? 'bg-action-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-brand-50 text-brand-900 border border-brand-200'}`}
                        >
                            <Shield className="w-3.5 h-3.5" /> Trust: {trustLevel}
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[450px]">
                <div className="lg:col-span-8 bg-brand-950 rounded-sm border border-brand-800 relative overflow-hidden flex flex-col shadow-2xl">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    
                    <div className="p-6 border-b border-brand-900 flex justify-between items-center relative z-10 bg-black/20">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-action-500" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Proprietary_Hypothesis_Engine</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[8px] text-brand-500 font-bold uppercase mb-0.5">Primary Intent</p>
                                <select 
                                    value={intent}
                                    onChange={e => setIntent(e.target.value as any)}
                                    className="bg-transparent text-action-500 text-[10px] font-black uppercase outline-none border-none cursor-pointer"
                                >
                                    <option value="CORRIDOR_STABILITY">Corridor Stability</option>
                                    <option value="NAV_PRESERVATION">NAV Preservation</option>
                                    <option value="YIELD_MAX">Yield Max</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide relative z-10">
                        {hypotheses.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                <RefreshCw className="w-10 h-10 mb-4 animate-spin text-brand-500" />
                                <p className="text-[10px] font-mono text-brand-500 uppercase">Listening for Corridor Imbalances...</p>
                            </div>
                        ) : (
                            hypotheses.map((h, i) => (
                                <div key={h.id} className={`p-4 rounded-sm border border-brand-800 bg-brand-900/40 animate-in slide-in-from-left-4 duration-500 ${i === 0 ? 'border-action-500/50 bg-action-500/5 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : ''}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase border ${h.type === 'IMBALANCE' ? 'text-rose-400 border-rose-400/30' : 'text-emerald-400 border-emerald-400/30'}`}>
                                                {h.type}
                                            </span>
                                            <span className="text-[9px] font-mono text-brand-500">{h.timestamp}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-white">{h.confidence.toFixed(1)}%</span>
                                            <p className="text-[7px] text-brand-600 font-bold uppercase tracking-widest">Confidence Score</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-brand-100 font-medium leading-relaxed italic mb-4">"{h.content}"</p>
                                    <div className="flex gap-6 items-center pt-3 border-t border-brand-800">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-3 h-3 text-action-500" />
                                            <span className="text-[9px] font-black text-brand-400 uppercase">Trigger: {h.trigger}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-400 uppercase">Recommendation: {h.action}</span>
                                        </div>
                                        {trustLevel === 'AUTONOMOUS' && i === 0 && (
                                            <div className="ml-auto flex items-center gap-2 text-[8px] font-black text-action-500 animate-pulse">
                                                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> AUTO_REBALANCING...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex-1 bg-white border border-brand-200 rounded-sm shadow-sm p-6 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Map className="w-24 h-24" /></div>
                        <h3 className="text-[10px] font-black text-brand-900 uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-brand-50 pb-4">
                            <Gauge className="w-4 h-4 text-action-500" /> Corridor Health Matrix
                        </h3>
                        <div className="space-y-6">
                            {corridorHealth.map(h => (
                                <div key={h.pair} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-tight">{h.pair}</span>
                                        <div className="text-right">
                                            <span className="text-lg font-mono font-black text-brand-900">{h.score}</span>
                                            <span className={`text-[8px] font-black uppercase ml-2 ${h.status === 'STRESSED' ? 'text-rose-500' : 'text-emerald-500'}`}>{h.status}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-brand-50 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${h.status === 'STRESSED' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${h.score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-brand-950 p-6 rounded-sm text-white border border-brand-800 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                        <p className="text-[9px] font-bold text-brand-500 uppercase tracking-widest mb-1">Trading NAV Cap</p>
                        <p className="text-2xl font-mono font-bold text-white tracking-tighter">${treasuryBalance.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-2 text-action-500 text-[9px] font-bold uppercase tracking-widest">
                           <ShieldPlus className="w-3 h-3 fill-current" /> Switch_Cap: $100M Authorized
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden flex flex-col h-auto lg:h-[550px]">
                        <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                            <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-action-500" /> Mesh Node Hub
                            </h3>
                        </div>
                        <div className="flex-1 divide-y divide-brand-50 overflow-y-auto scrollbar-hide min-h-[200px]">
                            {linkedNodes.length === 0 ? (
                                <div className="p-10 text-center opacity-40">
                                    <Globe className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-[9px] font-bold uppercase">No nodes handshake active</p>
                                </div>
                            ) : (
                                linkedNodes.map(node => (
                                    <div key={node.id} className="p-4 hover:bg-brand-50 transition-all group relative">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-[10px] font-black text-brand-900 uppercase truncate">{node.bank}</p>
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-75"></div>
                                                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse delay-150"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-mono text-brand-400">{node.accountNo}</p>
                                                    <p className="text-[8px] text-brand-300 uppercase mt-0.5">Reliability: 99.9%</p>
                                                </div>
                                                <p className="text-sm font-mono font-bold text-brand-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: node.currency }).format(node.balance)}</p>
                                            </div>
                                            <div className="h-0.5 w-full bg-brand-50 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="h-full bg-emerald-500 w-[99.9%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 bg-brand-50 border-t border-brand-100">
                             <button 
                                onClick={() => setIsConnectingNode(true)}
                                className="w-full py-2.5 bg-brand-950 text-white rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                             >
                                <Plus className="w-3 h-3 text-action-500" /> New Node Handshake
                             </button>
                        </div>
                    </div>

                    <div className="bg-brand-950 p-6 rounded-sm border border-brand-800 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Target className="w-32 h-32" /></div>
                        <h4 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                           <Activity className="w-4 h-4" /> Settlement Radar
                        </h4>
                        <div className="space-y-4 font-mono text-[9px]">
                            <div className="flex justify-between border-b border-brand-900 pb-2">
                                <span className="text-brand-500">CONGESTION_PROB</span>
                                <span className="text-emerald-400">0.04%</span>
                            </div>
                            <div className="flex justify-between border-b border-brand-900 pb-2">
                                <span className="text-brand-500">FAILURE_FORECAST</span>
                                <span className="text-brand-400">NOMINAL</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-500">NEXT_REBALANCE_WIN</span>
                                <span className="text-white">12m 42s</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-9 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-sm min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-brand-100 bg-brand-50 flex justify-between items-center flex-wrap gap-4">
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="px-6 py-2.5 bg-brand-950 text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black transition-all shadow-lg disabled:opacity-50"
                                >
                                    {isScanning ? <RefreshCw className="w-4 h-4 animate-spin text-action-500" /> : <><BrainCircuit className="w-4 h-4 text-action-500" /> Initiate Scan</>}
                                </button>
                                <div className="h-10 w-px bg-brand-200 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest hidden sm:inline">Active Playbook:</span>
                                    <button 
                                        onClick={togglePlaybook}
                                        disabled={isProcessingPlaybook}
                                        className={`px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                                            isProcessingPlaybook ? 'bg-brand-50 text-brand-300 border-brand-100 cursor-wait' :
                                            activePlaybook === 'CORRIDOR_STAB' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-brand-500 border-brand-200 hover:border-brand-900'
                                        }`}
                                    >
                                        {isProcessingPlaybook ? (
                                            <><RefreshCw className="w-3 h-3 animate-spin text-action-500" /> Analyzing Corridor...</>
                                        ) : activePlaybook === 'CORRIDOR_STAB' ? (
                                            <><CheckCircle2 className="w-3 h-3" /> Stabilization Protocol Active</>
                                        ) : (
                                            <><History className="w-3 h-3" /> Engage Stabilization</>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-mono text-brand-400 font-bold uppercase">
                                Oracle_v5.4 // <span className="text-emerald-500">Nominal</span>
                            </div>
                        </div>

                        <div className="flex-1 p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/graphy-dark.png')] bg-opacity-5">
                            {opportunities.length === 0 && !isScanning ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 p-20 border-2 border-dashed border-brand-100 rounded-sm">
                                    <Lightbulb className="w-16 h-16 mb-4 text-action-500" />
                                    <p className="text-sm font-black text-brand-900 uppercase tracking-[0.3em]">No Active Signals</p>
                                    <p className="text-[10px] font-mono mt-3 uppercase tracking-[0.2em] max-w-sm">Autonomous reasoning loop in standby. Manual scan recommended for fresh corridor resolution.</p>
                                </div>
                            ) : (
                                opportunities.map((opp) => (
                                    <div key={opp.id} className="p-8 bg-white border border-brand-200 rounded-sm hover:border-brand-900 transition-all group animate-in slide-in-from-right-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-5"><TrendingUp className="w-24 h-24" /></div>
                                        <div className="flex flex-col md:flex-row justify-between gap-10">
                                            <div className="space-y-6 flex-1">
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-4 py-1.5 rounded-sm text-[10px] font-black text-white uppercase tracking-widest ${opp.action === 'BUY' ? 'bg-emerald-600' : opp.action === 'HEDGE' ? 'bg-amber-600' : 'bg-rose-600'}`}>{opp.action}</span>
                                                    <h4 className="text-2xl font-black text-brand-900 font-mono tracking-tighter italic">{opp.pair}</h4>
                                                    <div className="h-6 w-px bg-brand-100"></div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-mono font-black text-brand-900">{(opp.confidence * 100).toFixed(0)}%</p>
                                                        <p className="text-[7px] text-brand-400 font-black uppercase tracking-widest">Confidence</p>
                                                    </div>
                                                </div>
                                                <p className="text-base text-brand-700 leading-relaxed font-medium italic border-l-4 border-action-500 pl-6">"{opp.reasoning}"</p>
                                                <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <span className="flex items-center gap-3 text-emerald-600"><TrendingUp className="w-5 h-5" /> Target Spread: {opp.expectedGain}</span>
                                                    <span className="flex items-center gap-3 text-brand-400"><ShieldCheck className="w-5 h-5" /> Audit Score: {opp.riskFactor}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button 
                                                    onClick={() => setActiveSwap(opp)}
                                                    className="w-full md:w-auto px-10 py-6 bg-brand-950 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-sm shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group/btn"
                                                >
                                                    <Zap className="w-4 h-4 text-action-500 group-hover/btn:scale-125 transition-transform" /> Authorize Atomic Swap
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-brand-950 p-8 rounded-sm text-white shadow-xl border border-brand-800 flex justify-between items-center group">
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-action-500">NAV Defense Mode</h4>
                                <p className="text-[10px] text-brand-400 max-w-xs">
                                    AI will automatically hedge USD exposure if NGN volatility crosses {navDefenseConfig.threshold}x ACT score.
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-sm text-[8px] font-black ${navDefenseConfig.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {navDefenseConfig.enabled ? 'ACTIVE' : 'OFFLINE'}
                                    </span>
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsNavDefenseOpen(true)}
                                className="px-6 py-2 border border-brand-800 text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all"
                            >
                                Configure
                            </button>
                        </div>
                        <div className="bg-white p-8 border border-brand-200 rounded-sm shadow-sm flex justify-between items-center">
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-900">Yield Optimization Loop</h4>
                                <p className="text-[10px] text-brand-500 max-w-xs">Oracle cycles through 14 regional corridors every 60s for yield anomalies.</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                <RefreshCw className="w-6 h-6 animate-spin-slow" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAV DEFENSE CONFIGURATION MODAL */}
            {isNavDefenseOpen && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-xl" onClick={() => setIsNavDefenseOpen(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-action-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">NAV_DEFENSE_PROCOCOL_CONFIG</h3>
                            </div>
                            <button onClick={() => setIsNavDefenseOpen(false)}><X className="w-4 h-4 text-brand-500" /></button>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-brand-900 uppercase">System Arming</p>
                                    <p className="text-[9px] text-brand-500 uppercase font-mono">Toggle autonomous rebalancing</p>
                                </div>
                                <button 
                                    onClick={() => setNavDefenseConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                                    className={`p-2 transition-all rounded-sm border ${navDefenseConfig.enabled ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-brand-50 text-brand-400 border-brand-200'}`}
                                >
                                    {navDefenseConfig.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase text-brand-500">
                                    <span className="flex items-center gap-2"><Scale className="w-4 h-4" /> Volatility Threshold</span>
                                    <span className="text-brand-900 font-mono text-sm">{navDefenseConfig.threshold}x ACT</span>
                                </div>
                                <input 
                                    type="range" min="0.5" max="3.0" step="0.1" 
                                    value={navDefenseConfig.threshold} 
                                    onChange={(e) => setNavDefenseConfig(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                                    className="w-full h-1.5 bg-brand-100 rounded-full appearance-none cursor-pointer accent-action-500" 
                                />
                                <div className="flex justify-between text-[7px] text-brand-400 font-black uppercase">
                                    <span>HYPER_SENSITIVE</span>
                                    <span>MAX_STABILITY</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-brand-500 uppercase block">Reaction Protocol</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setNavDefenseConfig(prev => ({ ...prev, mode: 'HEDGE_ONLY' }))}
                                        className={`p-4 border rounded-sm text-left transition-all ${navDefenseConfig.mode === 'HEDGE_ONLY' ? 'border-brand-900 bg-brand-50 ring-1 ring-brand-900' : 'border-brand-100 hover:bg-brand-50'}`}
                                    >
                                        <p className="text-[10px] font-black text-brand-900 uppercase">Hedge Only</p>
                                        <p className="text-[8px] text-brand-400 mt-1 uppercase leading-tight">Preserve position via corridor swap</p>
                                    </button>
                                    <button 
                                        onClick={() => setNavDefenseConfig(prev => ({ ...prev, mode: 'LIQUIDATE' }))}
                                        className={`p-4 border rounded-sm text-left transition-all ${navDefenseConfig.mode === 'LIQUIDATE' ? 'border-brand-900 bg-brand-50 ring-1 ring-brand-900' : 'border-brand-100 hover:bg-brand-50'}`}
                                    >
                                        <p className="text-[10px] font-black text-brand-900 uppercase">Liquidate</p>
                                        <p className="text-[8px] text-brand-400 mt-1 uppercase leading-tight">Full exit to USD Reserve Node</p>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-[9px] text-amber-800 leading-relaxed font-black uppercase">
                                    Manual overrides will be disabled once threshold is crossed. Autonomous Oracle will command all bilateral mirrors.
                                </p>
                            </div>

                            <button 
                                onClick={() => {
                                    setIsNavDefenseOpen(false);
                                    if (addNotification) addNotification('Defense Policy Updated', `Threshold set to ${navDefenseConfig.threshold}x ACT.`, 'SUCCESS');
                                }}
                                className="w-full py-4 bg-brand-950 text-white font-black uppercase text-xs tracking-[0.4em] rounded-sm shadow-xl hover:bg-black transition-all"
                            >
                                Commit Policy to HSM
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ATOMIC SWAP EXECUTION MODAL */}
            {activeSwap && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-xl" onClick={() => !isExecuting && setActiveSwap(null)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-xl rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Zap className="w-5 h-5 text-action-500 fill-current" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Atomic Protocol Authorization</h3>
                            </div>
                            <button onClick={() => setActiveSwap(null)}><X className="w-4 h-4 text-brand-500" /></button>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="flex justify-between items-center border-b border-brand-50 pb-6">
                                <div>
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Execution Corridor</p>
                                    <p className="text-3xl font-black text-brand-900 italic tracking-tighter">{activeSwap.pair}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Spread Potential</p>
                                    <p className="text-3xl font-mono font-bold text-emerald-600">{activeSwap.expectedGain}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] mb-4 block">1. Debit Node (Liquidity Source)</label>
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                                        {linkedNodes.map(node => (
                                            <button 
                                                key={node.id}
                                                onClick={() => setSelectedSourceNode(node.id)}
                                                className={`p-5 border rounded-sm text-left flex justify-between items-center transition-all ${selectedSourceNode === node.id ? 'border-brand-900 bg-brand-50 shadow-md ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-300'}`}
                                            >
                                                <div>
                                                    <p className="text-xs font-black text-brand-900 uppercase">{node.bank}</p>
                                                    <p className="text-[9px] font-mono text-brand-400 uppercase tracking-widest">{node.accountNo} • {node.currency}</p>
                                                </div>
                                                <p className="text-sm font-mono font-bold text-brand-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: node.currency }).format(node.balance)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em] mb-4 block">2. Credit Node (Target Vault)</label>
                                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                                        {linkedNodes.map(node => (
                                            <button 
                                                key={node.id}
                                                onClick={() => setSelectedTargetNode(node.id)}
                                                className={`p-5 border rounded-sm text-left flex justify-between items-center transition-all ${selectedTargetNode === node.id ? 'border-brand-900 bg-brand-50 shadow-md ring-1 ring-brand-900' : 'border-brand-100 hover:border-brand-300'}`}
                                            >
                                                <div>
                                                    <p className="text-xs font-black text-brand-900 uppercase">{node.bank}</p>
                                                    <p className="text-[9px] font-mono text-brand-400 uppercase tracking-widest">{node.accountNo} • {node.currency}</p>
                                                </div>
                                                <p className="text-sm font-mono font-bold text-brand-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: node.currency }).format(node.balance)}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-sm flex gap-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                                <p className="text-[11px] text-emerald-800 leading-relaxed font-black uppercase tracking-tight">
                                    Bilateral mirroring is active. This atomic swap will be committed to both institutional ledgers simultaneously (T+0). Oracle verifies zero-slippage.
                                </p>
                            </div>

                            <button 
                                onClick={executeTrade}
                                disabled={isExecuting || !selectedSourceNode || !selectedTargetNode}
                                className="w-full py-6 bg-brand-950 text-white font-black uppercase text-sm tracking-[0.4em] rounded-sm shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed group active:scale-[0.99]"
                            >
                                {isExecuting ? <RefreshCw className="w-5 h-5 animate-spin text-action-500" /> : <><Lock className="w-5 h-5 text-action-500 group-hover:scale-110 transition-transform" /> Confirm & Execute Atomic Swap</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONNECT NODE MODAL */}
            {isConnectingNode && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-xl" onClick={() => !isWizardProcessing && setIsConnectingNode(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-2xl rounded-sm overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <Network className="w-5 h-5 text-action-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Nexus Bridge: Bank Node Initializer</h3>
                            </div>
                            <button onClick={() => setIsConnectingNode(false)}><X className="w-4 h-4 text-brand-500 hover:text-white" /></button>
                        </div>

                        <div className="p-12 flex-1 overflow-y-auto space-y-12">
                            {nodeWizardStep === 1 && (
                                <div className="space-y-8 animate-in slide-in-from-right-4">
                                    <div className="text-center">
                                        <h4 className="text-3xl font-black text-brand-900 uppercase tracking-tighter italic">1. Identify Institution</h4>
                                        <p className="text-[10px] text-brand-500 font-mono mt-2 uppercase tracking-widest">Connect your Tier-1 bank enclave to the Global Mesh.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['GTBank', 'Zenith Bank', 'Barclays UK', 'Chase US', 'Stanbic IBTC', 'Access Bank'].map(bank => (
                                            <button 
                                                key={bank}
                                                onClick={() => { setNodeForm({...nodeForm, bank}); setNodeWizardStep(2); }}
                                                className={`p-8 border rounded-sm text-left transition-all hover:border-brand-900 hover:bg-brand-50 group ${nodeForm.bank === bank ? 'border-brand-900 bg-brand-50 shadow-md ring-1 ring-brand-900' : 'border-brand-100'}`}
                                            >
                                                <Building className="w-10 h-10 text-brand-400 mb-6 group-hover:text-action-500 transition-colors" />
                                                <p className="text-sm font-black text-brand-900 uppercase tracking-tight">{bank}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {nodeWizardStep === 2 && (
                                <div className="space-y-10 animate-in slide-in-from-right-4">
                                    <div className="text-center">
                                        <h4 className="text-3xl font-black text-brand-900 uppercase tracking-tighter italic">2. Finalize Handshake</h4>
                                        <p className="text-[10px] text-brand-500 font-mono mt-2 uppercase tracking-widest">Target Node: {nodeForm.bank}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest block mb-3">Account Identification No.</label>
                                            <input 
                                                type="text" value={nodeForm.accountNo} onChange={e => setNodeForm({...nodeForm, accountNo: e.target.value})}
                                                className="w-full p-5 bg-brand-50 border border-brand-200 rounded-sm font-mono text-base outline-none focus:border-action-500 shadow-inner" 
                                                placeholder="0123456789"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-brand-400 uppercase tracking-widest block mb-3">Sort Code / Routing</label>
                                            <input 
                                                type="text" value={nodeForm.routing} onChange={e => setNodeForm({...nodeForm, routing: e.target.value})}
                                                className="w-full p-5 bg-brand-50 border border-brand-200 rounded-sm font-mono text-base outline-none focus:border-action-500 shadow-inner" 
                                                placeholder="00-11-22"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-brand-950 p-8 rounded-sm border border-brand-800 font-mono text-[10px] text-action-500 space-y-2 h-40 overflow-y-auto shadow-inner">
                                        {handshakeLogs.map((log, i) => <p key={i} className={i === handshakeLogs.length - 1 ? 'animate-pulse font-black' : 'opacity-60'}>{log}</p>)}
                                        {handshakeLogs.length === 0 && <p className="opacity-30">Awaiting authorization protocol...</p>}
                                    </div>

                                    <button 
                                        onClick={handleConnectNode}
                                        disabled={isWizardProcessing || !nodeForm.accountNo}
                                        className="w-full py-6 bg-brand-950 text-white font-black uppercase text-xs tracking-[0.5em] rounded-sm shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                                    >
                                        {isWizardProcessing ? <RefreshCw className="w-5 h-5 animate-spin text-action-500" /> : <><ShieldCheck className="w-5 h-5 text-action-500" /> Authorize Bilateral Mirror</>}
                                    </button>
                                </div>
                            )}

                            {nodeWizardStep === 3 && (
                                <div className="space-y-10 animate-in zoom-in-95 text-center py-12">
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                        <CheckCircle2 className="w-14 h-14" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-4">
                                        <h3 className="text-4xl font-black text-brand-900 uppercase tracking-tighter italic">Node Link Established</h3>
                                        <p className="text-brand-500 text-sm leading-relaxed uppercase tracking-widest font-bold">
                                            Account at <strong>{nodeForm.bank}</strong> officially committed to the Corporate Balance Sheet. Liquidity depth verified by Oracle.
                                        </p>
                                    </div>
                                    <button onClick={() => setIsConnectingNode(false)} className="w-full py-6 bg-brand-950 text-white font-black uppercase text-sm tracking-[0.4em] rounded-sm shadow-2xl hover:bg-black transition-all">Return to Control Deck</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
