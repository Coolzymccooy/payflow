
import React, { useState } from 'react';
import { 
    ChevronLeft, ChevronRight, X, Globe, Zap, ShieldCheck, TrendingUp, 
    ArrowRight, Crown, Users, Database, PieChart, Layout, Landmark, 
    Sparkles, Terminal, Activity, BarChart3, Coins, Rocket, Download, FileDown, Lock, CheckCircle2,
    RefreshCw, FileText
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface PitchDeckProps {
    onExit: () => void;
}

export const PitchDeck: React.FC<PitchDeckProps> = ({ onExit }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);

    const growthData = [
        { year: 'Q1 25', val: 120 }, { year: 'Q2 25', val: 280 }, 
        { year: 'Q3 25', val: 540 }, { year: 'Q4 25', val: 1200 },
        { year: 'Q1 26', val: 4500 }
    ];

    const slides = [
        {
            title: "THE NEXUS",
            subtitle: "Global Commerce OS",
            content: "Payflow OS is the world’s first AI-native Operating System for Global Commerce. We integrate Collections, Treasury, and Payroll into a single high-fidelity intelligence mesh.",
            icon: Sparkles,
            metrics: ["$1.2M+ MoV", "99.9% Up", "T+0 Setl"]
        },
        {
            title: "THE $100B FRICTION",
            subtitle: "Fragmentation Gap",
            content: "Merchants lose 4.2% annually to 'Fintech Fragmentation'. Managing disjointed tools for Naira collections and USD treasury creates critical settlement lag.",
            icon: Activity,
            bullets: ["Cross-border latency", "4.2% Leakage", "Data Disconnect"]
        },
        {
            title: "THE SOLUTION",
            subtitle: "Financial Switch",
            content: "Our architecture mirrors Tier-1 banking ledgers in real-time. By utilizing Gemini-3 for trade reasoning, we eliminate cross-border friction entirely.",
            icon: Zap,
            highlight: "Autonomous Liquidity Rebalancing (ALR) is the core differentiator."
        },
        {
            title: "THE MARKET",
            subtitle: "Hyper-Growth SSA",
            content: "Capturing the $500B Africa-Europe trade corridor. Providing institutional rails to global MSMEs and Enterprises across 14 active regions.",
            icon: Globe,
            metrics: ["2,000+ Merchants", "14 Active Nodes", "18% MoM Growth"]
        },
        {
            title: "GROWTH PROJECTION",
            subtitle: "The $100M Path",
            content: "Upgrading from a payment gateway to a Regulated Global Switch by 2026. Institutional strategic LP agreements turn Payflow into a sovereign settlement network.",
            chart: true,
            icon: TrendingUp
        },
        {
            title: "THE EXIT",
            subtitle: "Strategic M&A",
            content: "Primary acquisition target for Global Banks seeking SSA footprint. Our dual HSM-encryption and AI Oracle provide the compliance moat for Tier-1 exit multiples.",
            icon: Crown,
            metrics: ["PCI-DSS L1", "ISO-27001", "HSM Enclave"]
        }
    ];

    const next = () => setCurrentSlide(prev => (prev + 1) % slides.length);
    const prev = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

    const handleDownload = async () => {
        setIsDownloading(true);
        await new Promise(r => setTimeout(r, 2000));
        
        const summary = `
=========================================
PAYFLOW STRATEGIC BRIEFING [CONFIDENTIAL]
=========================================
VERSION: 4.1_SOVEREIGN
AUTH_TIMESTAMP: ${new Date().toISOString()}
SECURITY_SIGNATURE: HSM_NODE_04_SIGNED

EXECUTIVE SUMMARY:
Payflow OS integrates global collections, treasury, 
and payroll into a unified AI-Intelligence Mesh.

CORE PROPOSITIONS:
- Autonomous Liquidity Rebalancing (ALR)
- T+0 Instant Settlement via Direct Bank Mirrors
- $100M M&A Exit Roadmap via Tier-1 Banks

This document is cryptographically bound to the 
active organizational terminal.
=========================================
        `;
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Payflow_Strategic_Roadmap.txt';
        a.click();
        
        setIsDownloading(false);
        setDownloadComplete(true);
        setTimeout(() => setDownloadComplete(false), 3000);
    };

    const slide = slides[currentSlide];

    return (
        <div className="fixed inset-0 z-[500] bg-black text-white flex flex-col font-sans animate-in fade-in duration-700 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/10 bg-brand-950/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-action-500 p-2 rounded-sm shadow-[0_0_20px_rgba(249,115,22,0.3)]"><Rocket className="w-5 h-5 text-white" /></div>
                    <span className="font-mono font-bold tracking-widest text-[10px] uppercase">PAYFLOW_STRATEGIC_BRIEF_v4.1</span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${downloadComplete ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                    >
                        {isDownloading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : downloadComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                        {isDownloading ? 'Encrypting...' : downloadComplete ? 'Roadmap Downloaded' : 'Institutional Roadmap'}
                    </button>
                    <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6 text-brand-400" /></button>
                </div>
            </div>

            {/* Slide Body - Fixed for True-to-View Scaling */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden flex items-center justify-center">
                    <h1 className="text-[25vw] font-black leading-none select-none">MESH</h1>
                </div>

                <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                    <div className="space-y-6 md:space-y-8 animate-in slide-in-from-left-8 duration-500">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-action-500/30 text-action-500 mb-4 md:mb-6 bg-action-500/5">
                                <slide.icon className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{slide.title}</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-none mb-4 md:mb-6 italic">{slide.subtitle}</h2>
                            <p className="text-brand-400 text-base md:text-xl lg:text-2xl leading-relaxed font-medium max-w-xl">
                                {slide.content}
                            </p>
                        </div>

                        {slide.metrics && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {slide.metrics.map(m => (
                                    <div key={m} className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-sm">
                                        <p className="text-action-500 font-mono font-black text-lg lg:text-xl tracking-tighter uppercase whitespace-nowrap">{m}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {slide.bullets && (
                            <div className="space-y-4">
                                {slide.bullets.map(b => (
                                    <div key={b} className="flex items-center gap-4 text-brand-300 font-mono text-sm uppercase">
                                        <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                        {b}
                                    </div>
                                ))}
                            </div>
                        )}

                        {slide.highlight && (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-sm">
                                <p className="text-emerald-400 font-bold italic text-sm md:text-base">"{slide.highlight}"</p>
                            </div>
                        )}
                    </div>

                    <div className="relative animate-in zoom-in-95 duration-700 delay-200 flex items-center justify-center">
                        {slide.chart ? (
                            <div className="h-[250px] md:h-[400px] w-full bg-white/5 border border-white/10 p-8 rounded-sm shadow-2xl relative">
                                <div className="absolute top-4 left-4 text-[9px] font-mono text-brand-500 uppercase font-bold">Projected Annual Volume (USD)</div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={growthData}>
                                        <defs>
                                            <linearGradient id="deckGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="val" stroke="#f97316" strokeWidth={4} fill="url(#deckGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-sm md:max-w-md aspect-square">
                                <div className="absolute inset-0 bg-action-500/10 rounded-full blur-[100px] animate-pulse"></div>
                                <div className="relative z-10 w-full h-full border border-white/10 bg-gradient-to-br from-brand-900 to-black rounded-sm p-8 md:p-12 flex flex-col justify-center shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Database className="w-64 h-64" /></div>
                                    <slide.icon className="w-16 h-16 md:w-24 md:h-24 text-action-500 mb-8" />
                                    <div className="h-1 w-16 md:w-24 bg-action-500 mb-8"></div>
                                    <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.4em] font-bold">PROPRIETARY_TECH</p>
                                    <p className="text-2xl md:text-4xl font-black mt-4 tracking-tighter uppercase leading-none italic">Sovereign.<br/>Scale.<br/>Exit.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-6 md:p-8 flex justify-between items-center border-t border-white/10 bg-brand-950/50 shrink-0">
                <div className="text-[10px] font-mono text-brand-500 uppercase tracking-widest font-bold">
                    Slide {currentSlide + 1} / {slides.length} // CONFIDENTIAL_BRIEFING
                </div>
                <div className="flex gap-4">
                    <button onClick={prev} className="p-4 border border-white/10 hover:bg-white/10 rounded-sm transition-all"><ChevronLeft className="w-5 h-5 md:w-6 md:h-6" /></button>
                    <button onClick={next} className="px-10 md:px-16 py-4 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-action-500 hover:text-white transition-all shadow-xl">
                        {currentSlide === slides.length - 1 ? "End Session" : "Next Slide"}
                    </button>
                </div>
            </div>
        </div>
    );
};
