
import React, { useState, useEffect } from 'react';
import { StatsCard } from './StatsCard';
import { PageHeader } from './PageHeader';
import { 
    Globe, DollarSign, Package, CreditCard, Activity, TrendingUp, 
    ArrowUpRight, Zap, RefreshCw, BarChart3, Database, ShieldCheck,
    Network, Server, Cpu, Crown, Sliders, CheckCircle2, AlertTriangle, ArrowRight,
    TrendingDown, FileDown, Presentation, Target
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardProps {
    treasuryBalance: number;
    transactionCount: number;
    linkCount: number;
    cardCount: number;
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ treasuryBalance, transactionCount, linkCount, cardCount, addNotification }) => {
    const [isExecutiveView, setIsExecutiveView] = useState(false);
    const [latency, setLatency] = useState(14);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 20) + 8);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleDownloadBoardReport = async () => {
        setIsDownloading(true);
        // Simulate generation lag
        await new Promise(r => setTimeout(r, 1500));
        
        const reportContent = `
PAYFLOW OS - EXECUTIVE BOARD SUMMARY
====================================
TIMESTAMP: ${new Date().toISOString()}
TREASURY_NAV: $${treasuryBalance.toLocaleString()}
ACTIVE_STREAMS: ${linkCount}
SETTLEMENT_VELOCITY: T+0
ORACLE_STATUS: OPTIMAL

STRATEGIC INSIGHT:
Current growth velocity (+24% MoM) suggests $100M exit 
potential by Q4 2026 if Tier-1 binding is maintained.
====================================
CONFIDENTIAL - AUTHORIZED ACCESS ONLY
        `;
        
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payflow_Board_Report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        
        setIsDownloading(false);
        if (addNotification) addNotification('Report Downloaded', 'The technical briefing is ready for review.', 'SUCCESS');
    };

    const handleSchedulePresentation = () => {
        if (addNotification) addNotification('Presentation Requested', 'A strategic manager will contact you within 2 hours.', 'INFO');
    };

    const data = [
        { name: '00:00', val: 400 }, { name: '04:00', val: 300 },
        { name: '08:00', val: 600 }, { name: '12:00', val: 800 },
        { name: '16:00', val: 700 }, { name: '20:00', val: 1100 },
        { name: '23:59', val: 950 },
    ];

    const healthMetrics = [
        { label: 'Liquidity Health', score: 98, status: 'Excellent', color: 'text-emerald-500' },
        { label: 'Operational Efficiency', score: 94, status: 'Strong', color: 'text-emerald-500' },
        { label: 'FX Risk Exposure', score: 72, status: 'Moderate', color: 'text-amber-500' },
        { label: 'Compliance Score', score: 96, status: 'Excellent', color: 'text-emerald-500' },
        { label: 'Customer Satisfaction', score: 91, status: 'Strong', color: 'text-emerald-500' },
    ];

    const benchmarks = [
        { label: 'Settlement Speed', payflow: 'T+0', industry: 'T+1', color: 'text-action-500' },
        { label: 'Transaction Success', payflow: '99.8%', industry: '97%', color: 'text-emerald-500' },
        { label: 'FX Spread', payflow: '0.8%', industry: '1.2%', color: 'text-emerald-500' },
        { label: 'Compliance Pass', payflow: '99.6%', industry: '94%', color: 'text-emerald-500' },
    ];

    if (isExecutiveView) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500 pb-20">
                <PageHeader 
                    title="Executive Suite" 
                    subtitle="Strategic overview for C-level governance and institutional transparency."
                    breadcrumbs={['System', 'Executive', 'Overview']}
                    status="SECURE"
                    actions={
                        <button 
                            onClick={() => setIsExecutiveView(false)}
                            className="bg-white border border-brand-200 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-brand-50 transition-all"
                        >
                            <Sliders className="w-3.5 h-3.5" /> Back to Terminal
                        </button>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><DollarSign className="w-24 h-24" /></div>
                        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Quarterly Revenue</p>
                        <p className="text-4xl font-mono font-bold text-brand-900">$2.4M</p>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3" /> +12% VS LAST QUARTER
                        </div>
                    </div>
                    <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Target className="w-24 h-24" /></div>
                        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Net Profit Margin</p>
                        <p className="text-4xl font-mono font-bold text-brand-900">18.2%</p>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-bold">
                            <ArrowUpRight className="w-3 h-3" /> +0.8pp VS LAST QUARTER
                        </div>
                    </div>
                    <div className="bg-brand-950 p-8 rounded-sm shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp className="w-24 h-24" /></div>
                        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Growth Velocity</p>
                        <p className="text-4xl font-mono font-bold text-white tracking-tighter">+24% <span className="text-lg text-brand-500">MoM</span></p>
                        <div className="mt-4 flex items-center gap-2 text-action-500 text-[10px] font-bold uppercase tracking-widest">
                            <RefreshCw className="w-3 h-3 animate-spin" /> 🔥 STRONG_ACCELERATION
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Health Scorecard */}
                    <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm">
                        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <ShieldCheck className="w-5 h-5 text-emerald-500" /> Organizational Health Scorecard
                        </h3>
                        <div className="space-y-6">
                            {healthMetrics.map(m => (
                                <div key={m.label} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] font-bold text-brand-700 uppercase">{m.label}</span>
                                        <div className="text-right">
                                            <span className="text-xs font-mono font-black text-brand-900">{m.score}/100</span>
                                            <span className={`text-[9px] font-bold uppercase ml-2 ${m.color}`}>{m.status}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-brand-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${m.color.replace('text-', 'bg-')}`} style={{width: `${m.score}%`}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benchmarking */}
                    <div className="bg-brand-950 text-white p-8 rounded-sm shadow-2xl border border-brand-800">
                        <h3 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                           <Activity className="w-5 h-5" /> Institutional Benchmarking
                        </h3>
                        <div className="space-y-4">
                            {benchmarks.map(b => (
                                <div key={b.label} className="p-4 bg-brand-900/40 border border-brand-800 rounded-sm flex justify-between items-center group hover:border-brand-600 transition-all">
                                    <span className="text-xs font-bold text-brand-400 uppercase tracking-tight">{b.label}</span>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className={`text-sm font-mono font-bold ${b.color}`}>{b.payflow}</p>
                                            <p className="text-[8px] text-brand-500 uppercase font-bold">Payflow</p>
                                        </div>
                                        <div className="w-px h-6 bg-brand-800"></div>
                                        <div className="text-right">
                                            <p className="text-sm font-mono font-bold text-white opacity-50">{b.industry}</p>
                                            <p className="text-[8px] text-brand-500 uppercase font-bold">Industry</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-brand-900 flex flex-col md:flex-row gap-4">
                            <button 
                                onClick={handleDownloadBoardReport}
                                disabled={isDownloading}
                                className="flex-1 py-4 bg-white text-brand-950 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-100 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                            >
                                {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                                Download Board Report
                            </button>
                            <button 
                                onClick={handleSchedulePresentation}
                                className="flex-1 py-4 bg-brand-900 border border-brand-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-3"
                            >
                                <Presentation className="w-4 h-4" /> Schedule Presentation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <PageHeader 
                title="Command Deck" 
                subtitle="Real-time synchronization of global liquidity nodes and settlement rails."
                breadcrumbs={['System', 'Overview', 'Dashboard']}
                status="LIVE"
                actions={
                    <button 
                        onClick={() => setIsExecutiveView(true)}
                        className="bg-brand-950 text-action-500 border border-brand-900 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl"
                    >
                        <Crown className="w-3.5 h-3.5 fill-current" /> Executive View
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total NAV" 
                    value={`$${treasuryBalance.toLocaleString()}`} 
                    change="+12.5%" 
                    isPositive={true} 
                    variant="emerald"
                    icon={<Database className="w-5 h-5" />}
                />
                <StatsCard 
                    title="Volume (24H)" 
                    value={`$${(transactionCount * 450).toLocaleString()}`} 
                    change="+4.2%" 
                    isPositive={true} 
                    variant="blue"
                    icon={<Activity className="w-5 h-5" />}
                />
                <StatsCard 
                    title="Active Streams" 
                    value={linkCount.toString()} 
                    change="+2" 
                    isPositive={true} 
                    variant="violet"
                    icon={<Package className="w-5 h-5" />}
                />
                <StatsCard 
                    title="Risk Factor" 
                    value="Low" 
                    change="0.02%" 
                    isPositive={false} 
                    variant="rose"
                    icon={<ShieldCheck className="w-5 h-5" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-brand-100 p-8 rounded-sm shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                           <TrendingUp className="w-4 h-4 text-action-500" /> Settlement Velocity (ms)
                        </h3>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-sm border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-black text-emerald-700 uppercase">Live Pulse</span>
                           </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono'}} />
                                <Tooltip contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', boxShadow: 'none' }} />
                                <Area type="monotone" dataKey="val" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Network className="w-24 h-24" /></div>
                        <div className="flex items-center gap-2 text-action-500 mb-6">
                            <Globe className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Global Health Index</span>
                        </div>
                        <div className="space-y-6 font-mono text-[10px]">
                            <div className="flex justify-between items-center">
                                <span className="text-brand-500 uppercase flex items-center gap-2"><Server className="w-3 h-3"/> NGN_SWIFT_RAIL</span>
                                <span className="text-emerald-400 font-bold">99.9%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-brand-500 uppercase flex items-center gap-2"><Cpu className="w-3 h-3"/> GBP_TREASURY_SYNC</span>
                                <span className="text-emerald-400 font-bold">OPTIMAL</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-brand-500 uppercase flex items-center gap-2"><Zap className="w-3 h-3"/> USD_SETTLE_CAP</span>
                                <span className="text-white font-bold">$100M</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-brand-900">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] text-brand-500 font-bold uppercase">System Latency</p>
                                    <p className="text-xl font-bold font-mono">{latency}ms</p>
                                </div>
                                <Activity className="w-6 h-6 text-action-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
