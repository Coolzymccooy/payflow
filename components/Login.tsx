
import React, { useState } from 'react';
import { Wallet, Lock, Shield, ArrowRight, Loader2, Key } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Firebase/OIDC Auth
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-brand-950 flex flex-col items-center justify-center p-6 z-[250]">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-action-500 via-amber-500 to-action-500"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full max-w-md bg-brand-900/40 border border-brand-800 p-10 rounded-sm shadow-2xl relative">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="bg-action-500 p-2 rounded-sm">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-mono uppercase">PayFlow<span className="text-action-500">_OS</span></span>
        </div>

        <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-white uppercase tracking-widest">System Access Gate</h1>
            <p className="text-brand-500 text-xs font-mono mt-1 uppercase">Establish encrypted session uplink.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-3 h-3" /> Terminal Email
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
              placeholder="operator@payflow.os"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Encrypted Key
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
              placeholder="••••••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-action-500 hover:bg-action-600 text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-8 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Initialize Session</>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-brand-800 flex justify-between items-center text-[10px] font-mono text-brand-600">
           <span className="hover:text-brand-400 cursor-pointer">SECURE RESET</span>
           <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256-GCM</span>
        </div>
      </div>

      <div className="mt-8 text-center opacity-30">
          <p className="text-[9px] font-mono text-brand-500 uppercase tracking-[0.4em]">Proprietary Terminal of PayFlow Global Inc.</p>
      </div>
    </div>
  );
};
