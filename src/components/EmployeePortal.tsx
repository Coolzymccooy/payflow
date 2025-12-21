
import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { 
  Wallet, Zap, Clock, Landmark, CreditCard, ChevronRight, CheckCircle2, 
  RefreshCw, Lock, ArrowUpRight, DollarSign, Download, Share2, Info, 
  Eye, X, FileText, Smartphone, AlertCircle, Phone, Mail, Loader2, 
  TrendingUp, BarChart3, ShieldCheck, Activity, BrainCircuit, Sparkles, User, Settings,
  Database, Shield, History
} from 'lucide-react';

interface EmployeePortalProps {
  employee: Employee;
  isEWAEnabled: boolean;
  onWithdrawEWA: (amount: number) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ employee, isEWAEnabled, onWithdrawEWA }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PAYSLIPS' | 'GOVERNANCE'>('HOME');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModifyingRail, setIsModifyingRail] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const today = new Date().getDate();
  const daysInMonth = 30;
  const earnedPercentage = Math.min(today / daysInMonth, 1);
  const monthlySalary = employee.salary / 12;
  const grossEarnedToDate = monthlySalary * earnedPercentage;
  const availableToWithdraw = grossEarnedToDate * 0.45; // 45% EWA cap

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(employee.region === 'NG' ? 'en-NG' : 'en-US', { 
      style: 'currency', 
      currency: employee.currency, 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await new Promise(r => setTimeout(r, 2500));
    onWithdrawEWA(availableToWithdraw);
    setIsWithdrawing(false);
    setShowSuccess(true);
  };

  const handleModifyRail = async () => {
    setIsModifyingRail(true);
    setHandshakeStep(1);
    const steps = [
        ">> INITIATING BILATERAL HANDSHAKE...",
        ">> CHALLENGING BANK HSM ENCLAVE...",
        ">> VERIFYING ROUTING TOKEN...",
        ">> RAIL SYNCHRONIZED."
    ];
    
    for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 1000));
        setHandshakeStep(i + 1);
    }
    
    setTimeout(() => {
        setIsModifyingRail(false);
        setHandshakeStep(0);
    }, 1000);
  };

  const handleDownload = async (id: string) => {
    setIsDownloading(id);
    await new Promise(r => setTimeout(r, 1200));
    const content = `
PAYFLOW OS - SETTLEMENT SLIP
----------------------------
ID: ${id}
EMPLOYEE: ${employee.name}
PERIOD: ${historyItems.find(i => i.id === id)?.period || 'N/A'}
STATUS: SETTLED
CURRENCY: ${employee.currency}
BANK: ${employee.bank}
----------------------------
Authorized via HSM_ENCLAVE_04
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PAYSLIP_${id}.txt`;
    a.click();
    setIsDownloading(null);
  };

  const historyItems = [
    { id: 'SET-9921', period: 'May 2024', amount: monthlySalary * 0.82, date: 'May 31, 2024', status: 'SETTLED' },
    { id: 'SET-8812', period: 'April 2024', amount: monthlySalary * 0.82, date: 'Apr 30, 2024', status: 'SETTLED' },
    { id: 'SET-7731', period: 'March 2024', amount: monthlySalary * 0.82, date: 'Mar 31, 2024', status: 'SETTLED' },
  ];

  const handshakeMessages = [
    "",
    ">> INITIATING BILATERAL HANDSHAKE...",
    ">> CHALLENGING BANK HSM ENCLAVE...",
    ">> VERIFYING ROUTING TOKEN...",
    ">> RAIL SYNCHRONIZED."
  ];

  return (
    <div className="bg-brand-50 min-h-screen font-sans animate-in fade-in duration-500 flex flex-col">
      <header className="bg-brand-950 text-white p-6 shadow-2xl sticky top-0 z-50 shrink-0">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-action-500 p-2 rounded-sm"><Wallet className="w-5 h-5 text-white" /></div>
                <span className="font-bold tracking-tighter text-xl uppercase font-mono italic">PAYFLOW<span className="text-action-500 not-italic">ESS</span></span>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                    <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">Authenticated Global Profile</p>
                    <p className="text-sm font-bold">{employee.name}</p>
                </div>
                <div className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center font-bold border border-brand-700 shadow-lg relative">
                    {employee.name[0]}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-brand-950 rounded-full"></div>
                </div>
            </div>
        </div>
      </header>

      <nav className="bg-white border-b border-brand-100 sticky top-[88px] z-40 shrink-0">
        <div className="max-w-6xl mx-auto px-6 flex">
            {[
                { id: 'HOME', label: 'Terminal', icon: Activity },
                { id: 'PAYSLIPS', label: 'Settlement Ledger', icon: FileText },
                { id: 'GOVERNANCE', label: 'Identity & Rails', icon: ShieldCheck }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest border-b-2 flex items-center gap-2 transition-all ${activeTab === tab.id ? 'border-action-500 text-brand-900 bg-brand-50/50' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
                >
                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-action-500' : 'text-brand-300'}`} />
                    {tab.label}
                </button>
            ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 flex-1 w-full space-y-6">
        {activeTab === 'HOME' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-brand-200 p-6 rounded-sm shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Database className="w-16 h-16" /></div>
                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">Oracle_Pay_Score</p>
                        <p className="text-3xl font-mono font-bold text-brand-900">98.4%</p>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase mt-2">NOMINAL_HEALTH</p>
                    </div>
                    <div className="bg-white border border-brand-200 p-6 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">Monthly_Allocation</p>
                        <p className="text-3xl font-mono font-bold text-brand-900">{formatCurrency(monthlySalary)}</p>
                        <p className="text-[9px] text-brand-400 font-bold uppercase mt-2">Next Run: T-12 Days</p>
                    </div>
                    <div className="bg-white border border-brand-200 p-6 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">Rail_Reliability</p>
                        <p className="text-3xl font-mono font-bold text-brand-900">99.9%</p>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase mt-2">DIRECT_MIRROR_ACTIVE</p>
                    </div>
                    <div className="bg-white border border-brand-200 p-6 rounded-sm shadow-sm">
                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">Compliance_State</p>
                        <p className="text-3xl font-mono font-bold text-brand-900">SECURE</p>
                        <p className="text-[9px] text-brand-400 font-bold uppercase mt-2">IDENTITY_VERIFIED</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        {/* EWA Visualization */}
                        <div className="bg-brand-950 text-white rounded-sm p-10 border border-brand-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform"><TrendingUp className="w-48 h-48" /></div>
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <div className="flex items-center gap-3 text-action-500 mb-2">
                                        <Zap className="w-5 h-5 fill-current" />
                                        <h3 className="text-xs font-bold uppercase tracking-[0.3em]">Instant Liquidity Terminal</h3>
                                    </div>
                                    <p className="text-brand-400 text-sm max-w-sm">Access a portion of your already-earned gross salary via Payflow's bilateral mirror rail.</p>
                                </div>
                                <div className="bg-brand-900 border border-brand-800 p-4 text-center rounded-sm">
                                    <p className="text-[9px] text-brand-500 uppercase mb-1">Oracle_Confidence</p>
                                    <p className="text-xl font-mono font-bold text-emerald-400">99.8%</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Gross Earned to Date</p>
                                        <p className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums">{formatCurrency(grossEarnedToDate)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-action-500 font-bold uppercase tracking-widest">Available Instant Release</p>
                                        <p className="text-4xl font-mono font-bold text-white tracking-tighter tabular-nums">{formatCurrency(availableToWithdraw)}</p>
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <div className="h-2 w-full bg-brand-900 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-action-500 transition-all duration-1000 ease-out" style={{ width: `${(availableToWithdraw/monthlySalary)*100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-brand-500 mt-4 uppercase">
                                        <span>Allocated Pool</span>
                                        <span>{formatCurrency(monthlySalary)} CAP</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing || availableToWithdraw <= 0}
                                    className="w-full py-6 bg-action-500 text-white rounded-sm font-black uppercase text-sm tracking-[0.4em] shadow-xl hover:bg-action-600 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-30"
                                >
                                    {isWithdrawing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><Smartphone className="w-6 h-6" /> Stream Earnings to Bank</>}
                                </button>
                                
                                <div className="p-4 bg-brand-900/50 border border-brand-800 rounded-sm italic">
                                    <p className="text-[9px] text-brand-500 font-bold uppercase mb-2">Oracle Intelligence Brief</p>
                                    <p className="text-[11px] text-brand-300 leading-relaxed font-mono">
                                        "Bypassing standard 30-day clearing. Funds will be released via {employee.bank} mirror node within 120s of authorization."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm">
                            <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-brand-50 pb-4">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Compliance Dossier
                            </h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-brand-500 uppercase">Tax Residency</span>
                                    <span className="font-bold text-brand-900">{employee.region === 'NG' ? 'Lagos, Nigeria' : employee.region}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-brand-500 uppercase">Registry Status</span>
                                    <span className="font-bold text-emerald-600">VERIFIED</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-brand-500 uppercase">Sanctions Screening</span>
                                    <span className="font-bold text-emerald-600 uppercase">Clear</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-brand-500 uppercase">HSM Public Key</span>
                                    <span className="font-mono text-brand-400">0x...8821</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-950 p-6 rounded-sm border border-brand-800 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-5"><BrainCircuit className="w-24 h-24" /></div>
                            <h4 className="text-[10px] font-bold text-action-500 uppercase tracking-widest mb-4">Oracle Pay Insights</h4>
                            <p className="text-[11px] text-brand-300 italic leading-relaxed">
                                "Based on historical spend patterns, withdrawing {formatCurrency(availableToWithdraw)} now maintains an 85% liquidity safety margin for your expected month-end bills."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'PAYSLIPS' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white border border-brand-200 rounded-sm shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50">
                        <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-brand-400" /> Historical Settlement Ledger
                        </h3>
                    </div>
                    <div className="divide-y divide-brand-50">
                        {historyItems.map(item => (
                            <div key={item.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-brand-50 transition-all group">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => handleDownload(item.id)}
                                        disabled={isDownloading === item.id}
                                        className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-sm flex items-center justify-center text-brand-400 group-hover:text-action-500 transition-all shadow-sm"
                                    >
                                        {isDownloading === item.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                                    </button>
                                    <div>
                                        <p className="text-lg font-black text-brand-900 uppercase tracking-tight">{item.period}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-mono text-brand-400 uppercase font-bold tracking-widest">ORACLE_REF: {item.id}</span>
                                            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-sm border border-emerald-100 uppercase tracking-widest">{item.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">Net_Disbursed</p>
                                        <p className="text-2xl font-mono font-bold text-brand-900 tracking-tighter">{formatCurrency(item.amount)}</p>
                                    </div>
                                    <button onClick={() => handleDownload(item.id)} className="p-2 text-brand-300 hover:text-brand-900 transition-colors">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'GOVERNANCE' && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm space-y-6">
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest border-b border-brand-50 pb-4 flex items-center gap-2">
                           <Landmark className="w-4 h-4 text-action-500" /> Settlement Destination Rail
                        </h4>
                        <div className="space-y-4">
                            <div className="p-6 bg-brand-50 border border-brand-200 rounded-sm relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5"><Landmark className="w-12 h-12" /></div>
                                <p className="text-[9px] font-bold text-brand-500 uppercase tracking-widest mb-1">Primary Node</p>
                                <p className="text-lg font-bold text-brand-900 uppercase">{employee.bank}</p>
                                <p className="text-xs font-mono text-brand-400 mt-2 uppercase tracking-tighter">Acc: ****8812 • Verified</p>
                                
                                {isModifyingRail && (
                                    <div className="mt-4 p-3 bg-brand-950 text-action-500 rounded-sm font-mono text-[9px] animate-in fade-in">
                                        <p className={handshakeStep < 4 ? "animate-pulse" : ""}>{handshakeMessages[handshakeStep]}</p>
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={handleModifyRail}
                                disabled={isModifyingRail}
                                className="w-full py-3 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                {isModifyingRail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                {isModifyingRail ? 'Executing Protocol...' : 'Modify Rail Handshake'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm space-y-6">
                        <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest border-b border-brand-50 pb-4 flex items-center gap-2">
                           <User className="w-4 h-4 text-action-500" /> Identity Verification
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border border-brand-100 rounded-sm">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-900 uppercase">Government ID Link</p>
                                    <p className="text-[10px] text-brand-400 uppercase font-mono mt-0.5">Status: Verified_2024</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 border border-brand-100 rounded-sm">
                                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-900 uppercase">Biometric Authenticator</p>
                                    <p className="text-[10px] text-brand-400 uppercase font-mono mt-0.5">Device: iPhone_15_Secure_Enclave</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-950 p-10 rounded-sm border border-brand-800 text-white shadow-2xl">
                    <h3 className="text-xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-3">
                        <Shield className="w-6 h-6 text-action-500" /> Security Enclave Access Logs
                    </h3>
                    <div className="space-y-4 font-mono text-[10px]">
                        {[
                            { action: 'SESS_UPLINK', ip: '102.89.44.2', ts: '2m ago' },
                            { action: 'HSM_SIGNATURE', ip: '102.89.44.2', ts: '1d ago' },
                            { action: 'PAYSLIP_DECRYPT', ip: '102.89.44.2', ts: '3d ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-brand-900 pb-3 opacity-60 hover:opacity-100 transition-opacity">
                                <span className="text-emerald-500 font-bold uppercase">{log.action}</span>
                                <span className="text-brand-500 uppercase">{log.ip}</span>
                                <span className="text-brand-400 uppercase font-bold">{log.ts}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </main>

      {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-md" onClick={() => setShowSuccess(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-sm rounded-sm overflow-hidden p-12 text-center animate-in zoom-in-95">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
                      <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-900 mb-2 uppercase tracking-tighter italic">Broadcast Success</h3>
                  <p className="text-brand-50 mb-10 font-mono text-[10px] leading-relaxed uppercase">
                    The liquidity movement has been authorized and committed to your {employee.bank} account via the bilateral mirror protocol.
                  </p>
                  <button onClick={() => setShowSuccess(false)} className="w-full py-5 bg-brand-950 text-white font-black uppercase text-xs tracking-[0.3em] rounded-sm shadow-xl hover:bg-black transition-all">Back to Terminal</button>
              </div>
          </div>
      )}
    </div>
  );
};
