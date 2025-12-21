
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { 
    HelpCircle, Book, Terminal, Shield, Zap, Search, ChevronRight, 
    Lock, Globe, Database, LifeBuoy, X, AlertCircle, Loader2, 
    CheckCircle2, Landmark, RefreshCw, Smartphone, Siren, 
    Network, Fingerprint, BarChart3, History, Crown, Key, 
    ShieldAlert, TrendingUp, Sparkles, Presentation, Briefcase
} from 'lucide-react';
import { SupportTicket, ViewState } from '../types';

interface HelpCornerProps {
    onChangeView: (view: ViewState) => void;
}

export const HelpCorner: React.FC<HelpCornerProps> = ({ onChangeView }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const [ticket, setTicket] = useState<Partial<SupportTicket>>({
        subject: '', category: 'TECHNICAL', priority: 'P2', description: ''
    });

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '1201') {
            setIsPinModalOpen(false);
            setPin('');
            onChangeView(ViewState.PITCH_DECK);
        } else {
            setPinError(true);
            setTimeout(() => setPinError(false), 1000);
        }
    };

    const docs = [
        {
            category: 'Investor & Strategic Moats',
            icon: Presentation,
            isPremium: true,
            topics: [
                { 
                    title: 'Valuation Drivers (The Exit Story)', 
                    content: 'How Payflow OS leverages Bilateral Ledger Mirroring and AI-Trade reasoning to command a 10x exit multiple in the SSA-UK corridor.',
                    steps: ['Bypass SWIFT latency (4.2% margin recovery)', 'T+0 Velocity settlement protocol', 'Institutional M&A roadmap']
                },
                { 
                    title: 'Strategic Briefing Deck', 
                    content: 'The superlative breakdown of Payflow OS. Includes market capture strategy for SSA/UK corridors and proprietary Financial Switch architecture. [PIN REQUIRED]',
                    action: () => setIsPinModalOpen(true),
                    isAction: true,
                    steps: ['Authenticate Session', 'Enter Strategic PIN (1201)', 'Launch Presentation']
                }
            ]
        },
        {
            category: 'Terminal Operations',
            icon: Terminal,
            topics: [
                { 
                    title: 'The Global Umbrella Context', 
                    content: 'PayFlow operates on an isolated "Umbrella" architecture. Scoping ensures data isolation between Global HQ and Regional Hubs.',
                    steps: ['Authenticate profile', 'Select organizational tier', 'Initialize context handshake']
                }
            ]
        },
        {
            category: 'Settlement & Commerce',
            icon: Zap,
            topics: [
                { 
                    title: 'Revenue Stream Engineering', 
                    content: 'Provision high-conversion endpoints using "Smart Scan" (Gemini-Vision) to extract billing metadata from physical invoices.',
                    steps: ['Navigate to Collections', 'Select "Smart Scan"', 'Deploy Embed Snippet']
                },
                { 
                    title: 'Velocity (T+0) Settlement', 
                    content: 'Bypass standard banking lags. Instant liquidity release based on Merchant Trust Scores (Level 1-3).',
                    steps: ['Monitor Compliance Sentinel', 'Verify KYC Level 3', 'Enable Auto-Sweep']
                }
            ]
        },
        {
            category: 'Treasury & FX Management',
            icon: Database,
            topics: [
                { 
                    title: 'Liquidity Rebalancing', 
                    content: 'Execute atomic swaps between NGN, GBP, and USD corridors via the AI Trade Terminal to exploit spreads.',
                    steps: ['Open The Vault', 'Run Liquidity Forecast', 'Execute AI Hedging']
                }
            ]
        }
    ];

    const filteredDocs = docs.map(cat => ({
        ...cat,
        topics: cat.topics.filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.topics.length > 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <PageHeader 
                title="Intelligence Hub" 
                subtitle="Operational blueprints and institutional strategic manuals for Payflow OS."
                breadcrumbs={['System', 'Support', 'Manual']}
                status="SECURE"
            />

            <div className="relative mb-12">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search strategy or operations..."
                    className="w-full pl-14 pr-6 py-5 bg-white border border-brand-200 rounded-sm shadow-sm focus:ring-1 focus:ring-action-500 outline-none transition-all text-lg font-medium"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-4">
                   <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl border border-brand-800">
                      <div className="flex items-center gap-2 mb-6 text-action-500">
                         <TrendingUp className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Market Advantage</span>
                      </div>
                      <div className="space-y-4 font-mono text-[10px]">
                         <div className="flex justify-between">
                            <span className="text-brand-500">FX_SPREAD_GAIN</span>
                            <span className="text-emerald-400">+4.2%</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-brand-500">SETTLE_LAG</span>
                            <span className="text-emerald-400">0.00s</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="bg-white p-4 border border-brand-100 rounded-sm">
                      <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest mb-3">Support Rails</h4>
                      <button onClick={() => setIsTicketModalOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase text-brand-600 hover:bg-brand-50 transition-colors">
                        <LifeBuoy className="w-3.5 h-3.5" /> Submit Support Ticket
                      </button>
                   </div>
                </div>

                <div className="lg:col-span-9 space-y-10">
                    {filteredDocs.map((cat, i) => (
                        <div key={i} className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-brand-100 pb-4">
                                <cat.icon className={`w-6 h-6 ${cat.isPremium ? 'text-amber-500' : 'text-action-500'}`} />
                                <h3 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">{cat.category}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cat.topics.map((topic, j) => (
                                    <div key={j} className={`bg-white border border-brand-200 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow group ${(topic as any).isAction ? 'border-amber-200 bg-amber-50/20' : ''}`}>
                                        <h4 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-3 group-hover:text-action-500 transition-colors">
                                            <ChevronRight className={`w-4 h-4 ${cat.isPremium ? 'text-amber-500' : 'text-action-500'}`} />
                                            {topic.title}
                                        </h4>
                                        <p className="text-sm text-brand-600 leading-relaxed mb-6 font-medium">
                                            {topic.content}
                                        </p>
                                        {(topic as any).isAction ? (
                                            <button 
                                                onClick={(topic as any).action}
                                                className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-[0.2em] rounded-sm hover:bg-black shadow-lg flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Lock className="w-3.5 h-3.5 text-amber-500" /> Authenticate Strategic Access
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Valuation Pillars</p>
                                                {topic.steps.map((step, k) => (
                                                    <div key={k} className="flex items-center gap-3 text-[11px] font-mono text-brand-800">
                                                        <div className="w-4 h-4 bg-brand-50 rounded-full flex items-center justify-center text-[9px] font-black border border-brand-200">{k+1}</div>
                                                        {step}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isPinModalOpen && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-brand-950/90 backdrop-blur-xl">
                    <div className={`relative bg-white border-2 p-10 rounded-sm shadow-2xl w-full max-w-sm transition-all duration-300 ${pinError ? 'border-rose-500 shake' : 'border-brand-100'}`}>
                        <button onClick={() => setIsPinModalOpen(false)} className="absolute top-4 right-4 text-brand-400 hover:text-brand-900"><X className="w-5 h-5" /></button>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-brand-950 text-amber-500 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <Key className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">Strategic Gate</h3>
                            <p className="text-[10px] text-brand-500 font-mono mt-1 uppercase tracking-widest">Enter Access PIN</p>
                        </div>
                        <form onSubmit={handlePinSubmit} className="space-y-6">
                            <input 
                                type="password" 
                                maxLength={4}
                                autoFocus
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                className="w-full text-center text-4xl font-mono tracking-[0.5em] py-4 bg-brand-50 border border-brand-200 rounded-sm outline-none focus:border-action-500"
                                placeholder="****"
                            />
                            <button className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-xs tracking-[0.3em] rounded-sm hover:bg-black transition-all">Establish Uplink</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
