
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Share2, Copy, TrendingUp, Users, DollarSign, Wallet, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { ViewState } from '../types';

interface PartnerProgramProps {
  addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
  onChangeView: (view: ViewState) => void;
}

export const PartnerProgram: React.FC<PartnerProgramProps> = ({ addNotification, onChangeView }) => {
  const [balance, setBalance] = useState(1240.50);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Mock Commission Data
  const data = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 180 },
    { name: 'Wed', value: 240 },
    { name: 'Thu', value: 190 },
    { name: 'Fri', value: 350 },
    { name: 'Sat', value: 280 },
    { name: 'Sun', value: 410 },
  ];

  const referralLink = "https://payflow.app/r/john-doe-8821";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      if (addNotification) addNotification('Copied', 'Referral link ready to share.', 'SUCCESS');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for non-secure contexts if necessary
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setIsCopied(true);
        if (addNotification) addNotification('Copied', 'Referral link ready to share.', 'SUCCESS');
      } catch (e) {}
      document.body.removeChild(textArea);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleWithdraw = () => {
    if (balance <= 0) return;
    setIsWithdrawing(true);
    setTimeout(() => {
        setIsWithdrawing(false);
        setBalance(0);
        if (addNotification) addNotification('Withdrawal Processed', 'Funds sent to connected bank account.', 'SUCCESS');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Growth & Referrals" 
        subtitle="Referral metrics and commission ledger."
        breadcrumbs={['Workspace', 'Growth', 'Partners']}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-950 p-5 rounded-sm text-white border border-brand-900 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <Wallet className="w-4 h-4 text-action-500" />
              <span className="text-xs font-mono uppercase tracking-wider text-brand-300">Unpaid Balance</span>
            </div>
            <div className="text-3xl font-mono font-medium mb-4 tracking-tighter text-white">
                ${balance.toFixed(2)}
            </div>
          </div>
          <button 
            onClick={handleWithdraw}
            disabled={balance === 0 || isWithdrawing}
            className="w-full py-2 bg-white text-brand-950 hover:bg-brand-100 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
          >
            {isWithdrawing ? 'Processing...' : balance === 0 ? 'No Funds Available' : 'Withdraw Funds'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-sm border border-brand-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-brand-500">
             <TrendingUp className="w-4 h-4" />
             <span className="text-xs font-mono uppercase tracking-wider font-bold">Commission Rate</span>
          </div>
          <div className="text-3xl font-mono font-medium text-brand-900 mb-1">20%</div>
          <div className="text-[10px] text-data-emerald font-bold uppercase bg-emerald-50 inline-block px-1 rounded-sm border border-emerald-100">Platinum Tier</div>
        </div>

         <div className="bg-white p-5 rounded-sm border border-brand-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-brand-500">
             <Users className="w-4 h-4" />
             <span className="text-xs font-mono uppercase tracking-wider font-bold">Referrals</span>
          </div>
          <div className="text-3xl font-mono font-medium text-brand-900 mb-1">14</div>
          <div className="text-[10px] text-brand-400 font-bold uppercase">+2 this week</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm">
        <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide mb-6">Commission History</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#020617" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#020617" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontFamily: 'IBM Plex Mono'}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '2px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                itemStyle={{ color: '#0f172a', fontFamily: 'IBM Plex Mono', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#020617" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCommission)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm border-t-4 border-t-action-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-brand-900 flex items-center gap-2 uppercase tracking-widest">
              <Share2 className="w-4 h-4 text-action-500" />
              Active Partner Link
            </h3>
            <p className="text-brand-500 text-xs mt-1">20% Perpetual Revenue Share for every merchant that integrates.</p>
          </div>
          <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
            <div className="flex-1 md:w-80 bg-brand-50 border border-brand-200 rounded-sm px-3 py-2.5 text-brand-900 font-mono text-xs flex items-center select-all">
              {referralLink}
            </div>
            <div className="flex gap-2">
               <button 
                onClick={() => onChangeView(ViewState.PUBLIC_PARTNER_VIEW)}
                className="bg-brand-50 text-brand-900 hover:bg-brand-100 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide border border-brand-200 flex items-center gap-2 transition-colors"
               >
                 <ExternalLink className="w-3" /> Visit
               </button>
               <button 
                onClick={handleCopy}
                className={`px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 shadow-sm ${isCopied ? 'bg-emerald-600 text-white' : 'bg-brand-900 text-white hover:bg-brand-800'}`}
               >
                 {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                 {isCopied ? 'Copied' : 'Copy'}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
