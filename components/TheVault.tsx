import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { LiquiditySource, TreasuryForecast, CapitalType } from '../types';
import { forecastLiquidity } from '../services/geminiService';
import { Lock, ArrowRight, Activity, AlertTriangle, Database, Layers, ArrowUpRight, TrendingUp, Sparkles, X, Plus, PieChart, Zap, Percent, RefreshCw, BarChart3, ShieldAlert } from 'lucide-react';

interface TreasuryProps {
  liquiditySources?: LiquiditySource[];
  setLiquiditySources?: React.Dispatch<React.SetStateAction<LiquiditySource[]>>;
  addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

const PROMPT = "... ";
export const TheVault: React.FC<TreasuryProps> = ({ liquiditySources = [], setLiquiditySources, addNotification }) => {
  const [forecast, setForecast] = useState<TreasuryForecast | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'YIELD' | 'HEDGING'>('OVERVIEW');
  const [isSmartHedgeActive, setIsSmartHedgeActive] = useState(true);

  // New Source State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<CapitalType>('FLOAT');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newCapacity, setNewCapacity] = useState('');

  const displaySources = liquiditySources.length > 0 ? liquiditySources : [
    { id: 'LIQ-1', name: 'Core Capital (Equity)', type: 'EQUITY' as CapitalType, currency: 'USD', capacity: 1000000, deployed: 150000, costOfCapital: 0, status: 'ACTIVE', priority: 1, yieldRate: 4.2 },
    { id: 'LIQ-2', name: 'GBP Settlement Reservoir', type: 'FLOAT' as CapitalType, currency: 'GBP', capacity: 250000, deployed: 45000, costOfCapital: 0, status: 'ACTIVE', priority: 2, yieldRate: 5.1 },
    { id: 'LIQ-3', name: 'NGN Liquidity Pool', type: 'FLOAT' as CapitalType, currency: 'NGN', capacity: 50000000, deployed: 12000000, costOfCapital: 2.1, status: 'ACTIVE', priority: 3, yieldRate: 14.5 },
  ];

  useEffect(() => {
    const fetchForecast = async () => {
      const result = await forecastLiquidity(displaySources as LiquiditySource[]);
      setForecast(result);
    };
    fetchForecast();
  }, [displaySources]);

  const handleAddSource = () => {
    if (!newName || !newCapacity || !setLiquiditySources) return;

    const newSource: LiquiditySource = {
        id: `LIQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name: newName,
        type: newType,
        currency: newCurrency,
        capacity: parseFloat(newCapacity),
        deployed: 0,
        costOfCapital: newType === 'DEBT' ? 8.5 : newType === 'FLOAT' ? 2.1 : 0,
        status: 'ACTIVE',
        priority: 2,
        yieldRate: newType === 'EQUITY' ? 4.5 : 2.0
    };

    setLiquiditySources(prev => [...prev, newSource]);
    if (addNotification) addNotification('Liquidity Connected', `Added ${newCurrency} ${newType} source`, 'SUCCESS');
    setIsAdding(false);
  };

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : currency === 'GBP' ? 'en-GB' : 'en-US', { 
        style: 'currency', 
        currency: currency, 
        maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Global Treasury OS" 
        subtitle="Intelligent capital management with cross-border yield optimization."
        breadcrumbs={['Workspace', 'Treasury', 'The Vault']}
        status="SECURE"
        actions={
           <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('YIELD')}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'YIELD' ? 'bg-action-500 text-white shadow-md' : 'bg-white text-brand-600 border border-brand-200'}`}
              >
                 <TrendingUp className="w-3.5 h-3.5" /> Optimize Yield
              </button>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-brand-950 text-white rounded-sm text-xs font-bold uppercase hover:bg-brand-900 transition-colors flex items-center gap-2"
              >
                 <Database className="w-3 h-3" /> Add Capital Base
              </button>
           </div>
        }
      />

      {/* Next-Gen Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl relative overflow-hidden border border-brand-800">
            <div className="absolute top-0 right-0 p-2 opacity-10"><PieChart className="w-20 h-20" /></div>
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Treasury NAV</p>
            <p className="text-3xl font-mono font-medium">$1,842,500</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
               <ArrowUpRight className="w-3 h-3" /> +1.2% TODAY
            </div>
         </div>
         <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Blended Yield (APY)</p>
            <p className="text-3xl font-mono font-medium text-brand-900">6.84%</p>
            <p className="mt-4 text-[10px] text-brand-500 font-mono">AUTOMATED REBALANCING: <span className="text-data-emerald">ON</span></p>
         </div>
         <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Settlement Buffer</p>
            <p className="text-3xl font-mono font-medium text-brand-900">45%</p>
            <p className="mt-4 text-[10px] text-brand-500 font-mono">READY FOR MASS PAYOUTS</p>
         </div>
         <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm border-l-4 border-l-amber-500">
            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">FX Exposure</p>
            <p className="text-3xl font-mono font-medium text-brand-900">High</p>
            <p className="mt-4 text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1">
               <ShieldAlert className="w-3 h-3" /> Hedge Suggested
            </p>
         </div>
      </div>

      {/* Tabs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'OVERVIEW' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                  <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                     <Layers className="w-4 h-4" /> Capital Allocation Waterfall
                  </h3>
                  {displaySources.map((source) => (
                     <div key={source.id} className="bg-white border border-brand-200 rounded-sm p-5 hover:border-brand-400 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-brand-50 rounded-sm flex items-center justify-center font-bold text-brand-900 border border-brand-200">
                                 {source.currency === 'USD' ? '$' : source.currency === 'GBP' ? '£' : '₦'}
                              </div>
                              <div>
                                 <h4 className="font-bold text-brand-900">{source.name}</h4>
                                 <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] font-mono bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-sm uppercase">{source.type}</span>
                                    <span className="text-[9px] font-bold text-data-emerald uppercase flex items-center gap-0.5"><Percent className="w-2.5 h-2.5" /> {source.yieldRate}% APY</span>
                                 </div>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="block text-lg font-mono font-bold text-brand-900">{formatMoney(source.capacity - source.deployed, source.currency)}</span>
                              <span className="text-[9px] text-brand-400 font-bold uppercase">AVAILABLE LIQUIDITY</span>
                           </div>
                        </div>
                        <div className="w-full h-1 bg-brand-100 rounded-full overflow-hidden">
                           <div className="h-full bg-action-500" style={{ width: `${(source.deployed/source.capacity)*100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {activeTab === 'YIELD' && (
               <div className="bg-brand-950 text-white rounded-sm border border-brand-800 p-8 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-start mb-10">
                     <div>
                        <div className="flex items-center gap-2 text-action-500 mb-2">
                           <Zap className="w-5 h-5 fill-current" />
                           <h3 className="text-sm font-bold uppercase tracking-widest">Yield Optimization Hub</h3>
                        </div>
                        <p className="text-brand-400 text-sm max-w-md">The system is currently routing idle capital into Grade-A Corporate Bonds and Stablecoin Staking pools.</p>
                     </div>
                     <div className="bg-brand-900 px-4 py-3 rounded-sm border border-brand-800 text-center">
                        <p className="text-[9px] text-brand-500 uppercase mb-1">Accrued Profit (YTD)</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">+$12,450.22</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-brand-900/50 p-6 rounded-sm border border-brand-800 border-l-4 border-l-emerald-500">
                        <h4 className="text-xs font-bold text-white uppercase mb-4">Current Staking Strategy</h4>
                        <div className="space-y-3 font-mono text-xs">
                           <div className="flex justify-between border-b border-brand-800 pb-2 text-brand-300">
                              <span>USDC-Anchor (USD)</span>
                              <span className="text-emerald-400 font-bold">12.5% APY</span>
                           </div>
                           <div className="flex justify-between border-b border-brand-800 pb-2 text-brand-300">
                              <span>T-Bills Tokenized</span>
                              <span className="text-emerald-400 font-bold">5.2% APY</span>
                           </div>
                        </div>
                     </div>
                     <div className="bg-brand-900/50 p-6 rounded-sm border border-brand-800 border-l-4 border-l-action-500">
                        <h4 className="text-xs font-bold text-white uppercase mb-4">Risk Profile: Conservative</h4>
                        <p className="text-[10px] text-brand-400 leading-relaxed italic">"Liquidity is prioritized. 95% of assets can be recalled to the settlement engine in under 24 hours."</p>
                        <button className="mt-4 w-full py-2 bg-brand-800 text-[10px] font-bold uppercase hover:bg-brand-700 transition-colors">Modify Strategy</button>
                     </div>
                  </div>
               </div>
            )}
         </div>

         <div className="space-y-4">
            <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm">
               <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" /> Smart Hedge Control
               </h3>
               <div className="flex items-center justify-between p-4 bg-brand-50 border border-brand-200 rounded-sm mb-4">
                  <div>
                     <p className="text-xs font-bold text-brand-900 uppercase">Auto-Stable Protection</p>
                     <p className="text-[9px] text-brand-500 uppercase mt-1">Hedges NGN exposure when volatility {'>'} 2%</p>
                  </div>
                  <button 
                     onClick={() => setIsSmartHedgeActive(!isSmartHedgeActive)}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isSmartHedgeActive ? 'bg-action-500' : 'bg-brand-200'}`}
                  >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSmartHedgeActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
               </div>
               <div className="p-4 bg-brand-950 text-white rounded-sm font-mono text-[10px] space-y-2">
                  <p className="text-brand-500">{PROMPT}MONITORING NGN/USD...</p>
                  <p className="text-emerald-400">{PROMPT}SPREAD OPTIMAL (0.12%)</p>
                  <p className="text-brand-500">{PROMPT}LAST HEDGE ACTION: 4h AGO</p>
               </div>
            </div>

            <div className="bg-brand-50 p-6 rounded-sm border border-brand-200 border-dashed text-center">
               <RefreshCw className="w-6 h-6 text-brand-300 mx-auto mb-3 animate-spin-slow" />
               <p className="text-xs font-bold text-brand-900 uppercase">Live Oracle Feed</p>
               <p className="text-[10px] text-brand-500 mt-1 uppercase">Synchronizing Treasury with 14 global liquidity nodes.</p>
            </div>
         </div>
      </div>

      {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-xl w-full max-w-md rounded-sm overflow-hidden">
                  <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">Connect Capital Rail</h3>
                      <button onClick={() => setIsAdding(false)}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-[10px] font-bold text-brand-500 uppercase mb-1">Entity Name</label>
                          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm" placeholder="e.g. European Operating Account" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-bold text-brand-500 uppercase mb-1">Capital Type</label>
                              <select value={newType} onChange={e => setNewType(e.target.value as CapitalType)} className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm">
                                  <option value="EQUITY">Equity</option>
                                  <option value="FLOAT">Float</option>
                                  <option value="DEBT">Debt</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-brand-500 uppercase mb-1">Currency</label>
                              <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)} className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm">
                                  <option value="USD">USD</option>
                                  <option value="GBP">GBP</option>
                                  <option value="NGN">NGN</option>
                                  <option value="EUR">EUR</option>
                              </select>
                          </div>
                      </div>
                      <button onClick={handleAddSource} className="w-full py-3 bg-action-500 text-white font-bold uppercase text-xs rounded-sm hover:bg-action-600 transition-colors">Integrate Capital Source</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};