
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { BackendService } from '../services/backend';
import { RemittanceRecord, AutonomyLevel } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
    Globe, Activity, ShieldAlert, CheckCircle2, History, X, 
    RefreshCw, Filter, Search, ArrowRight, ArrowDown, Map, 
    Lock, ShieldCheck, Scale, Database, Zap, Fingerprint,
    Loader2, AlertCircle, PlayCircle, StopCircle, Eye, User, Landmark,
    Sliders, Gauge, BrainCircuit, Target, Siren, TrendingUp, TrendingDown,
    Network, Server, Shield, Cpu, Sparkles, BarChart3, AlertTriangle, ToggleLeft, ToggleRight
} from 'lucide-react';

interface RemittanceHubProps {
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const RemittanceHub: React.FC<RemittanceHubProps> = ({ addNotification }) => {
    const [remittances, setRemittances] = useState<RemittanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRemit, setSelectedRemit] = useState<RemittanceRecord | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>(AutonomyLevel.LEVEL_1_RECOMMEND);
    const [isAuditMode, setIsAuditMode] = useState(false);
    const [oracleHypotheses, setOracleHypotheses] = useState<string[]>([]);
    
    // Sentinel specific state
    const [isRebalancingSentinel, setIsRebalancingSentinel] = useState(false);
    const [showSentinelAlert, setShowSentinelAlert] = useState(true);

    // Institutional Node Intelligence (Moved to state to allow dynamic updates)
    const [localNodes, setLocalNodes] = useState([
        { id: 'NG-LAG-01', label: 'Lagos Hub', status: 'HEALTHY', speed: 'T+0', liquidity: 0.94 },
        { id: 'UK-LND-02', label: 'London Edge', status: 'CONSTRAINED', speed: 'T+0', liquidity: 0.72 },
        { id: 'US-NYC-01', label: 'NY Reserve', status: 'HEALTHY', speed: 'T+0', liquidity: 0.99 },
        { id: 'GH-ACC-01', label: 'Accra Node', status: 'AT_RISK', speed: 'T+1', liquidity: 0.45 },
    ]);

