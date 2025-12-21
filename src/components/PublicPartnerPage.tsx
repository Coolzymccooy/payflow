
import React from 'react';
import { Wallet, CheckCircle, Globe, Zap, ShieldCheck, ArrowRight, Star, Layers, Terminal, Activity, Network, TrendingUp } from 'lucide-react';

interface PublicPartnerPageProps {
  partnerName: string;
  onBack: () => void;
}

export const PublicPartnerPage: React.FC<PublicPartnerPageProps> = ({ partnerName, onBack }) => {
  return (
    <div className="min-h-screen bg-brand-950 text-white selection:bg-action-500 selection:text-white overflow-x-hidden font-sans">
      <nav className="p-6 flex justify-between items-center border-b border-brand-900 sticky top-0 bg-brand-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-action-500 p-1.5 rounded-sm"><Wallet className="w-5 h-5 text-white" /></div>
          <span className="text-xl font-bold tracking-tight font-mono uppercase">PAYFLOW<span className="text-action-500">_OS</span></span>
        </div>
        <button onClick={onBack} className="text-[10px] font-mono text-brand-500 hover:text-white transition-colors uppercase font-bold tracking-widest border border-brand-800 px-4 py-2 rounded-sm">
          Exit Preview
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-32 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-action-500/10 rounded-full blur-[160px] -z-10"></div>
        <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-800 px-4 py-2 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-2">
          <Star className="w-4 h-4 text-action-500 fill-action-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Strategic Invitation via {partnerName}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">
          The OS for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-500 via-amber-400 to-action-600">Global Settlement.</span>
        </h1>
        <p className="text-brand-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          Accept multi-currency payments, manage cross-border treasury, and automate global workforce compliance in one encrypted terminal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-12 py-6 bg-action-500 text-white rounded-sm font-black text-sm uppercase tracking-[0.3em] hover:bg-action-600 transition-all shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-4 group">
            Provision Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-12 py-6 bg-brand-900 border border-brand-800 text-white rounded-sm font-black text-sm uppercase tracking-[0.3em] hover:bg-brand-800 transition-all">
            Technical Specs
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "Direct Rails", desc: "Settle instantly in NGN, GBP, EUR, and USD using our bilateral bank mirror architecture.", icon: Globe, color: "text-action-500" },
                { title: "Velocity Payouts", desc: "T+0 settlement for Level 3 verified merchants. Never wait 3 days for capital again.", icon: Zap, color: "text-amber-400" },
                { title: "HSM Security", desc: "Military-grade dual hardware encryption signatures for every transaction committed.", icon: ShieldCheck, color: "text-emerald-500" },
            ].map((f, i) => (
                <div key={i} className="bg-brand-900/30 border border-brand-800 p-10 rounded-sm group hover:border-action-500/50 transition-all relative overflow-hidden">
                    <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform"><f.icon className="w-32 h-32" /></div>
                    <f.icon className={`w-10 h-10 ${f.color} mb-8`} />
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{f.title}</h3>
                    <p className="text-brand-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="py-32 bg-black border-y border-brand-900 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-xs font-bold text-action-500 uppercase tracking-[0.5em]">Real-time Performance</h2>
               <h3 className="text-5xl font-black tracking-tighter italic">Engineered for Sovereign Scale.</h3>
               <div className="space-y-6">
                  <div className="p-6 bg-brand-900/50 border border-brand-800 rounded-sm">
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Network Uptime</span>
                        <span className="text-2xl font-mono font-bold text-emerald-400">99.998%</span>
                     </div>
                     <div className="h-1 bg-brand-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[99%] animate-pulse"></div></div>
                  </div>
                  <div className="p-6 bg-brand-900/50 border border-brand-800 rounded-sm">
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Settlement Latency</span>
                        <span className="text-2xl font-mono font-bold text-action-500">{"<"} 120s</span>
                     </div>
                     <div className="h-1 bg-brand-800 rounded-full overflow-hidden"><div className="h-full bg-action-500 w-1/3"></div></div>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-action-500/20 rounded-full blur-[120px] animate-pulse"></div>
               <div className="bg-brand-950 border border-brand-800 p-8 rounded-sm shadow-2xl relative z-10 font-mono text-[10px] text-brand-500">
                  <p className="text-action-500 mb-4">// LIVE_NETWORK_MONITOR</p>
                  <p>&gt;&gt; Pinging Lagos_Hub_01... OK (14ms)</p>
                  <p>&gt;&gt; London_Rail_Active... YES</p>
                  <p>&gt;&gt; NYC_Treasury_Uplink... OPTIMAL</p>
                  <p>&gt;&gt; Total Nodes Operating: 14</p>
                  <div className="mt-8 flex gap-1 items-end h-20">
                     {[2,5,3,8,9,4,10,7,5,8,3,9].map((h, i) => (
                        <div key={i} className="flex-1 bg-brand-800 rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <footer className="py-20 text-center text-[10px] font-mono uppercase tracking-[0.4em] text-brand-600">
          © 2025 TIWATON GLOBAL INC. // SECURE_MESH_v4.1
      </footer>
    </div>
  );
};
