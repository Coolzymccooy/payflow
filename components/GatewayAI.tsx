
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { DesignTheme } from '../types';
import { Zap, Sparkles, Layout, RefreshCw, Check, Rocket, Shield, Palette, Layers, Brush, Smartphone, Monitor, Braces, X, CreditCard, Lock, CheckCircle2, Wallet } from 'lucide-react';

interface GeneratedPage {
    title: string;
    headline: string;
    subheadline: string;
    cta: string;
    features: string[];
}

interface GatewayAIProps {
    onPreview: (data: any) => void;
    onSettle: (amount: number, description: string) => void;
}

const PROMPT = ">> ";

export const GatewayAI: React.FC<GatewayAIProps> = ({ onPreview, onSettle }) => {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPage, setGeneratedPage] = useState<GeneratedPage | null>(null);
    const [activeTheme, setActiveTheme] = useState<DesignTheme>('NEON_CYBER');
    const [previewMode, setPreviewMode] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
    const [isDeployed, setIsDeployed] = useState(false);
    
    // Preview Checkout States
    const [isPreviewCheckoutOpen, setIsPreviewCheckoutOpen] = useState(false);
    const [isSimulatingPay, setIsSimulatingPay] = useState(false);
    const [simLogs, setSimLogs] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!prompt || !process.env.API_KEY) return;
        setIsGenerating(true);
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Create a professional payment landing page for: "${prompt}". 
                Theme Style requested: ${activeTheme}.
                Include a compelling headline, a subheadline that drives trust, a clear CTA text, and 3 key value propositions. 
                Return strictly JSON.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            headline: { type: Type.STRING },
                            subheadline: { type: Type.STRING },
                            cta: { type: Type.STRING },
                            features: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ["title", "headline", "subheadline", "cta", "features"]
                    }
                }
            });
            
            const text = response.text;
            if (!text) throw new Error("Empty response from AI");
            setGeneratedPage(JSON.parse(text));
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSimulatePreviewPayment = async () => {
        setIsSimulatingPay(true);
        setSimLogs([]);
        
        const logs = [
            ">> INITIALIZING PREVIEW_HSM...",
            ">> ISOLATING TEST RAILS...",
            ">> COMMITTING HANDSHAKE...",
            ">> SUCCESS_BROADCAST_SIMULATED..."
        ];

        for (let i = 0; i < logs.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setSimLogs(prev => [...prev, logs[i]]);
        }

        onSettle(100, `PREVIEW_MODE: ${generatedPage?.headline}`);
        setIsSimulatingPay(false);
        setIsPreviewCheckoutOpen(false);
    };

    const themes: { id: DesignTheme; label: string; icon: any; color: string }[] = [
        { id: 'NEON_CYBER', label: 'Neon Dark', icon: Zap, color: 'bg-action-500' },
        { id: 'MINIMAL_GLASS', label: 'Clean Glass', icon: Layers, color: 'bg-brand-500' },
        { id: 'PREMIUM_LUXE', label: 'Premium Gold', icon: Brush, color: 'bg-amber-500' },
    ];

    const renderPreview = () => {
        if (!generatedPage) return null;

        const themeStyles = {
            NEON_CYBER: "bg-brand-950 text-white",
            MINIMAL_GLASS: "bg-brand-50 text-brand-900 border-brand-200",
            PREMIUM_LUXE: "bg-black text-amber-50",
        };

        const buttonStyles = {
            NEON_CYBER: "bg-action-500 text-white hover:bg-action-600",
            MINIMAL_GLASS: "bg-brand-900 text-white hover:bg-brand-800 shadow-md",
            PREMIUM_LUXE: "bg-amber-500 text-black font-black uppercase tracking-tighter hover:bg-amber-400",
        };

        return (
            <div className={`mx-auto border-8 border-brand-900 rounded-[3rem] shadow-2xl transition-all duration-500 overflow-hidden relative bg-white ${previewMode === 'MOBILE' ? 'w-[320px] h-[640px]' : 'w-full min-h-[600px] rounded-sm border-2'}`}>
                {/* Mobile Camera Notch */}
                {previewMode === 'MOBILE' && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-brand-900 rounded-b-2xl z-50"></div>
                )}
                
                <div className={`w-full h-full overflow-y-auto scrollbar-hide flex flex-col ${themeStyles[activeTheme]}`}>
                    <div className={`p-6 text-center pt-24 pb-12 relative overflow-hidden shrink-0`}>
                        {activeTheme === 'NEON_CYBER' && <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-action-500 to-transparent"></div>}
                        {activeTheme === 'MINIMAL_GLASS' && <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-200 rounded-full blur-[100px] opacity-40"></div>}
                        
                        <h1 className={`font-bold mb-4 tracking-tighter leading-none ${previewMode === 'MOBILE' ? 'text-3xl' : 'text-5xl'} ${activeTheme === 'PREMIUM_LUXE' ? 'font-serif text-amber-400' : ''}`}>{generatedPage.headline}</h1>
                        <p className={`mb-8 max-w-xl mx-auto font-medium ${previewMode === 'MOBILE' ? 'text-sm' : 'text-lg'} ${activeTheme === 'MINIMAL_GLASS' ? 'text-brand-500' : 'text-brand-400'}`}>{generatedPage.subheadline}</p>
                        <button 
                            onClick={() => setIsPreviewCheckoutOpen(true)}
                            className={`px-10 py-4 rounded-sm transition-all shadow-xl font-bold ${previewMode === 'MOBILE' ? 'text-sm' : 'text-lg'} ${buttonStyles[activeTheme]}`}
                        >
                            {generatedPage.cta}
                        </button>
                    </div>
                    
                    <div className={`flex-1 p-6 grid grid-cols-1 ${previewMode === 'DESKTOP' ? 'md:grid-cols-3' : ''} gap-4`}>
                        {generatedPage.features.map((f, i) => (
                            <div key={i} className={`p-5 rounded-sm border ${activeTheme === 'MINIMAL_GLASS' ? 'bg-white border-brand-200 shadow-sm' : activeTheme === 'PREMIUM_LUXE' ? 'bg-brand-900/20 border border-amber-900/30' : 'bg-brand-900/40 border-brand-800'}`}>
                                <div className={`w-8 h-8 flex items-center justify-center rounded-sm mb-3 font-mono font-bold text-xs ${activeTheme === 'PREMIUM_LUXE' ? 'bg-amber-500 text-black' : 'bg-brand-950 text-white border border-brand-800'}`}>{i+1}</div>
                                <p className={`font-bold leading-tight uppercase tracking-tight ${previewMode === 'MOBILE' ? 'text-xs' : 'text-sm'}`}>{f}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-8 border-t border-brand-900/10 text-center bg-white/5 shrink-0">
                        <p className="text-[10px] uppercase font-bold tracking-widest mb-4 opacity-50">Authorized Settlement Engine</p>
                        <div className="flex justify-center gap-6 grayscale opacity-40">
                            <span className="text-[10px] font-black tracking-tighter">VISA</span>
                            <span className="text-[10px] font-black tracking-tighter">MASTERCARD</span>
                            <span className="text-[10px] font-black tracking-tighter">APPLE_PAY</span>
                        </div>
                    </div>

                    {/* Preview Checkout Overlay */}
                    {isPreviewCheckoutOpen && (
                        <div className="absolute inset-0 z-[60] bg-brand-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
                            <div className="w-full bg-white rounded-sm shadow-2xl border border-brand-200 overflow-hidden text-brand-900">
                                <div className="bg-brand-900 text-white p-3 flex justify-between items-center">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">Preview Session</span>
                                    <button onClick={() => setIsPreviewCheckoutOpen(false)}><X className="w-4 h-4" /></button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-action-500 p-1 rounded-sm"><Wallet className="w-4 h-4 text-white" /></div>
                                        <span className="font-black tracking-tighter text-xs uppercase font-mono">PAYFLOW</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-brand-400 font-mono uppercase mb-1">Testing Handshake</p>
                                        <h4 className="text-sm font-bold truncate">{generatedPage.headline}</h4>
                                        <p className="text-2xl font-mono font-bold mt-2">$100.00</p>
                                    </div>
                                    <div className="p-3 bg-brand-50 border border-brand-100 rounded-sm">
                                        <div className="flex items-center gap-2 text-[10px] font-bold">
                                            <CreditCard className="w-3.5 h-3.5 text-brand-400" />
                                            <span>Acme Test Card (Live Sim)</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSimulatePreviewPayment}
                                        disabled={isSimulatingPay}
                                        className="w-full bg-brand-950 text-white py-3 rounded-sm font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                                    >
                                        {isSimulatingPay ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><Lock className="w-3 h-3" /> Authorize</>}
                                    </button>
                                    {isSimulatingPay && (
                                        <div className="space-y-1 font-mono text-[7px] text-brand-500">
                                            {simLogs.map((log, i) => <p key={i}>{log}</p>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gateway AI" 
                subtitle="Instantly architect high-conversion payment storefronts using semantic business intent."
                breadcrumbs={['Workspace', 'Gateway', 'AI Generator']}
                status="LIVE"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-action-500" /> 1. Select Design Architecture
                        </h3>
                        <div className="space-y-2">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTheme(t.id)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-sm border transition-all text-left ${activeTheme === t.id ? 'border-action-500 bg-action-50' : 'border-brand-100 hover:border-brand-300'}`}
                                >
                                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-white ${t.color}`}>
                                        <t.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-900 uppercase">{t.label}</p>
                                        <p className="text-[10px] text-brand-500 font-mono">Verified UI Pattern</p>
                                    </div>
                                    {activeTheme === t.id && <Check className="ml-auto w-4 h-4 text-action-500" />}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest mt-8 mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-action-500" /> 2. Define Offering
                        </h3>
                        <textarea 
                            className="w-full h-32 px-3 py-2 bg-brand-50 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500 transition-all placeholder:text-brand-300 mb-4"
                            placeholder="Describe your business model and target audience..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button 
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-3 bg-brand-950 text-white font-bold uppercase text-xs rounded-sm hover:bg-brand-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> SYNTHESIZING...</> : <><Sparkles className="w-4 h-4 text-action-500" /> Architect One-Pager</>}
                        </button>
                    </div>

                    <div className="bg-emerald-950/10 p-5 rounded-sm border border-emerald-100 text-emerald-900 flex gap-3">
                        <Shield className="w-5 h-5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold uppercase">Deployment Safe</h4>
                            <p className="text-[10px] mt-0.5 opacity-70 leading-relaxed font-mono">Endpoints are provisioned on globally distributed nodes (LAG-01, LON-02, NYC-01).</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {!generatedPage && !isGenerating ? (
                        <div className="bg-brand-50 border border-dashed border-brand-200 rounded-sm h-[600px] flex flex-col items-center justify-center text-center p-12">
                            <Layout className="w-16 h-16 text-brand-200 mb-6" />
                            <h3 className="text-xl font-bold text-brand-900 mb-2 uppercase tracking-tight">Simulator Standby</h3>
                            <p className="text-brand-500 text-sm max-w-sm font-mono italic">"Awaiting semantic input to generate visual interface..."</p>
                        </div>
                    ) : isGenerating ? (
                        <div className="bg-brand-950 border border-brand-800 rounded-sm h-[600px] flex flex-col items-center justify-center p-12 text-action-500 font-mono">
                             <div className="space-y-2 text-sm w-full max-w-md">
                                <p>{PROMPT}ACCESSING GEMINI-3-FLASH...</p>
                                <p className="opacity-70">{PROMPT}MAPPING {activeTheme} TO BUSINESS LOGIC...</p>
                                <p className="opacity-50">{PROMPT}OPTIMIZING CONVERSION HOOKS...</p>
                                <p className="opacity-30">{PROMPT}PRE-RENDERING ASSETS...</p>
                                <div className="mt-8 h-1 w-full bg-brand-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-action-500 animate-[progress_2s_ease-in-out_infinite]"></div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <div className="bg-white p-3 border border-brand-200 rounded-sm flex items-center justify-between shadow-sm">
                                <div className="flex gap-2">
                                    <button onClick={() => setPreviewMode('DESKTOP')} className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${previewMode === 'DESKTOP' ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-400 hover:bg-brand-100'}`}><Monitor className="w-3 h-3"/> Desktop</button>
                                    <button onClick={() => setPreviewMode('MOBILE')} className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all ${previewMode === 'MOBILE' ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-400 hover:bg-brand-100'}`}><Smartphone className="w-3 h-3" /> Mobile</button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setGeneratedPage(null)} className="px-3 py-1.5 bg-white border border-brand-200 text-brand-500 text-[10px] font-bold uppercase rounded-sm hover:bg-brand-50">Discard</button>
                                    <button 
                                        onClick={() => setIsDeployed(true)}
                                        className="px-6 py-1.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-sm hover:bg-emerald-700 shadow-md flex items-center gap-2"
                                    >
                                        <Rocket className="w-3 h-3" /> Connect & Deploy
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center bg-brand-100/30 p-10 rounded-sm border border-brand-200 min-h-[700px]">
                                {renderPreview()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isDeployed && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm" onClick={() => setIsDeployed(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden p-8 text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-900 mb-2 uppercase tracking-tighter">Live at the Edge</h3>
                        <p className="text-brand-500 mb-8 font-mono text-xs leading-relaxed">Simulation of real deployment. Visit the "Real and Active" one-pager below.</p>
                        <div className="bg-brand-50 p-4 rounded-sm border border-brand-200 mb-8 font-mono text-xs text-brand-700 flex justify-between items-center group">
                            <span className="text-action-600 font-bold">payflow.link/custom-hq</span>
                            <button 
                                onClick={() => onPreview({ ...generatedPage, theme: activeTheme })}
                                className="bg-brand-950 text-white px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase hover:bg-black transition-all"
                            >
                                Visit Live
                            </button>
                        </div>
                        <button onClick={() => setIsDeployed(false)} className="w-full py-3 bg-brand-950 text-white font-bold uppercase text-xs rounded-sm shadow-lg">Return to Workspace</button>
                    </div>
                </div>
            )}
        </div>
    );
};
