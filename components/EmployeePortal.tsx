
import React, { useState } from 'react';
import { Employee } from '../types';
import { Wallet, Zap, Clock, Landmark, CreditCard, ChevronRight, CheckCircle2, RefreshCw, Lock, ArrowUpRight, DollarSign, Download, Share2, Info, Eye, X, FileText, Smartphone, AlertCircle, Phone, Mail, Loader2 } from 'lucide-react';

interface EmployeePortalProps {
  employee: Employee;
  isEWAEnabled: boolean;
  onWithdrawEWA: (amount: number) => void;
}

const NIGERIAN_BANKS = ['GTBank', 'Zenith Bank', 'Access Bank', 'FirstBank', 'UBA', 'Kuda', 'Moniepoint', 'Opay'];

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ employee, isEWAEnabled, onWithdrawEWA }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PAYSLIPS' | 'BENEFITS'>('HOME');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModifyingRail, setIsModifyingRail] = useState(false);
  const [newBank, setNewBank] = useState(employee.bank);
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);
  const [viewingPayslip, setViewingPayslip] = useState<any | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const today = new Date().getDate();
  const earnedPercentage = Math.min(today / 30, 1);
  const earnedAmount = (employee.salary / 12) * earnedPercentage;
  const availableToWithdraw = earnedAmount * 0.4; 

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(employee.region === 'NG' ? 'en-NG' : 'en-US', { style: 'currency', currency: employee.currency, maximumFractionDigits: 0 }).format(amount);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await new Promise(r => setTimeout(r, 2000));
    onWithdrawEWA(availableToWithdraw);
    setIsWithdrawing(false);
    setShowSuccess(true);
  };

  const handleUpdateBank = async () => {
    setIsUpdatingBank(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsUpdatingBank(false);
    setIsModifyingRail(false);
  };

  const handleDownload = async (id: string) => {
    setIsDownloading(id);
    await new Promise(r => setTimeout(r, 1200));
    const summary = `PAYFLOW SETTLEMENT CERTIFICATE\nREF: ${id}\nPAYEE: ${employee.name}\nAMOUNT: ${formatCurrency(employee.salary/12)}`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${id}.pdf`;
    a.click();
    setIsDownloading(null);
  };

  const historyItems = [
    { id: 'SET-9921', period: '05-2024', amount: (employee.salary / 12) * 0.88, date: 'May 31, 2024' },
    { id: 'SET-8812', period: '04-2024', amount: (employee.salary / 12) * 0.88, date: 'Apr 30, 2024' },
  ];

  return (
    <div className="bg-brand-50 min-h-screen font-sans animate-in fade-in duration-500">
      <header className="bg-brand-950 text-white p-6 shadow-2xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="bg-action-500 p-2 rounded-sm"><Wallet className="w-5 h-5 text-white" /></div>
                <span className="font-bold tracking-tighter text-xl uppercase font-mono">PAYFLOW<span className="text-action-500">_ESS</span></span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">Active Profile</p>
                    <p className="text-sm font-bold">{employee.name}</p>
                </div>
                <div className="w-10 h-10 bg-brand-800 rounded-full flex items-center justify-center font-bold border border-brand-700">{employee.name[0]}</div>
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white p-8 border border-brand-100 rounded-sm shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32 text-action-500" /></div>
            <h2 className="text-2xl font-bold text-brand-900 tracking-tight">System Operational, {employee.name.split(' ')[0]}.</h2>
            <p className="text-brand-500 text-sm mt-1 uppercase tracking-widest font-bold">Uplink Status: Primary Edge Node Active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-brand-950 text-white p-8 rounded-sm shadow-xl border border-brand-800 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-action-500"></div>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-action-500 mb-2">
                            <Zap className="w-4 h-4 fill-current" />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Accrued Earned Value</h3>
                        </div>
                        <p className="text-4xl font-mono font-medium tracking-tighter">{formatCurrency(earnedAmount)}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-sm text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                      HSM_VERIFIED
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-5 bg-brand-900 border border-brand-800 rounded-sm">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Available Instant Cashout (40%)</span>
                            <span className="text-2xl font-mono font-bold text-white">{formatCurrency(availableToWithdraw)}</span>
                        </div>
                        <div className="h-2 w-full bg-brand-800 rounded-full overflow-hidden">
                            <div className={`h-full bg-action-500 transition-all duration-1000`} style={{ width: '40%' }}></div>
                        </div>
                    </div>
                    <button 
                        onClick={handleWithdraw}
                        disabled={isWithdrawing || availableToWithdraw <= 0}
                        className="w-full py-4 bg-action-500 text-white rounded-sm font-bold uppercase text-xs tracking-[0.2em] shadow-lg hover:bg-action-600 transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        {isWithdrawing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Smartphone className="w-4 h-4" /> Stream Earnings to Bank</>}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
                    <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Landmark className="w-3.5 h-3.5" /> Destination Rail
                    </h3>
                    <p className="font-bold text-brand-900 text-sm">{employee.bank}</p>
                    <button onClick={() => setIsModifyingRail(true)} className="mt-6 w-full py-2 bg-brand-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-black">Modify Rail</button>
                </div>
            </div>
        </div>

        <div className="bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden">
            <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-400" /> Historical Ledger
                </h3>
            </div>
            <div className="divide-y divide-brand-50">
                {historyItems.map(item => (
                    <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleDownload(item.id)} className="w-12 h-12 bg-brand-50 rounded-sm flex items-center justify-center text-brand-400 hover:text-action-500 transition-all">
                                {isDownloading === item.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                            </button>
                            <div>
                                <p className="text-sm font-bold text-brand-900">Period Ending: {item.period}</p>
                                <p className="text-[9px] text-brand-400 uppercase font-mono">REF_{item.id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-base font-mono font-bold text-brand-900">{formatCurrency(item.amount)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-md" onClick={() => setShowSuccess(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-sm rounded-sm overflow-hidden p-10 text-center animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-900 mb-2 uppercase tracking-tighter">Broadcast Success</h3>
                  <p className="text-brand-500 mb-8 font-mono text-[10px] leading-relaxed uppercase">
                    Liquidity has been committed to your {employee.bank} account.
                  </p>
                  <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm">Back to Portal</button>
              </div>
          </div>
      )}
    </div>
  );
};
