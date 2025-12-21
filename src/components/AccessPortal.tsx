
import React, { useState } from 'react';
import { User, Umbrella, Role } from '../types';
import { Shield, Globe, Wallet, Fingerprint, ChevronRight, BadgeCheck, Zap, CheckCircle2, Landmark, ArrowRight } from 'lucide-react';

interface AccessPortalProps {
  onAccess: (user: User, umbrella: Umbrella) => void;
  onGoHome?: () => void;
}

const AVAILABLE_USERS: User[] = [
  { id: 'U1', name: 'John Doe', email: 'john@tiwaton.os', role: 'ADMIN', status: 'ACTIVE', lastLogin: '1m ago', mfaEnabled: true },
  { id: 'U2', name: 'Sarah Smith', email: 'sarah@tiwaton.os', role: 'FINANCE', status: 'ACTIVE', lastLogin: '2h ago', mfaEnabled: true },
  { id: 'U3', name: 'Emily Chen', email: 'emily@tiwaton.os', role: 'HR', status: 'ACTIVE', lastLogin: '1d ago', mfaEnabled: true },
  { id: 'U4', name: 'Mike Johnson', email: 'mike@tiwaton.os', role: 'DEVELOPER', status: 'ACTIVE', lastLogin: '12m ago', mfaEnabled: true },
];

const UMBRELLAS: Umbrella[] = [
  { 
    id: 'GLB-HQ', 
    name: 'Acme Global Corp', 
    region: 'Worldwide', 
    status: 'OPERATIONAL', 
    tier: 'ENTERPRISE',
    entitlements: ['CORE_PAYMENTS', 'TREASURY_MGMT', 'WEB3_BRIDGE', 'AI_SENTINEL', 'PAYROLL_AUTO', 'CARD_ISSUING', 'VELOCITY_PAYOUTS'] 
  },
  { 
    id: 'LGS-MSME', 
    name: 'Lagos Creative Studio', 
    region: 'Nigeria', 
    status: 'OPERATIONAL', 
    tier: 'BASIC',
    entitlements: ['CORE_PAYMENTS'] 
  },
  { 
    id: 'EMEA-OPS', 
    name: 'EMEA Regional Hub', 
    region: 'Europe/Africa', 
    status: 'OPERATIONAL',
    tier: 'PRO',
    entitlements: ['CORE_PAYMENTS', 'TREASURY_MGMT', 'CARD_ISSUING'] 
  },
];

