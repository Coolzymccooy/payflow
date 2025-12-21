
import React, { useState } from 'react';
import { Wallet, Lock, Shield, ArrowRight, Loader2, Key, Mail, User, ChevronLeft, CheckCircle2, AlertCircle, X, Home } from 'lucide-react';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT';

interface AuthFlowProps {
  onLogin: (email: string) => void;
  onCancel: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onLogin, onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      if (mode === 'FORGOT') {
        setSuccess(true);
      } else {
        onLogin(email);
      }
    }, 1500);
  };

  const renderLogin = () => (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Payflow Access Gate</h1>
          <p className="text-brand-500 text-[10px] font-mono mt-1 uppercase">Enter credentials for secure session uplink.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3 h-3" /> Email Address
          </label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
            placeholder="operator@tiwaton.com"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Payflow Secret Key
            </label>
            <button 
              type="button"
              onClick={() => setMode('FORGOT')}
              className="text-[9px] font-bold text-brand-500 hover:text-action-500 uppercase tracking-widest"
            >
              Recover Key?
            </button>
          </div>
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
          className="w-full bg-action-500 hover:bg-action-600 text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Initialize Payflow</>}
        </button>
      </form>

      <div className="mt-8 space-y-4 text-center">
         <p className="text-[10px] font-mono text-brand-500 uppercase">
           New User? <button onClick={() => setMode('SIGNUP')} className="text-action-500 hover:underline">Provision Wallet</button>
         </p>
         <button 
            onClick={onCancel}
            className="w-full py-3 bg-brand-950/50 border border-brand-800 text-[10px] font-bold text-brand-500 hover:text-white uppercase tracking-[0.2em] rounded-sm transition-all flex items-center justify-center gap-2"
         >
            <Home className="w-3 h-3" /> Return to Tiwaton Home
         </button>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Protocol Enrollment</h1>
          <p className="text-brand-500 text-[10px] font-mono mt-1 uppercase">Initialize your global financial entity on Tiwaton.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
            <User className="w-3 h-3" /> Legal Entity Name
          </label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
            placeholder="Acme Global Inc."
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3 h-3" /> System Email
          </label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
            placeholder="ceo@tiwaton.com"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3 h-3" /> Primary Security Key
          </label>
          <input 
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
            placeholder="Strong Passphrase"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-action-500 hover:bg-action-600 text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Provision Payflow</>}
        </button>
      </form>

      <div className="mt-8 text-center">
         <p className="text-[10px] font-mono text-brand-500 uppercase">
           Already Registered? <button onClick={() => setMode('LOGIN')} className="text-action-500 hover:underline">Enter Gate</button>
         </p>
      </div>
    </div>
  );

  const renderForgot = () => (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white uppercase tracking-widest">Access Recovery</h1>
          <p className="text-brand-500 text-[10px] font-mono mt-1 uppercase">Reset your system uplink credentials.</p>
      </div>

      {success ? (
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-sm text-brand-400 font-mono">
            Recovery instructions sent to terminal email. 
            Check your secure inbox.
          </p>
          <button 
            onClick={() => { setMode('LOGIN'); setSuccess(false); }}
            className="text-[10px] font-bold text-action-500 hover:underline uppercase tracking-widest"
          >
            Back to Gate
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3 h-3" /> Terminal Email
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-950 border border-brand-800 px-4 py-3 rounded-sm text-white font-mono text-sm outline-none focus:border-action-500 transition-colors"
              placeholder="operator@tiwaton.com"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-action-500 hover:bg-action-600 text-white py-4 rounded-sm font-bold uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Request Reset</>}
          </button>

          <div className="text-center mt-4">
             <button 
               type="button"
               onClick={() => setMode('LOGIN')}
               className="text-[10px] font-bold text-brand-500 hover:text-white uppercase tracking-widest"
             >
               Cancel & Return
             </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-brand-950 flex flex-col items-center justify-center p-6 z-[250]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-action-500 via-amber-500 to-action-500"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="w-full max-w-md bg-brand-900/40 border border-brand-800 p-10 rounded-sm shadow-2xl relative">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-brand-600 hover:text-white transition-colors"
          title="Return to System"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="bg-action-500 p-2 rounded-sm">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-mono uppercase">Payflow</span>
        </div>

        {mode === 'LOGIN' && renderLogin()}
        {mode === 'SIGNUP' && renderSignup()}
        {mode === 'FORGOT' && renderForgot()}

        <div className="mt-8 pt-8 border-t border-brand-800 flex justify-between items-center text-[10px] font-mono text-brand-200 font-bold">
           <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Encrypted Protocol</span>
           <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> AES-256-GCM</span>
        </div>
      </div>

      <div className="mt-8 text-center opacity-60">
          <p className="text-[10px] font-mono text-brand-300 font-bold uppercase tracking-[0.4em]">Proprietary Terminal of Tiwaton Global Inc.</p>
      </div>
    </div>
  );
};
