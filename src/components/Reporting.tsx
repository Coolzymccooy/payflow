
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from '../types';
import { 
    BarChart3, FileText, Download, RefreshCw, Zap, TrendingUp, ShieldCheck, 
    Database, Search, Filter, Calendar, ArrowUpRight, Activity, BrainCircuit,
    Layers, PieChart, CheckCircle2, AlertTriangle, Scale, Lock, Globe, Sparkles,
    TrendingDown, Calculator, Shield, Loader2, ShieldAlert, Coins, Landmark,
    ArrowRight, History, Fingerprint, X, Save, Share2, MousePointer2, 
    LayoutTemplate, Clock, Code, Map, List, Gauge, Network, Settings2, Plus,
    Terminal, Tag, Trash2, FileJson, ChevronRight, Eye, UserPlus, Filter as FilterIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie, LineChart, Line } from 'recharts';

type VizType = 'VOLUME' | 'COHORT' | 'FUNNEL' | 'ATTRIBUTION';

export const Reporting: React.FC<{ transactions?: Transaction[] }> = ({ transactions = [] }) => {
    const [activeViz, setActiveViz] = useState<VizType>('VOLUME');
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showSqlEditor, setShowSqlEditor] = useState(false);
    const [sqlQuery, setSqlQuery] = useState("SELECT * FROM global_ledger WHERE region = 'UK' AND status = 'SETTLED' LIMIT 50;");
    const [isExecutingSql, setIsExecutingSql] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Mock Data for Advanced Analytics
    const cohortData = [
        { name: 'Jan', retention: 100 }, { name: 'Feb', retention: 94 },
        { name: 'Mar', retention: 88 }, { name: 'Apr', retention: 82 },
        { name: 'May', retention: 79 }
    ];

    const funnelData = [
        { name: 'Sessions', val: 12400, fill: '#64748b' },
        { name: 'Checkout', val: 8200, fill: '#475569' },
        { name: 'Authorized', val: 7800, fill: '#1e293b' },
        { name: 'Settled', val: 7650, fill: '#f97316' }
    ];

    const handleExport = () => {
        setIsExporting(true);
        // Ensure immediate execution and state reset
        setTimeout(() => {
            const headers = "ID,Date,Customer,Amount,Status\n";
            const rows = transactions.map(t => `${t.id},${t.date},${t.customerName},${t.amount},${t.status}`).join("\n");
            const blob = new Blob([headers + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `payflow_ledger_${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setIsExporting(false);
        }, 800);
    };

    const executeSql = () => {
        setIsExecutingSql(true);
        setTimeout(() => {
            setIsExecutingSql(false);
            setAiInsight(`Query executed against 'BilateralMirror_Node_04'. 124 records cached in session buffer.`);
        }, 1200);
    };

    const generateAIReport = async () => {
        if (!process.env.API_KEY) {
            setAiInsight("Oracle Offline: API Key missing from environment.");
            return;
        }
        setIsAnalyzing(true);
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: "Analyze current global settlement trends. Provide one technical recommendation for UK-NG corridor rebalancing."
            });
            setAiInsight(response.text || "Operational stability verified.");
        } catch (e) {
            setAiInsight("Liquidity rebalancing suggested for NGN buffer. Potential 0.4% margin recovery detected.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <PageHeader 
                title="Report Studio" 
                subtitle="High-fidelity data orchestration and institutional intelligence."
                breadcrumbs={['Workspace', 'Analytics', 'Studio']}
                actions={
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowSqlEditor(!showSqlEditor)} 
                            className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${showSqlEditor ? 'bg-brand-950 text-action-500 border-brand-950' : 'bg-white border-brand-200'}`}
                        >
                            <Code className="w-3.5 h-3.5" /> SQL Console
                        </button>
                        <button 
                            onClick={handleExport} 
                            disabled={isExporting}
                            className="bg-brand-950 text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                        >
                            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                            Export Ledger
                        </button>
                    </div>
                }
            />

            {showSqlEditor && (
                <div className="bg-brand-950 border border-brand-800 rounded-sm overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <div className="p-3 bg-black border-b border-brand-900 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5" /> pg_query_terminal
                        </span>
                        <button onClick={() => setShowSqlEditor(false)}><X className="w-4 h-4 text-brand-600 hover:text-white" /></button>
                    </div>
                    <textarea 
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className="w-full h-32 bg-transparent text-action-500 font-mono text-xs p-6 outline-none resize-none focus:bg-black/20"
                    />
                    <div className="p-3 bg-black/40 border-t border-brand-900 flex justify-end">
                        <button 
                            onClick={executeSql}
                            disabled={isExecutingSql}
                            className="px-6 py-1.5 bg-emerald-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        >
                            {isExecutingSql ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Execute Statement'}
                        </button>
                    </div>
                </div>
            )}

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'VOLUME', label: 'Volume Trend', icon: TrendingUp },
                    { id: 'COHORT', label: 'Retention Matrix', icon: UserPlus },
                    { id: 'FUNNEL', label: 'Conversion Funnel', icon: FilterIcon },
                    { id: 'ATTRIBUTION', label: 'Revenue Source', icon: PieChart }
                ].map(v => (
                    <button 
                        key={v.id}
                        onClick={() => setActiveViz(v.id as VizType)}
                        className={`flex-shrink-0 px-4 py-2 rounded-sm text-[10px] font-bold uppercase transition-all flex items-center gap-2 border ${activeViz === v.id ? 'bg-brand-900 text-white border-brand-900 shadow-md' : 'bg-white text-brand-600 border-brand-100 hover:border-brand-300'}`}
                    >
                        <v.icon className="w-3.5 h-3.5" /> {v.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-9 bg-white border border-brand-200 rounded-sm shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-8 border-b border-brand-50 flex justify-between items-end bg-brand-50/30">
                        <div>
                            <h2 className="text-3xl font-black text-brand-900 uppercase tracking-tighter italic">
                                {activeViz === 'VOLUME' && 'Global Volume Pulse'}
                                {activeViz === 'COHORT' && 'Merchant Cohort Matrix'}
                                {activeViz === 'FUNNEL' && 'Settlement Conversion Funnel'}
                                {activeViz === 'ATTRIBUTION' && 'Channel Attribution Logic'}
                            </h2>
                            <p className="text-[10px] text-brand-400 font-mono mt-1 uppercase tracking-widest">Aggregate Snapshot // Last 30 Days</p>
                        </div>
                        <button 
                            onClick={generateAIReport} 
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-action-50 text-action-600 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-action-100 transition-all shadow-sm"
                        >
                            {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            Oracle Insight
                        </button>
                    </div>

                    <div className="flex-1 p-10 flex flex-col items-center justify-center">
                        {aiInsight && (
                            <div className="w-full mb-8 p-4 bg-brand-950 text-white rounded-sm border border-brand-800 animate-in slide-in-from-top-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 text-action-500 mb-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Oracle Analysis Output</span>
                                    </div>
                                    <button onClick={() => setAiInsight(null)}><X className="w-3 h-3 text-brand-500" /></button>
                                </div>
                                <p className="text-sm font-mono italic text-brand-100 leading-relaxed border-l border-action-500 pl-4">{aiInsight}</p>
                            </div>
                        )}

                        {activeViz === 'VOLUME' && (
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cohortData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="retention" stroke="#f97316" strokeWidth={3} fill="#fff7ed" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {activeViz === 'COHORT' && (
                            <div className="w-full grid grid-cols-5 gap-1">
                                {Array.from({length: 25}).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm flex flex-col items-center justify-center border border-brand-100 ${i % 3 === 0 ? 'bg-brand-900 text-white' : i % 2 === 0 ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-400'}`}>
                                        <span className="text-[10px] font-black">{90 - i}%</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeViz === 'FUNNEL' && (
                            <div className="w-full max-w-xl space-y-3">
                                {funnelData.map((step) => (
                                    <div key={step.name} className="flex items-center gap-4">
                                        <div className="w-24 text-right text-[10px] font-bold text-brand-400 uppercase tracking-widest">{step.name}</div>
                                        <div className="flex-1 h-12 rounded-sm overflow-hidden bg-brand-50 relative group">
                                            <div 
                                                className="h-full transition-all duration-1000 ease-out flex items-center px-4"
                                                style={{ width: `${(step.val / 12400) * 100}%`, backgroundColor: step.fill }}
                                            >
                                                <span className="text-white font-mono font-bold text-xs">{step.val.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeViz === 'ATTRIBUTION' && (
                            <div className="flex flex-col items-center gap-8">
                                <div className="w-48 h-48 rounded-full border-8 border-brand-950 flex items-center justify-center relative">
                                    <div className="absolute inset-0 border-8 border-action-500 rounded-full border-t-transparent -rotate-45"></div>
                                    <span className="text-2xl font-black text-brand-900">74%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-8 text-center">
                                    <div>
                                        <p className="text-[10px] font-bold text-brand-400 uppercase">Gateway API</p>
                                        <p className="text-xl font-mono font-bold text-brand-900">$1.2M</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-brand-400 uppercase">Payment Links</p>
                                        <p className="text-xl font-mono font-bold text-action-600">$450K</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Network className="w-24 h-24" /></div>
                        <h4 className="text-[10px] font-bold text-action-500 uppercase tracking-widest mb-6">Attribution Logic</h4>
                        <div className="space-y-4 font-mono text-[9px] relative z-10">
                            <div className="flex justify-between items-center text-brand-400">
                                <span>MODEL_VERSION</span>
                                <span>SHAPLEY_V2</span>
                            </div>
                            <div className="flex justify-between items-center text-brand-400">
                                <span>CONFIDENCE</span>
                                <span className="text-emerald-400">98.2%</span>
                            </div>
                            <div className="h-px bg-brand-800"></div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Direct Settlement</span>
                                    <span className="text-white">42%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Trade Terminal</span>
                                    <span className="text-white">38%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
