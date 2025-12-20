
import React, { useState, useEffect } from 'react';
import { StatsCard } from './StatsCard';
import { PageHeader } from './PageHeader';
import DashboardAiInsightsCard from "./DashboardAiInsightsCard";
import { 
    Globe, DollarSign, Package, CreditCard, Activity, TrendingUp, 
    ArrowUpRight, Zap, RefreshCw, BarChart3, Database, ShieldCheck,
    Network, Server, Cpu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    treasuryBalance: number;
    transactionCount: number;
    linkCount: number;
    cardCount: number;
}

const PROMPT = ">>> ";

export const Dashboard: React.FC<DashboardProps> = ({ treasuryBalance, transactionCount, linkCount, cardCount }) => {
    const [latency, setLatency] = useState(14);

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(Math.floor(Math.random() * 20) + 8);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const data = [
        { name: '00:00', val: 400 }, { name: '04:00', val: 300 },
        { name: '08:00', val: 600 }, { name: '12:00', val: 800 },
        { name: '16:00', val: 700 }, { name: '20:00', val: 1100 },
        { name: '23:59', val: 950 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <PageHeader 
                title="Command Deck" 
                subtitle="Real-time synchronization of global liquidity nodes and settlement rails."
                breadcrumbs={['System', 'Overview', 'Dashboard']}
                status="LIVE"
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
                            <div className="flex justify-between items-center group/item cursor-help">
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
                    <DashboardAiInsightsCard
  umbrellaId="GLB-HQ"
  defaultPrompt="Summarise today's treasury position and give 5 concrete actions. Keep it concise."
  context={{
    page: "dashboard",
    treasuryBalance,
    transactionCount,
    linkCount,
    cardCount,
    latency,
  }}
/>


                    <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5"><Activity className="w-16 h-16" /></div>
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest mb-4">Quick Diagnostic</h4>
                        <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-sm border border-brand-200">
                           <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                           <p className="text-[9px] font-mono text-brand-600 uppercase leading-relaxed font-bold">
                              {PROMPT}24 HSM HANDSHAKES COMPLETED.<br/>
                              {PROMPT}ZERO DATA LEAKAGE DETECTED.<br/>
                              {PROMPT}ORACLE SYNC: NOMINAL.
                           </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
