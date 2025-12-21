import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card } from '../types';
import { Plus, Wifi, CreditCard, Lock, Unlock, Eye, EyeOff, MoreHorizontal, ShieldCheck, AlertCircle, Sparkles, Tag, Play } from 'lucide-react';

interface CardsProps {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  onSimulateSpend: (cardId: string, amount: number) => void; // E2E Function
}

export const Cards: React.FC<CardsProps> = ({ cards, setCards, onSimulateSpend }) => {
  const [showNumbers, setShowNumbers] = useState<Record<string, boolean>>({});
  const [isIssuing, setIsIssuing] = useState(false);
  
  // New Card State
  const [newHolder, setNewHolder] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newCurrency, setNewCurrency] = useState('USD');

  const toggleNumber = (id: string) => {
    setShowNumbers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFreeze = (id: string) => {
    setCards(cards.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' };
      }
      return c;
    }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };

  const handleIssueCard = () => {
    if(!newHolder || !newLimit) return;
    
    const newCard: Card = {
        id: `CARD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        holderName: newHolder,
        expiry: '12/28',
        cvc: '123',
        limit: parseFloat(newLimit),
        spent: 0,
        currency: newCurrency,
        status: 'ACTIVE',
        type: 'VIRTUAL',
        brand: 'VISA',
        smartCategory: 'General'
    };

    setCards([newCard, ...cards]);
    setIsIssuing(false);
    setNewHolder('');
    setNewLimit('');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Corporate Issuing" 
        subtitle="Manage virtual cards, spending limits, and expense controls."
        breadcrumbs={['Workspace', 'Finance', 'Cards']}
        actions={
            <button 
              onClick={() => setIsIssuing(true)}
              className="mt-4 md:mt-0 bg-action-500 hover:bg-action-600 text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wide shadow-sm"
            >
              <Plus className="w-4 h-4" /> Issue Card
            </button>
        }
      />

      {/* AI Spend Insight Strip */}
      <div className="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 border-dashed rounded-sm text-sm text-brand-600">
         <Sparkles className="w-4 h-4 text-action-500" />
         <p>
            <span className="font-bold text-brand-900 block md:inline md:mr-2">SPEND INTELLIGENCE ACTIVE:</span>
            Transactions are automatically categorized. 2 unusual large purchases flagged this week.
         </p>
      </div>

      {isIssuing && (
        <div className="bg-brand-50 p-6 rounded-sm border border-brand-200 mb-6 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-action-500"></div>
             <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900 mb-4">Issue New Virtual Card</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                   <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Cardholder Name</label>
                   <input 
                    type="text" 
                    value={newHolder}
                    onChange={(e) => setNewHolder(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500"
                    placeholder="e.g. Marketing Team"
                   />
                </div>
                <div>
                   <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Monthly Limit</label>
                   <input 
                    type="number" 
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500"
                    placeholder="5000"
                   />
                </div>
                <div>
                   <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Currency</label>
                   <select 
                     value={newCurrency}
                     onChange={(e) => setNewCurrency(e.target.value)}
                     className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500"
                   >
                      <option value="USD">USD - US Dollar</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="EUR">EUR - Euro</option>
                   </select>
                </div>
             </div>
             
             <div className="flex gap-2">
                <button onClick={handleIssueCard} className="px-4 py-2 bg-brand-900 text-white text-xs font-bold uppercase rounded-sm hover:bg-brand-800">Confirm Issuance</button>
                <button onClick={() => setIsIssuing(false)} className="px-4 py-2 bg-white border border-brand-200 text-brand-600 text-xs font-bold uppercase rounded-sm hover:bg-brand-50">Cancel</button>
             </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="group relative">
             {/* Card Visual */}
             <div className={`
                relative h-56 rounded-xl p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1
                ${card.status === 'FROZEN' ? 'bg-slate-700 grayscale' : 'bg-brand-950'}
                overflow-hidden
             `}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <CreditCard className="w-32 h-32 transform rotate-12" />
                </div>
                
                {/* Status Badge */}
                {card.status === 'FROZEN' && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase flex items-center gap-1">
                     <Lock className="w-3 h-3" /> Frozen
                  </div>
                )}

                <div className="flex justify-between items-start mb-8 relative z-10">
                   <div className="font-mono font-bold tracking-tighter text-lg">PAYFLOW</div>
                   <Wifi className="w-6 h-6 rotate-90 opacity-70" />
                </div>

                <div className="mb-6 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-8 bg-amber-200 rounded-md opacity-80"></div>
                      <div className="font-mono text-xl tracking-widest shadow-black drop-shadow-md">
                         {showNumbers[card.id] ? `4242 4242 4242 ${card.last4}` : `•••• •••• •••• ${card.last4}`}
                      </div>
                   </div>
                </div>

                <div className="flex justify-between items-end relative z-10">
                   <div>
                      <div className="text-[10px] text-brand-300 uppercase tracking-widest mb-1">Cardholder</div>
                      <div className="font-medium text-sm uppercase tracking-wide">{card.holderName}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-brand-300 uppercase tracking-widest mb-1">Expires</div>
                      <div className="font-mono text-sm">{card.expiry}</div>
                   </div>
                </div>
             </div>

             {/* Controls & Metrics */}
             <div className="mt-4 bg-white border border-brand-100 rounded-sm p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-bold text-brand-900 uppercase">{card.type} Card</span>
                   <div className="flex gap-1">
                      <button 
                        onClick={() => onSimulateSpend(card.id, Math.floor(Math.random() * 50) + 10)}
                        className="p-1.5 hover:bg-brand-50 rounded-sm text-brand-400 hover:text-action-500 transition-colors" title="Simulate Transaction"
                      >
                         <Play className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleNumber(card.id)}
                        className="p-1.5 hover:bg-brand-50 rounded-sm text-brand-400 hover:text-brand-900 transition-colors" title="Toggle Number"
                      >
                         {showNumbers[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => toggleFreeze(card.id)}
                        className={`p-1.5 hover:bg-brand-50 rounded-sm transition-colors ${card.status === 'FROZEN' ? 'text-action-500' : 'text-brand-400 hover:text-brand-900'}`} 
                        title="Freeze/Unfreeze"
                      >
                         {card.status === 'FROZEN' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </button>
                   </div>
                </div>

                <div className="mb-2">
                   <div className="flex justify-between text-[10px] font-mono text-brand-500 mb-1">
                      <span>SPENT: {formatCurrency(card.spent, card.currency)}</span>
                      <span>LIMIT: {formatCurrency(card.limit, card.currency)}</span>
                   </div>
                   <div className="w-full h-1.5 bg-brand-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${card.spent / card.limit > 0.9 ? 'bg-data-rose' : 'bg-action-500'}`} 
                        style={{ width: `${Math.min((card.spent / card.limit) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 text-[10px] text-brand-400 mt-3 pt-3 border-t border-brand-50">
                   <Tag className="w-3 h-3 text-brand-500" />
                   <span>Category: {card.smartCategory || 'General Expense'}</span>
                   <span className="ml-auto font-mono text-brand-300">{card.currency}</span>
                </div>
             </div>
          </div>
        ))}
        
        {/* Add Card Placeholder */}
        <button 
          onClick={() => setIsIssuing(true)}
          className="group relative h-56 rounded-xl border-2 border-dashed border-brand-200 hover:border-brand-400 hover:bg-brand-50 transition-all flex flex-col items-center justify-center gap-3 text-brand-400 hover:text-brand-600"
        >
           <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-xs font-bold uppercase tracking-wide">Issue New Card</span>
        </button>
      </div>
    </div>
  );
};