export const AccessPortal: React.FC<AccessPortalProps> = ({ onAccess, onGoHome }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setStep(2);
  };

  const handleUmbrellaSelect = (umbrella: Umbrella) => {
    if (!selectedUser) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onAccess(selectedUser, umbrella);
    }, 1500);
  };

  const getRoleBadgeStyle = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'bg-action-500 text-white border-action-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
      case 'FINANCE': return 'bg-emerald-600 text-white border-emerald-700 shadow-[0_0_15px_rgba(5,150,105,0.3)]';
      case 'HR': return 'bg-blue-600 text-white border-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.3)]';
      case 'DEVELOPER': return 'bg-violet-600 text-white border-violet-700 shadow-[0_0_15px_rgba(124,58,237,0.3)]';
      default: return 'bg-brand-800 text-brand-100 border-brand-700';
    }
  };

  if (isAuthenticating) {
    return (
      <div className="fixed inset-0 bg-brand-950 flex flex-col items-center justify-center text-white z-[300]">
        <div className="w-24 h-24 relative mb-8">
            <Fingerprint className="w-full h-full text-action-500 animate-pulse" />
            <div className="absolute inset-0 border-4 border-action-500/20 rounded-full animate-ping"></div>
        </div>
        <h2 className="text-xl font-mono font-bold uppercase tracking-widest text-action-500">Authenticating Pulse</h2>
        <p className="text-brand-300 font-mono text-xs mt-2 uppercase">Verifying Authorization Tokens...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-brand-950 flex flex-col items-center justify-center p-6 z-[200] overflow-y-auto">
      {/* Visual background elements */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div className="w-full max-w-6xl relative">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
               <button 
                onClick={onGoHome}
                className="flex items-center justify-center gap-3 mb-8 mx-auto group"
               >
                <div className="bg-action-500 p-2 rounded-sm shadow-lg shadow-action-500/20 group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-white font-mono uppercase">PAYFLOW</span>
               </button>
               <h1 className="text-2xl font-bold text-white uppercase tracking-tighter mb-2">Personnel Identification</h1>
               <p className="text-brand-100 font-mono text-xs uppercase tracking-widest">Select authorized profile to initiate terminal session.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {AVAILABLE_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="group bg-brand-900/40 border border-brand-800 p-6 rounded-sm text-left hover:border-action-500 hover:bg-brand-900/60 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-950 rounded-sm flex items-center justify-center border border-brand-800 group-hover:border-action-500/50 transition-colors shrink-0">
                      <Shield className={`w-8 h-8 ${user.role === 'ADMIN' ? 'text-action-500' : 'text-brand-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-bold text-white text-lg tracking-tight truncate">{user.name}</h3>
                        <span className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-black uppercase border-b-2 tracking-widest shrink-0 transition-all group-hover:scale-105 ${getRoleBadgeStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-brand-300 font-mono mt-1 opacity-70">{user.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-brand-950 px-4 py-1.5 rounded-sm border border-emerald-500/40 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Identity Verified: {selectedUser?.name}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white uppercase tracking-tighter mb-3">Umbrella Context</h1>
              <p className="text-brand-50 font-mono text-xs uppercase tracking-widest mb-12">Select organizational tier to deploy specific mesh configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {UMBRELLAS.map((umbrella) => (
                <button
                  key={umbrella.id}
                  onClick={() => handleUmbrellaSelect(umbrella)}
                  className={`group bg-brand-950 border p-10 rounded-sm transition-all relative border-brand-800 hover:border-brand-400 flex flex-col items-center h-full shadow-2xl`}
                >
                  {/* Status Indicator Top Right */}
                  <div className="absolute top-6 right-6">
                     {umbrella.tier === 'ENTERPRISE' ? (
                       <BadgeCheck className="w-5 h-5 text-action-500" />
                     ) : (
                       <Zap className="w-5 h-5 text-brand-600 group-hover:text-brand-300 transition-colors" />
                     )}
                  </div>

                  {/* Icon Box */}
                  <div className={`w-16 h-16 mb-8 rounded-sm flex items-center justify-center border transition-colors bg-brand-900/20 border-brand-800 group-hover:border-brand-400`}>
                    {umbrella.id === 'GLB-HQ' ? <Globe className="w-8 h-8 text-action-500" /> : <Landmark className="w-8 h-8 text-brand-400" />}
                  </div>

                  {/* Title & Tier */}
                  <h3 className="font-bold text-white text-base uppercase tracking-tighter mb-4">{umbrella.name}</h3>
                  <div className="mb-10">
                     <span className={`text-[10px] font-mono font-black px-4 py-1.5 rounded-sm uppercase tracking-widest ${umbrella.tier === 'ENTERPRISE' ? 'bg-action-500 text-white' : 'bg-transparent text-brand-100 border border-brand-700'}`}>
                        TIER_{umbrella.tier}
                     </span>
                  </div>
                  
                  {/* Entitlements List - High Contrast Version */}
                  <div className="space-y-4 mb-14 text-left w-full">
                      {umbrella.entitlements.map(e => (
                          <div key={e} className="flex items-center gap-3 text-[10px] font-mono font-bold text-brand-100 uppercase tracking-widest">
                             <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></div>
                             {e}
                          </div>
                      ))}
                  </div>
                  
                  {/* Action Footer */}
                  <div className="mt-auto w-full">
                      <div className="w-full h-px bg-brand-800 mb-8 group-hover:bg-brand-600 transition-colors"></div>
                      <span className="text-[11px] font-bold text-brand-100 uppercase flex items-center justify-center gap-3 group-hover:text-white transition-all transform group-hover:translate-x-1">
                        Launch Terminal <ArrowRight className="w-4 h-4" />
                      </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-20 text-center">
              <button 
                  onClick={() => setStep(1)}
                  className="text-[11px] font-bold text-white/70 uppercase hover:text-white transition-colors flex items-center gap-2 mx-auto tracking-[0.2em]"
              >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Change Identification
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 text-center opacity-40 pointer-events-none w-full">
          <p className="text-[10px] font-mono text-brand-300 uppercase tracking-[0.6em]">System Security Level: High // Terminal Encryption: Active</p>
      </div>
    </div>
  );
};
