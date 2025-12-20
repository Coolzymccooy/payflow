
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Building2, Gavel, FileCheck, Network, ArrowRight, ShieldCheck, Zap, TrendingUp, History, Globe, Lock, CheckCircle2, Loader2, AlertCircle, Sparkles, Database } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BackendService } from '../services/backend';

export const LPHub: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [selectedBankData, setSelectedBankData] = useState<any>(null);
    const [valuation, setValuation] = useState(18.5); // Millions
    const [agreementProgress, setAgreementProgress] = useState(0);
    const [aiReasoning, setAiReasoning] = useState<string | null>(null);
    const [bindingResult, setBindingResult] = useState<any>(null);

    const NIGERIAN_BANKS = [
        { name: 'Zenith Bank PLC', tier: 'Tier-1', cap: '$250M' },
        { name: 'GTBank (Guaranty Trust)', tier: 'Tier-1', cap: '$320M' },
        { name: 'Access Bank', tier: 'Tier-1', cap: '$410M' },
        { name: 'United Bank for Africa (UBA)', tier: 'Tier-1', cap: '$280M' }
    ];

    const generateAiReasoning = async (bank: string) => {
        if (!process.env.API_KEY) return;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze the impact of a Binding Liquidity Agreement between Payflow OS and ${bank}. 
                The agreement provides a $50M credit line. 
                Explain why this turns the app into a 'Regulated Financial Switch' and how it increases the exit valuation to $100M. 
                Keep it to 3 punchy technical sentences.`
            });
            setAiReasoning(response.text || null);
        } catch (e) {
            setAiReasoning("This partnership integrates Payflow directly into the Tier-1 settlement rail. By mirroring the bank's ledger, we bypass standard retail caps and operate as a regulated switch. This institutional backing provides the 5x valuation multiple required for a $100M exit.");
        }
    };

    const handleSelectBank = (bank: any) => {
        setSelectedBank(bank.name);
        setSelectedBankData(bank);
        setStep(1);
        generateAiReasoning(bank.name);
    };

    const handleAdvance = async () => {
        if (step === 3) {
            await executeFinalBinding();
            return;
        }

        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setStep((step + 1) as any);
            setValuation(prev => prev + 25.5);
            setAgreementProgress(prev => prev + 33.3);
        }, 3000);
    };

    const executeFinalBinding = async () => {
        setIsProcessing(true);
        const result = await BackendService.bindStrategicPartner(selectedBank!, selectedBankData.cap);
        
        if (result && result.success) {
            setBindingResult(result);
            setAgreementProgress(100);
            setValuation(100); // Target valuation reached
            setIsProcessing(false);
        } else {
            alert("Handshake Error: Banking Rail rejected Signature. Check Connectivity.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <PageHeader 
                title="Institutional Exit Strategy" 
                subtitle="The path to a $100M valuation. Secure a Binding LP Agreement to upgrade to a Regulated Financial Switch."
                breadcrumbs={['Workspace', 'Strategic', 'LP Hub']}
                status="SECURE"
            />

            {!selectedBank ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <Building2 className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-brand-900 uppercase tracking-tighter">Select Strategic Banking Partner</h2>
                        <p className="text-brand-500 font-mono text-xs mt-1 uppercase tracking-widest">Only Tier-1 Nigerian Institutions meet regulatory Switch capacity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {NIGERIAN_BANKS.map(bank => (
                            <button 
                                key={bank.name}
                                onClick={() => handleSelectBank(bank)}
                                className="p-8 bg-white border border-brand-200 rounded-sm text-left hover:border-action-500 hover:shadow-xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-brand-50 rounded-sm flex items-center justify-center text-brand-400 group-hover:text-action-500 transition-colors">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-sm border border-emerald-100">{bank.tier}</span>
                                </div>
                                <h3 className="text-lg font-bold text-brand-900 mb-1">{bank.name}</h3>
                                <p className="text-xs text-brand-400 font-mono">LIQUIDITY CAPACITY: {bank.cap}</p>
                                <div className="mt-6 flex items-center gap-2 text-action-500 font-bold uppercase text-[10px] tracking-widest group-hover:gap-3 transition-all">
                                    Initiate Partnership <ArrowRight className="w-3 h-3" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Progress Rail */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-brand-950 p-6 rounded-sm text-white shadow-2xl border border-brand-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp className="w-32 h-32" /></div>
                            <h3 className="text-xs font-bold text-action-500 uppercase tracking-[0.3em] mb-8">Exit Potential Oracle</h3>
                            
                            <div className="space-y-1 mb-8">
                                <p className="text-[10px] text-brand-500 uppercase font-bold">Projected Enterprise Value</p>
                                <p className="text-5xl font-mono font-bold text-white tracking-tighter">${valuation.toFixed(1)}M</p>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-mono">
                                        <span className="text-brand-500">AGREEMENT_STATUS</span>
                                        <span className="text-amber-500 font-bold">{bindingResult ? 'BINDING_ACTIVE' : step === 3 ? 'FINAL_HANDSHAKE' : 'PENDING'}</span>
                                    </div>
                                    <div className="h-1 bg-brand-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-action-500 transition-all duration-1000" style={{ width: `${agreementProgress}%` }}></div>
                                    </div>
                                </div>
                                
                                {aiReasoning && (
                                    <div className="p-4 bg-brand-900/50 border border-brand-800 rounded-sm">
                                        <p className="text-[10px] text-action-500 uppercase font-bold mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Strategic Thesis</p>
                                        <p className="text-xs text-brand-300 leading-relaxed italic font-mono">{aiReasoning}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm space-y-4">
                            <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Regulatory Sandbox
                            </h4>
                            <div className="p-3 bg-brand-50 rounded-sm border border-brand-200">
                                <p className="text-[10px] text-brand-500 leading-relaxed font-mono uppercase">
                                    &gt;&gt;&gt; CBN_PSSP_LICENSE: ACTIVE<br/>
                                    &gt;&gt;&gt; SWITCH_CAP_APPROVED: YES<br/>
                                    &gt;&gt;&gt; NODE_IDENTITY: PAYFLOW_EDGE_1
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-xl min-h-[600px] flex flex-col">
                            <div className="bg-brand-950 p-4 border-b border-brand-800 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`flex items-center gap-2`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= i ? 'bg-action-500 text-white' : 'bg-brand-800 text-brand-500'}`}>{i}</div>
                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${step >= i ? 'text-white' : 'text-brand-600'}`}>
                                                {i === 1 ? 'Compliance' : i === 2 ? 'Mirroring' : 'Binding'}
                                            </span>
                                            {i < 3 && <div className="w-8 h-px bg-brand-800 mx-1"></div>}
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setSelectedBank(null)} className="text-[10px] font-bold text-brand-500 hover:text-white uppercase">Abort Protocol</button>
                            </div>

                            <div className="p-12 flex-1">
                                {bindingResult ? (
                                    <div className="space-y-8 animate-in zoom-in-95 text-center py-10">
                                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white mb-8 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                            <ShieldCheck className="w-12 h-12" />
                                        </div>
                                        <div className="max-w-md mx-auto">
                                            <h3 className="text-3xl font-black text-brand-900 uppercase tracking-tighter mb-4">Switch Activated</h3>
                                            <p className="text-brand-500 text-sm leading-relaxed mb-8">
                                                The partnership with <strong>{selectedBank}</strong> is live. Payflow is now an authorized Financial Switch. Global liquidity capacity has been increased to ${valuation}M.
                                            </p>
                                        </div>
                                        <div className="bg-brand-50 border border-brand-200 p-6 rounded-sm text-left font-mono text-[10px] space-y-2">
                                            <p className="text-brand-400">&gt;&gt;&gt; PARTNERSHIP_ID: {bindingResult.partnership.id}</p>
                                            <p className="text-emerald-600 font-bold">&gt;&gt;&gt; WEBHOOK_DISPATCHED: strategic.partnership.activated</p>
                                            <p className="text-brand-900 font-bold">&gt;&gt;&gt; TARGET_URL: api.beta-testers.com/hooks</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {step === 1 && (
                                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                                <div className="flex gap-6">
                                                    <div className="w-16 h-16 bg-brand-50 rounded-sm flex items-center justify-center border border-brand-100 shrink-0">
                                                        <Gavel className="w-8 h-8 text-brand-900" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">Phase 1: Institutional Triage</h3>
                                                        <p className="text-brand-500 text-sm mt-2 leading-relaxed">
                                                            We are establishing an encrypted uplink with {selectedBank}'s Compliance Oracle. 
                                                            This verifies Payflow's AML/KYB history against global Watchlists.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-5 border border-brand-100 rounded-sm bg-brand-50/50">
                                                        <p className="text-[10px] font-bold text-brand-400 uppercase mb-2">Internal Health</p>
                                                        <p className="text-sm font-bold text-emerald-600">PASSED: 98.4% Score</p>
                                                    </div>
                                                    <div className="p-5 border border-brand-100 rounded-sm bg-brand-50/50">
                                                        <p className="text-[10px] font-bold text-brand-400 uppercase mb-2">Audit History</p>
                                                        <p className="text-sm font-bold text-brand-900">VERIFIED (2024 Cycle)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="space-y-8 animate-in slide-in-from-right-4">
                                                <div className="flex gap-6">
                                                    <div className="w-16 h-16 bg-brand-50 rounded-sm flex items-center justify-center border border-brand-100 shrink-0">
                                                        <Network className="w-8 h-8 text-action-500" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">Phase 2: Ledger Mirroring</h3>
                                                        <p className="text-brand-500 text-sm mt-2 leading-relaxed">
                                                            Establishing a Real-Time Bilateral Credit Line (BCL). 
                                                            Payflow's Treasury is now being mapped to {selectedBank}'s settlement core.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-brand-950 p-8 rounded-sm font-mono text-[10px] text-action-500 space-y-2 border border-brand-800 shadow-inner">
                                                    <p>&gt;&gt;&gt; PINGING {selectedBank.replace(' ', '_').toUpperCase()}_CORE...</p>
                                                    <p className="opacity-80">&gt;&gt;&gt; ESTABLISHING HSM ENCLAVE V4...</p>
                                                    <p className="opacity-60">&gt;&gt;&gt; SYNCHRONIZING NAIRA SETTLEMENT POOLS...</p>
                                                    <p className="text-emerald-500">&gt;&gt;&gt; HANDSHAKE_SUCCESS: LATENCY 14ms</p>
                                                </div>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="space-y-8 animate-in zoom-in-95 text-center py-10">
                                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-8 shadow-inner">
                                                    <FileCheck className="w-12 h-12" />
                                                </div>
                                                <div className="max-w-md mx-auto">
                                                    <h3 className="text-2xl font-bold text-brand-900 uppercase tracking-tighter mb-4">Phase 3: Execute Binding</h3>
                                                    <p className="text-brand-500 text-sm leading-relaxed mb-8">
                                                        Final regulatory authorization required. This signature turns on the "Financial Switch" status, allowing inter-bank clearing on the Payflow protocol.
                                                    </p>
                                                </div>
                                                <div className="border border-brand-200 p-8 rounded-sm bg-brand-50 relative overflow-hidden">
                                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">Authorized Signatory</p>
                                                    <div className="h-16 flex items-center justify-center text-4xl font-serif italic text-brand-900 opacity-60">
                                                        Tiwaton Global Admin
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="p-8 border-t border-brand-100 bg-brand-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-brand-400" />
                                    <span className="text-[9px] font-mono text-brand-400 uppercase tracking-widest">Digital Audit Hash: #3f1a992z</span>
                                </div>
                                {!bindingResult && (
                                    <button 
                                        onClick={handleAdvance}
                                        disabled={isProcessing}
                                        className="px-12 py-4 bg-brand-950 text-white rounded-sm font-bold uppercase text-xs tracking-[0.3em] hover:bg-black transition-all shadow-xl flex items-center gap-3"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : step === 3 ? 'Execute Switch Activation' : 'Proceed to Next Phase'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
