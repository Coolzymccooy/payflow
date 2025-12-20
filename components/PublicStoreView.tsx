
import React, { useState } from 'react';
import { GeneratedPageData } from '../types';
import { Wallet, Shield, Zap, Lock, RefreshCw, CheckCircle2, ArrowRight, CreditCard, ChevronLeft } from 'lucide-react';

interface PublicStoreViewProps {
  data: GeneratedPageData;
  onBack: () => void;
  onSettle: (amount: number, description: string) => void;
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({ data, onBack, onSettle }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSimulatingPay, setIsSimulatingPay] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const themeStyles = {
    NEON_CYBER: "bg-brand-950 text-white min-h-screen",
    MINIMAL_GLASS: "bg-brand-50 text-brand-900 min-h-screen",
    PREMIUM_LUXE: "bg-black text-amber-50 min-h-screen",
  };

  const cardStyles = {
    NEON_CYBER: "bg-brand-900/40 border-brand-800",
    MINIMAL_GLASS: "bg-white border-brand-200 shadow-sm",
    PREMIUM_LUXE: "bg-brand-900/20 border-amber-900/30",
  };

  const handleSimulatePayment = async () => {
    setIsSimulatingPay(true);
    setSimLogs([]);
    
    const logs = [
        ">> ATTACHING TO PAYFLOW_EDGE_04...",
        ">> HSM AUTHORIZATION PENDING...",
        ">> VALIDATING SETTLEMENT RAILS...",
        ">> COMMITTING LEDGER ENTRIES...",
        ">> BROADCASTING WEBHOOK_SUCCESS..."
    ];

    for (let i = 0; i < logs.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setSimLogs(prev => [...prev, logs[i]]);
    }

    onSettle(2500, `AI_STOREFRONT: ${data.headline}`);
    setIsSimulatingPay(false);
    setIsCheckoutOpen(false);
  };

  return (
    <div className={`${themeStyles[data.theme]} selection:bg-action-500 selection:text-white relative`}>
      {/* Public Nav */}
      <nav className={`p-6 border-b ${data.theme === 'MINIMAL_GLASS' ? 'border-brand-200' : 'border-brand-900'} flex justify-between items-center sticky top-0 bg-inherit z-40 backdrop-blur-md bg-opacity-80`}>
        <div className="flex items-center gap-2">
            <div className="bg-action-500 p-1 rounded-sm">
                <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className={`font-black tracking-tighter text-lg uppercase font-mono ${data.theme === 'MINIMAL_GLASS' ? 'text-brand-900' : 'text-white'}`}>PAYFLOW</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
        >
          <ChevronLeft className="w-3 h-3" /> System Terminal
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center space-y-12 mb-32 relative">
            {data.theme === 'NEON_CYBER' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-action-500/10 rounded-full blur-[120px] -z-10"></div>}
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${data.theme === 'PREMIUM_LUXE' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-action-500/10 border-action-500/20 text-action-500'}`}>
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{data.title}</span>
            </div>

            <h1 className={`text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] ${data.theme === 'PREMIUM_LUXE' ? 'font-serif text-amber-400' : ''}`}>
                {data.headline}
            </h1>

            <p className={`text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed ${data.theme === 'MINIMAL_GLASS' ? 'text-brand-500' : 'text-brand-400'}`}>
                {data.subheadline}
            </p>

            <button 
                onClick={() => setIsCheckoutOpen(true)}
                className={`px-12 py-6 rounded-sm font-black text-xl uppercase tracking-[0.2em] transition-all shadow-2xl hover:-translate-y-1 ${data.theme === 'PREMIUM_LUXE' ? 'bg-amber-500 text-black' : 'bg-action-500 text-white'} flex items-center justify-center gap-4 mx-auto group`}
            >
                {data.cta} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {data.features.map((f, i) => (
                <div key={i} className={`p-8 rounded-sm border ${cardStyles[data.theme]} group hover:border-action-500 transition-all`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-sm mb-6 font-mono font-bold text-sm ${data.theme === 'PREMIUM_LUXE' ? 'bg-amber-500 text-black' : 'bg-brand-950 text-white border border-brand-800'}`}>{i+1}</div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{f}</h3>
                    <p className={`text-sm leading-relaxed ${data.theme === 'MINIMAL_GLASS' ? 'text-brand-500' : 'text-brand-400'}`}>Verified performance metric for artisanal settlement rails.</p>
                </div>
            ))}
        </div>

        <div className="py-20 border-t border-brand-900/10 text-center">
            <p className={`text-[10px] uppercase font-bold tracking-[0.3em] mb-8 opacity-50 ${data.theme === 'MINIMAL_GLASS' ? 'text-brand-900' : 'text-white'}`}>Authorized Global Settlement Nodes</p>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
                <span className="text-lg font-black font-mono tracking-tighter">LAGOS_EDGE_01</span>
                <span className="text-lg font-black font-mono tracking-tighter">LONDON_HQ</span>
                <span className="text-lg font-black font-mono tracking-tighter">NYC_RESERVE</span>
            </div>
        </div>
      </main>

      {/* Checkout Overlay */}
      {isCheckoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-md" onClick={() => !isSimulatingPay && setIsCheckoutOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-brand-50 rounded-sm shadow-2xl border border-brand-200 overflow-hidden animate-in zoom-in-95">
                <div className="bg-brand-900 text-white p-3 flex justify-between items-center border-b border-brand-800">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-action-500 fill-current" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Payflow Secure Session</span>
                    </div>
                    <button 
                        onClick={() => !isSimulatingPay && setIsCheckoutOpen(false)}
                        className="hover:text-action-500 transition-colors"
                    >
                        <Lock className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-10 bg-white relative">
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] text-brand-400 font-mono uppercase mb-1 font-bold">Checkout Summary</p>
                            <h3 className="text-2xl font-bold text-brand-900 tracking-tight">{data.headline}</h3>
                        </div>

                        <div className="py-6 border-y border-brand-100 flex justify-between items-end">
                            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Amount Due</span>
                            <span className="text-4xl font-mono font-bold text-brand-900">$2,500.00</span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-brand-50 border border-brand-100 rounded-sm">
                                <div className="flex items-center gap-3 text-brand-900">
                                    <CreditCard className="w-5 h-5 text-brand-400" />
                                    <span className="text-sm font-bold uppercase tracking-tight">System Card (Live Mode)</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleSimulatePayment}
                                disabled={isSimulatingPay}
                                className="w-full bg-brand-950 text-white py-5 rounded-sm font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                            >
                                {isSimulatingPay ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 text-action-500" />}
                                Authorize Global Settlement
                            </button>
                            
                            {isSimulatingPay && (
                                <div className="p-4 bg-brand-950 rounded-sm border border-brand-800 animate-in fade-in">
                                    <div className="space-y-1 font-mono text-[9px] text-action-400">
                                        {simLogs.map((log, i) => (
                                            <p key={i} className={i === simLogs.length - 1 ? "animate-pulse" : ""}>{log}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!isSimulatingPay && (
                                <p className="text-center text-[10px] text-brand-300 font-mono flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-3 h-3" /> PCI-DSS COMPLIANT
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};