    const fetchRemittances = async () => {
        setIsLoading(true);
        const data = await BackendService.getRemittances();
        setRemittances(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRemittances();
        
        // Oracle Live Hypothesis Generation
        const timer = setInterval(() => {
            const h = [
                "Detected liquidity drain in UK corridor. Auto-rebalancing proposed from NYC Reserve.",
                "Sanctions update processed for Node GH-ACC. Throttling high-value flows.",
                "Volatility spike in NGN/GBP (14ms shift). Increasing mirror buffer by 2.4%.",
                "Cluster found: 3 transfers to Standbic ID matched AML pattern #224."
            ];
            setOracleHypotheses(prev => [h[Math.floor(Math.random() * h.length)], ...prev].slice(0, 4));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await BackendService.updateRemittanceStatus(id, status);
        if (result && result.success) {
            setRemittances(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
            if (selectedRemit?.id === id) setSelectedRemit({ ...selectedRemit, status: status as any });
        }
    };

    const handleSentinelRebalance = async () => {
        setIsRebalancingSentinel(true);
        
        // Institutional Simulation: Multi-Node Handshake
        await new Promise(r => setTimeout(r, 2000));
        
        // Update Local State for Node UK-LND-02
        setLocalNodes(prev => prev.map(node => 
            node.id === 'UK-LND-02' ? { ...node, status: 'HEALTHY', liquidity: 0.96 } : node
        ));

        // Close Alert
        setShowSentinelAlert(false);
        setIsRebalancingSentinel(false);

        if (addNotification) {
            addNotification(
                'Rebalance Successful', 
                'Node UK-LND-02 buffer restored via NYC-01 reserve swap.', 
                'SUCCESS'
            );
        }
    };

    const filtered = remittances.filter(r => filterStatus === 'ALL' || r.status === filterStatus);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'SETTLED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'FROZEN': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'THROTTLED': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'QUEUED': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-brand-50 text-brand-500 border-brand-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex justify-between items-center bg-brand-950 px-8 py-4 border-b border-brand-800 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-action-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Autonomy State:</span>
                    </div>
                    <div className="flex gap-2 bg-black/40 p-1 rounded-sm border border-brand-800">
                        {Object.values(AutonomyLevel).map(lvl => (
                            <button 
                                key={lvl}
                                onClick={() => setAutonomyLevel(lvl)}
                                className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase transition-all ${autonomyLevel === lvl ? 'bg-action-500 text-white shadow-lg' : 'text-brand-600 hover:text-brand-300'}`}
                            >
                                {lvl.split('_')[1]}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Audit Mode:</span>
                        <button 
                            onClick={() => setIsAuditMode(!isAuditMode)}
                            className={`p-1 rounded-sm transition-all ${isAuditMode ? 'text-emerald-400' : 'text-brand-700'}`}
                        >
                            {isAuditMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </div>

            <PageHeader 
                title="Remittance Governance Deck" 
                subtitle="Institutional command center for global liquidity mirroring and corridor health orchestration."
                breadcrumbs={['Treasury', 'Liquidity', 'Remittance Hub']}
                status="LIVE"
                actions={
                    <button onClick={fetchRemittances} className="p-2 bg-white border border-brand-200 rounded-sm hover:bg-brand-50 transition-colors">
                        <RefreshCw className={`w-4 h-4 text-brand-500 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Intelligence Section */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Live Corridor Radar */}
                    <div className="bg-brand-950 p-10 rounded-sm text-white border border-brand-800 shadow-2xl relative overflow-hidden h-[300px]">
                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                        <div className="absolute top-6 left-8 z-10">
                            <span className="text-[11px] font-black text-action-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                <Activity className="w-4 h-4 animate-pulse" /> Global_Liquidity_Mesh_Pulse
                            </span>
                            <p className="text-[9px] text-brand-500 font-mono mt-1 uppercase tracking-widest italic">Monitoring 14 Sovereign Edge Nodes</p>
                        </div>

                        <div className="relative h-full flex items-center justify-around px-12">
                            {localNodes.map((node, i) => (
                                <div key={node.id} className="flex flex-col items-center gap-4 relative group cursor-help">
                                    <div className="relative">
                                        {/* Visual Pulse for health */}
                                        <div className={`absolute inset-0 rounded-full border-2 animate-ping opacity-20 ${node.status === 'HEALTHY' ? 'border-emerald-500' : node.status === 'AT_RISK' ? 'border-rose-500' : 'border-amber-500'}`}></div>
                                        <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all group-hover:scale-110 ${node.status === 'HEALTHY' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : node.status === 'AT_RISK' ? 'bg-rose-500/10 border-rose-500/40 text-rose-500' : 'bg-amber-500/10 border-amber-500/40 text-amber-500'}`}>
                                            <Landmark className="w-7 h-7" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-white tracking-tighter uppercase">{node.label}</p>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <span className="text-[8px] font-mono text-brand-500">{node.speed}</span>
                                            <div className="h-0.5 w-8 bg-brand-900 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-1000 ${node.liquidity > 0.8 ? 'bg-emerald-500' : node.liquidity > 0.5 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${node.liquidity*100}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Tooltip on Hover */}
                                    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-black border border-brand-800 p-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                        <p className="text-[9px] font-black text-action-500 uppercase border-b border-brand-900 pb-2 mb-2">{node.id}</p>
                                        <div className="space-y-1 font-mono text-[8px]">
                                            <p className="flex justify-between"><span>Status</span> <span className={node.status === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}>{node.status}</span></p>
                                            <p className="flex justify-between"><span>Liquidity Depth</span> <span className="text-white">{(node.liquidity*100).toFixed(0)}%</span></p>
                                            <p className="flex justify-between"><span>Settle Latency</span> <span className="text-white">14ms</span></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Table */}
                    <div className="bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 bg-brand-50 border-b border-brand-100 flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex gap-2">
                                {['ALL', 'PENDING', 'SETTLED', 'QUEUED', 'THROTTLED', 'FROZEN'].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border transition-all ${filterStatus === s ? 'bg-brand-950 text-white border-brand-950 shadow-md' : 'bg-white text-brand-400 border-brand-200 hover:border-brand-500'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="relative max-w-sm w-full md:w-64">
                                <Search className="w-3.5 h-3.5 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" placeholder="Search ref or sender..." className="w-full pl-9 pr-4 py-2 border border-brand-200 rounded-sm text-[10px] font-mono outline-none focus:border-action-500 focus:bg-brand-50/30" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left table-fixed">
                                <thead className="bg-white border-b border-brand-100">
                                    <tr className="text-[10px] font-black text-brand-400 uppercase tracking-widest">
                                        <th className="px-6 py-4 w-32">Reference</th>
                                        <th className="px-6 py-4 w-28">Corridor</th>
                                        <th className="px-6 py-4 w-40">Identity</th>
                                        <th className="px-6 py-4 w-32">Net_Value</th>
                                        <th className="px-6 py-4 w-24">Risk_ACT</th>
                                        <th className="px-6 py-4 w-32">Oracle_Action</th>
                                        <th className="px-6 py-4 w-28">State</th>
                                        <th className="px-6 py-4 w-24 text-right">Ops</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-50">
                                    {isLoading ? (
                                        <tr><td colSpan={8} className="p-20 text-center text-brand-400 italic font-mono text-xs"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" />Syncing Sovereign Ledger...</td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr><td colSpan={8} className="p-20 text-center text-brand-400 italic font-mono text-xs">Zero flows detected in current scope.</td></tr>
                                    ) : (
                                        filtered.map(remit => (
                                            <tr key={remit.id} onClick={() => setSelectedRemit(remit)} className="hover:bg-brand-50 transition-colors cursor-pointer group border-l-2 border-transparent hover:border-action-500">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-[10px] font-black text-brand-950">{remit.id}</span>
                                                        <span className="text-[8px] text-brand-300 font-mono mt-0.5">{new Date(remit.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black text-brand-900 uppercase italic tracking-tighter">{remit.corridor}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-[11px] font-bold text-brand-900 truncate uppercase">{remit.sender.name}</span>
                                                        {isAuditMode && <span className="text-[8px] text-brand-400 font-mono truncate">{remit.sender.idType}: {remit.sender.idNumber}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-brand-950 font-mono tabular-nums">{remit.amountTo.toLocaleString(undefined, {maximumFractionDigits: 0})} {remit.currencyTo}</span>
                                                        <span className={`text-[8px] font-bold uppercase tracking-tighter ${remit.impact === 'HIGH' ? 'text-rose-500' : 'text-brand-400'}`}>Impact: {remit.impact}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1 w-10 rounded-full bg-brand-100 overflow-hidden`}>
                                                            <div className={`h-full ${remit.riskScore > 90 ? 'bg-emerald-500' : remit.riskScore > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${remit.riskScore}%`}}></div>
                                                        </div>
                                                        <span className={`text-[10px] font-black font-mono ${remit.riskScore > 90 ? 'text-emerald-600' : 'text-rose-500'}`}>{remit.riskScore}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-brand-800 uppercase italic truncate">{remit.autoAction || 'Awaiting Intent'}</span>
                                                        <span className="text-[8px] font-bold text-emerald-600">Conf: {(remit.aiConfidence || 0.95) * 100}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase border transition-all ${getStatusColor(remit.status)}`}>
                                                        {remit.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {remit.status === 'PENDING' && (
                                                            <>
                                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(remit.id, 'FROZEN'); }} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-sm" title="HSM Halt"><StopCircle className="w-4 h-4" /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleUpdateStatus(remit.id, 'SETTLED'); }} className="p-1.5 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-sm" title="Manual Settle"><PlayCircle className="w-4 h-4" /></button>
                                                            </>
                                                        )}
                                                        <button className="p-1.5 text-brand-300 hover:text-brand-900"><Eye className="w-4 h-4" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Intelligent Intelligence Rail */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Solvency Profile */}
                    <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                        <h4 className="text-[10px] font-bold text-action-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                            <Scale className="w-4 h-4" /> Solvency Brain
                        </h4>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[9px] text-brand-500 font-black uppercase">Aggregate Pending Flow</p>
                                <p className="text-3xl font-mono font-bold text-white tracking-tighter">
                                    ${filtered.filter(r=>r.status==='PENDING').reduce((a,c)=>a+c.amountFrom,0).toLocaleString()}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-brand-900 rounded-sm border border-brand-800">
                                    <p className="text-[8px] text-brand-500 font-bold uppercase mb-1">UK-&gt;NG Health</p>
                                    <p className="text-base font-mono font-black text-emerald-400">92/100</p>
                                </div>
                                <div className="p-3 bg-brand-900 rounded-sm border border-brand-800">
                                    <p className="text-[8px] text-brand-500 font-bold uppercase mb-1">US-&gt;NG Health</p>
                                    <p className="text-base font-mono font-black text-emerald-400">98/100</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-brand-800">
                                <p className="text-[9px] font-black text-action-500 uppercase flex items-center gap-2 mb-3"><Sparkles className="w-3 h-3" /> Oracle Forecast</p>
                                <div className="p-4 bg-brand-900/40 border border-brand-800 rounded-sm italic">
                                    <p className="text-[10px] text-brand-300 leading-relaxed font-medium">
                                        "Naira liquidity volatility projected to decrease by 4.2% over next 6 hours. High-confidence clearing authorized."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Oracle Reasoning Feed */}
                    <div className="bg-brand-950 border border-brand-800 rounded-sm shadow-xl flex flex-col h-[400px]">
                        <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-action-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Hypotheses</span>
                            </div>
                            <span className="text-[8px] font-mono text-brand-600 uppercase">MESH_V5.4</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {oracleHypotheses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center opacity-20">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest">Waking Oracle...</p>
                                </div>
                            ) : (
                                oracleHypotheses.map((h, i) => (
                                    <div key={i} className={`p-3 rounded-sm border font-mono text-[9px] transition-all duration-1000 animate-in slide-in-from-left-2 ${i === 0 ? 'bg-action-500/5 border-action-500/30 text-action-500' : 'bg-transparent border-brand-900 text-brand-500 opacity-60'}`}>
                                        <p className="leading-relaxed">&gt;&gt; {h}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-3 bg-black/40 border-t border-brand-900 text-center">
                            <button className="text-[8px] font-black text-brand-400 uppercase tracking-widest hover:text-white transition-colors">Clear Reasoning Cache</button>
                        </div>
                    </div>

                    {/* Sentinel Alerts */}
                    {showSentinelAlert && (
                    <div className="bg-white border border-brand-100 p-5 rounded-sm shadow-sm relative overflow-hidden group animate-in slide-in-from-right-4">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity"><Siren className="w-16 h-16 text-rose-500" /></div>
                        <div className="flex items-center gap-2 mb-6">
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                            <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest">Sentinel Watchtower</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-black text-rose-600 uppercase">Liquidity Anomaly</p>
                                    <span className="text-[8px] font-bold text-rose-400 font-mono">14:42 UTC</span>
                                </div>
                                <p className="text-[10px] text-rose-700 leading-relaxed font-medium">Node UK-LND-02 showing 12% drain in Naira buffer. Suggest immediate swap from USD NYC Reserve.</p>
                                <button 
                                    onClick={handleSentinelRebalance}
                                    disabled={isRebalancingSentinel}
                                    className="mt-3 w-full py-2 bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isRebalancingSentinel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 fill-current" />}
                                    {isRebalancingSentinel ? 'Executing Handshake...' : 'Execute Rebalance'}
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Enhanced Dossier Modal */}
            {selectedRemit && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-3xl" onClick={() => setSelectedRemit(null)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-4xl rounded-sm overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="bg-brand-900 text-white p-6 flex justify-between items-center border-b border-brand-800">
                            <div className="flex items-center gap-4">
                                <div className="bg-action-500 p-2 rounded-sm"><ShieldCheck className="w-6 h-6 text-white" /></div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter italic">Movement Dossier: {selectedRemit.id}</h3>
                                    <p className="text-[9px] font-mono text-brand-500 uppercase tracking-widest">Oracle Identity Verified // Audit Grade: A+</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedRemit(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-brand-500" /></button>
                        </div>

                        <div className="p-12 overflow-y-auto flex-1 space-y-12 scrollbar-hide">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-4">Sender Profile</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-brand-50 rounded-sm border border-brand-100 flex items-center justify-center text-brand-300 font-bold text-2xl uppercase">
                                            {selectedRemit.sender.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-brand-900 uppercase tracking-tight leading-none">{selectedRemit.sender.name}</p>
                                            <p className="text-xs text-brand-500 font-mono mt-1">{selectedRemit.sender.phone}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-brand-50 rounded-sm space-y-3 text-[11px] font-mono text-brand-600">
                                        <div className="flex justify-between border-b border-brand-100 pb-2"><span>ID_TYPE</span> <span className="font-bold">{selectedRemit.sender.idType}</span></div>
                                        <div className="flex justify-between border-b border-brand-100 pb-2"><span>ID_VALUE</span> <span className="font-bold">{selectedRemit.sender.idNumber}</span></div>
                                        <div className="flex justify-between"><span>FUND_SOURCE</span> <span className="font-bold text-action-600">{selectedRemit.sender.source}</span></div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-4">Beneficiary Node</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-brand-950 rounded-sm border border-brand-800 flex items-center justify-center text-action-500">
                                            <Landmark className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-brand-900 uppercase tracking-tight leading-none">{selectedRemit.beneficiary.name}</p>
                                            <p className="text-xs text-brand-500 font-mono mt-1">{selectedRemit.beneficiary.bank}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-brand-950 text-white rounded-sm space-y-3 text-[11px] font-mono border border-brand-800">
                                        <div className="flex justify-between border-b border-brand-800 pb-2 text-brand-500 italic"><span>Account_Identification</span> <span className="font-bold text-white">{selectedRemit.beneficiary.accountNo}</span></div>
                                        <div className="flex justify-between text-brand-500 italic"><span>Settlement_Rail</span> <span className="font-bold text-emerald-400 uppercase tracking-tighter">Payflow_Mesh_T+0</span></div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-4">Intelligence Audit</h4>
                                    <div className="space-y-4">
                                        <div className="p-6 bg-brand-950 border border-brand-800 rounded-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></div>
                                            <p className="text-[10px] font-bold text-brand-500 uppercase mb-2">Compliance Rating</p>
                                            <p className="text-3xl font-mono font-bold text-emerald-500">{selectedRemit.complianceStatus}</p>
                                            <p className="text-[9px] text-brand-600 mt-2 font-mono uppercase">&gt;&gt; AML_CLEAR_SHA256_V2</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-4 border border-brand-100 rounded-sm bg-brand-50">
                                                <p className="text-[9px] font-bold text-brand-400 uppercase mb-1">Risk Score</p>
                                                <p className={`text-xl font-mono font-black ${selectedRemit.riskScore > 80 ? 'text-emerald-600' : 'text-rose-500'}`}>{selectedRemit.riskScore}</p>
                                            </div>
                                            <div className="p-4 border border-brand-100 rounded-sm bg-brand-50">
                                                <p className="text-[9px] font-bold text-brand-400 uppercase mb-1">Liquidity Impact</p>
                                                <p className="text-lg font-mono font-black text-brand-900">{selectedRemit.impact}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 bg-brand-50 p-10 border border-brand-200 rounded-sm items-center">
                                <div className="md:col-span-8 space-y-2">
                                    <h4 className="text-xs font-black text-brand-900 uppercase tracking-widest flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-action-500" /> Settlement Parameters
                                    </h4>
                                    <div className="flex gap-12 items-end pt-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-400 uppercase">Rate Logic</p>
                                            <p className="text-3xl font-mono font-bold text-brand-900 tracking-tighter">{selectedRemit.rate.toFixed(2)} <span className="text-xs text-brand-400">{selectedRemit.currencyTo}/{selectedRemit.currencyFrom}</span></p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-400 uppercase">Settlement Net</p>
                                            <p className="text-3xl font-mono font-black text-emerald-600 tracking-tighter">{selectedRemit.amountTo.toLocaleString()} {selectedRemit.currencyTo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-4 flex flex-col gap-3">
                                    {selectedRemit.status === 'FROZEN' ? (
                                        <button onClick={() => handleUpdateStatus(selectedRemit.id, 'PENDING')} className="w-full py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-sm flex items-center justify-center gap-3 hover:bg-emerald-700 shadow-xl transition-all active:scale-98"><PlayCircle className="w-5 h-5" /> Release Mirror</button>
                                    ) : (
                                        <button onClick={() => handleUpdateStatus(selectedRemit.id, 'FROZEN')} className="w-full py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-sm flex items-center justify-center gap-3 hover:bg-rose-700 shadow-xl transition-all active:scale-98"><StopCircle className="w-5 h-5" /> Halt Movement</button>
                                    )}
                                    <button onClick={() => handleUpdateStatus(selectedRemit.id, 'CANCELLED')} className="w-full py-4 border border-brand-200 text-brand-500 font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-brand-100 transition-colors">Abort & Recover Capital</button>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-brand-100 flex flex-wrap gap-8 items-center text-[10px] font-mono text-brand-400 uppercase tracking-widest">
                                <div className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> HSM_SIGNATURE_OK</div>
                                <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> AES_256_GCM_ENCRYPTED</div>
                                <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> GEO_RES_MATCH: LAGOS_NODE_01</div>
                                <div className="ml-auto flex items-center gap-2 text-brand-900 font-bold"><Database className="w-4 h-4" /> RECONCILIATION_MATCH: 100%</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
