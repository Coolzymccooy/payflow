
import React, { useState, useEffect } from 'react';
/* Added Users and Landmark to the lucide-react imports */
import { Wallet, Globe, Zap, ShieldCheck, ArrowRight, Lock, Rocket, ChevronRight, Star, Layers, Terminal, X, Play, Loader2, Monitor, ArrowRightLeft, CheckCircle2, Server, ShieldAlert, FileText, Activity, Coins, Sparkles, Network, TrendingUp, Cpu, Database, BarChart3, Fingerprint, Users, Landmark } from 'lucide-react';

interface PublicLandingProps {
  onStart: () => void;
  isLoggedIn?: boolean;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onStart, isLoggedIn }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState<'INIT' | 'ANALYZING' | 'UPLINK' | 'COMPLETE'>('INIT');

  useEffect(() => {
    if (showDemo) {
      const timer1 = setTimeout(() => setDemoStep('ANALYZING'), 2000);
      const timer2 = setTimeout(() => setDemoStep('UPLINK'), 4000);
      const timer3 = setTimeout(() => setDemoStep('COMPLETE'), 6000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }
  }, [showDemo]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
 
  const PROMPT = ">>> ";



 
  return (
    <div className="min-h-screen bg-brand-950 text-white selection:bg-action-500 selection:text-white font-sans overflow-x-hidden">
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/95 backdrop-blur-xl animate-in fade-in">
           <div className="w-full max-w-4xl bg-black border border-brand-800 rounded-sm shadow-2xl relative overflow-hidden aspect-video flex flex-col">
              <div className="p-3 border-b border-brand-900 flex justify-between items-center bg-brand-950">
                 <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest px-3">System_Simulation_v3.9</span>
                 <button onClick={() => setShowDemo(false)} className="text-brand-500 hover:text-white p-2"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-12 font-mono text-sm relative">
                 {demoStep === 'INIT' && <div className="text-center text-action-500 animate-pulse"><Loader2 className="w-8 h-8 animate-spin mb-4 mx-auto" /><p>&gt;&gt;&gt; INITIALIZING GLOBAL MESH UPLINK...</p></div>}
                 {demoStep === 'ANALYZING' && <div className="w-full max-w-md space-y-2 text-emerald-500"><p>&gt;&gt;&gt; SCANNING LIQUIDITY CORRIDORS (NG/UK/US)...</p><div className="h-1 bg-brand-900 w-full rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-2/3 animate-pulse"></div></div></div>}
                 {demoStep === 'UPLINK' && <div className="text-center text-white"><Globe className="w-16 h-16 text-action-500 animate-bounce mx-auto mb-6" /><p className="text-xl font-bold uppercase tracking-tighter">Payflow Core Synchronized</p></div>}
                 {demoStep === 'COMPLETE' && <div className="text-center animate-in zoom-in-95"><CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" /><p className="text-2xl font-bold text-white uppercase tracking-tighter">Simulation Optimized</p><button onClick={onStart} className="mt-8 px-8 py-3 bg-action-500 text-white font-bold uppercase text-xs tracking-widest hover:bg-action-600 transition-all rounded-sm">Initialize Terminal</button></div>}
              </div>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-brand-950/80 backdrop-blur-md border-b border-brand-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-action-500 p-1.5 rounded-sm group-hover:rotate-12 transition-transform"><Wallet className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold tracking-tight font-mono uppercase text-white">Payflow</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400">
            <button onClick={() => scrollTo('pillars')} className="hover:text-white transition-colors">The Pillars</button>
            <button onClick={() => scrollTo('architecture')} className="hover:text-white transition-colors">Security</button>
            <button onClick={() => scrollTo('metrics')} className="hover:text-white transition-colors">Performance</button>
          </div>
          <button onClick={onStart} className="px-6 py-2.5 bg-white text-brand-950 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-100 transition-all shadow-lg flex items-center gap-2">
            {isLoggedIn ? <><Terminal className="w-3 h-3" /> System Console</> : 'Get Started'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-24 px-6 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-action-500/10 rounded-full blur-[160px]"></div>
           <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-800 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-2">
              <Sparkles className="w-3.5 h-3.5 text-action-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Unified Global Fintech Protocol</span>
            </div>
            <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter leading-[0.85] text-white mb-10">
              Not Just a Gateway. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-500 via-amber-400 to-action-600">An Operating System.</span>
            </h1>
            <p className="text-brand-400 text-xl md:text-2xl max-w-2xl font-medium leading-relaxed mb-12">
              The world's first AI-native terminal for global commerce. Collect payments, manage regional treasury, and automate workforce governance in one encrypted environment.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={onStart} className="w-full sm:w-auto px-12 py-6 bg-action-500 text-white rounded-sm font-bold text-sm uppercase tracking-[0.3em] hover:bg-action-600 transition-all shadow-2xl hover:-translate-y-1">Establish Uplink</button>
              <button onClick={() => setShowDemo(true)} className="w-full sm:w-auto px-12 py-6 bg-brand-900 border border-brand-800 text-white rounded-sm font-bold text-sm uppercase tracking-[0.3em] hover:bg-brand-800 transition-all flex items-center justify-center gap-2">
                <Play className="w-3 h-3 fill-current" /> View Demo
              </button>
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-4">
             <div className="bg-brand-900/40 border border-brand-800 p-8 rounded-sm backdrop-blur-sm shadow-2xl animate-pulse">
                <div className="flex justify-between items-center mb-8">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-brand-500">Global Liquidity</div>
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-4xl font-mono font-bold text-white mb-2">$1,842,500</div>
                <div className="h-1 w-full bg-brand-800 rounded-full mb-8 overflow-hidden">
                   <div className="h-full bg-action-500 w-2/3"></div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-[10px] font-mono text-brand-400 uppercase"><span>NGN_POOL</span> <span className="text-white">OPTIMAL</span></div>
                   <div className="flex justify-between text-[10px] font-mono text-brand-400 uppercase"><span>GBP_RAIL</span> <span className="text-white">ACTIVE</span></div>
                   <div className="flex justify-between text-[10px] font-mono text-brand-400 uppercase"><span>US_TREASURY</span> <span className="text-emerald-400">READY</span></div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* The 5 Pillars Section */}
      <section id="pillars" className="py-32 px-6 bg-black border-y border-brand-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold text-action-500 uppercase tracking-[0.5em] mb-4">Functional Architecture</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Five Pillars of Sovereign Finance.</h3>
            <p className="text-brand-400 text-lg">We've integrated the entire fintech lifecycle into a single bimodal interface. No more fragmented tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Intelligent Gateway", desc: "AI-generated storefronts that convert business intent into high-conversion payment links instantly.", icon: Zap, color: "text-action-500" },
              { title: "The Vault (Treasury)", desc: "Autonomous liquidity rebalancing between NGN, GBP, and USD with built-in yield optimization.", icon: Database, color: "text-blue-500" },
              { title: "Trade Terminal", desc: "Algorithmic corridor rebalancing using Gemini-3 reasoning to exploit market spreads and hedge risk.", icon: TrendingUp, color: "text-emerald-500" },
              { title: "Workforce Governance", desc: "Integrated global payroll with 'Streaming Pay' (EWA) and autonomous tax compliance for NG/UK.", icon: Users, color: "text-violet-500" },
              { title: "Compliance Sentinel", desc: "Proprietary AI Vision logic for instant document verification and automated AML risk scoring.", icon: ShieldCheck, color: "text-amber-500" },
              { title: "Institutional LP Hub", desc: "Binding strategic agreements with Tier-1 banks to upgrade your entity to a Regulated Switch.", icon: Landmark, color: "text-rose-500" },
            ].map((pillar, i) => (
              <div key={i} className="bg-brand-900/20 border border-brand-800 p-8 rounded-sm hover:border-brand-600 transition-all group">
                <pillar.icon className={`w-8 h-8 ${pillar.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h4 className="text-xl font-bold mb-3 uppercase tracking-tight">{pillar.title}</h4>
                <p className="text-brand-500 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture / Security */}
      <section id="architecture" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.5em]">Military Grade</h2>
              <h3 className="text-5xl font-bold tracking-tighter">The Security Enclave.</h3>
              <p className="text-brand-400 text-lg leading-relaxed">
                Payflow OS is built on a distributed HSM (Hardware Security Module) architecture. Every transaction is digitally signed at the edge, ensuring total immutability across the global ledger.
              </p>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 p-4 bg-brand-900/30 border border-brand-800 rounded-sm">
                    <Fingerprint className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                       <h4 className="font-bold text-white uppercase text-xs mb-1">Zero-Trust Authorization</h4>
                       <p className="text-brand-500 text-[11px] leading-relaxed">Dual-custody multi-sig required for all institutional treasury movements.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 bg-brand-900/30 border border-brand-800 rounded-sm">
                    <Cpu className="w-6 h-6 text-action-500 shrink-0" />
                    <div>
                       <h4 className="font-bold text-white uppercase text-xs mb-1">HSM Key Rotation</h4>
                       <p className="text-brand-500 text-[11px] leading-relaxed">Automatic rotating 256-bit encryption keys manage every corridor handshake.</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-action-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
                alt="Infrastructure" 
                className="rounded-sm border border-brand-800 grayscale shadow-2xl relative z-10"
              />
           </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-32 px-6 bg-brand-900/10 border-t border-brand-900">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <div className="text-center p-8">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Settlement Speed</p>
                  <p className="text-5xl font-mono font-bold text-action-500 tracking-tighter">T+0</p>
                  <p className="text-[10px] text-brand-400 mt-2 uppercase tracking-widest">Instant Liquidity</p>
               </div>
               <div className="text-center p-8 border-l border-brand-900">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">NGN Spread Efficiency</p>
                  <p className="text-5xl font-mono font-bold text-emerald-500 tracking-tighter">4.2%</p>
                  <p className="text-[10px] text-brand-400 mt-2 uppercase tracking-widest">Vs Interbank Average</p>
               </div>
               <div className="text-center p-8 border-l border-brand-900">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Merchant NAV Cap</p>
                  <p className="text-5xl font-mono font-bold text-white tracking-tighter">$100M</p>
                  <p className="text-[10px] text-brand-400 mt-2 uppercase tracking-widest">Switch Scale Ready</p>
               </div>
               <div className="text-center p-8 border-l border-brand-900">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Compliance Accuracy</p>
                  <p className="text-5xl font-mono font-bold text-amber-500 tracking-tighter">99.8%</p>
                  <p className="text-[10px] text-brand-400 mt-2 uppercase tracking-widest">Oracle Verification</p>
               </div>
            </div>
         </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-48 px-6 bg-action-500 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <h2 className="text-7xl md:text-[12rem] font-bold tracking-tighter mb-12 relative z-10">THE NEW <br/> STANDARD.</h2>
        <button onClick={onStart} className="bg-white text-action-500 px-16 py-8 rounded-sm font-black text-xl uppercase tracking-[0.3em] hover:bg-brand-50 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto group relative z-10">
          Initialize Terminal <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </section>

      <footer className="py-20 px-6 bg-black text-brand-50 text-[10px] font-mono uppercase tracking-[0.4em] text-center">
          © 2025 TIWATON GLOBAL INC. // SECURE_MESH_v4.1 // LAGOS_NODE_04
      </footer>
    </div>
  );
};
