
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from './PageHeader';
import { LiquiditySource, TreasuryForecast, CapitalType } from '../types';
import { forecastLiquidity } from '../services/geminiService';
import { BackendService } from '../services/backend';
import { 
    Lock, ArrowRight, Activity, AlertTriangle, Database, Layers, ArrowUpRight, 
    TrendingUp, Sparkles, X, Plus, PieChart, Zap, Percent, RefreshCw, 
    BarChart3, ShieldAlert, Globe, Server, Cpu, ShieldCheck, Landmark,
    ArrowDownRight, Scale, Network, Fingerprint, Gauge, Search, History,
    BrainCircuit, Key, Info, Target, Sliders, Waves, CheckCircle2, ChevronRight,
    ArrowLeftRight, Shield, Beaker, Coins, FileText, Settings2, Link as LinkIcon,
    SearchCode, ShieldQuestion, ToggleLeft, ShieldPlus, ArrowLeft, Building,
    Trash2, AlertCircle, Share2, Power, Search as SearchIcon, MapPin, ChevronDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

interface TreasuryProps {
  liquiditySources?: LiquiditySource[];
  setLiquiditySources?: React.Dispatch<React.SetStateAction<LiquiditySource[]>>;
  addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const TheVault: React.FC<TreasuryProps> = ({ liquiditySources = [], setLiquiditySources, addNotification }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'YIELD' | 'HEDGING' | 'DIAGNOSTICS'>('OVERVIEW');
  const [isSmartHedgeActive, setIsSmartHedgeActive] = useState(true);
  const [isRebalancing, setIsRebalancing] = useState(false);
  
  // --- NEXUS BRIDGE STATE ---
  const [isAdding, setIsAdding] = useState(false);
  const [bridgeStep, setBridgeStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProtocol, setSelectedProtocol] = useState<'AGGREGATOR' | 'DIRECT_ISO' | 'SWIFT' | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountMetadata, setAccountMetadata] = useState({ accountNo: '', routing: '', iban: '' });
  const [isConnectingNode, setIsConnectingNode] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [isNodeLinked, setIsNodeLinked] = useState(false);

  // Global Bank Registry State
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Europe');
  const [selectedCountry, setSelectedCountry] = useState('United Kingdom');
  const [customBankSearch, setCustomBankSearch] = useState('');

  // --- HEDGING TERMINAL STATE ---
  const [isHedgeWizardOpen, setIsHedgeWizardOpen] = useState(false);
  const [isSensitivityOpen, setIsSensitivityOpen] = useState(false);
  const [selectedHedgeForSensitivity, setSelectedHedgeForSensitivity] = useState<any>(null);
  const [newHedge, setNewHedge] = useState({ pair: 'NGN/USD', volume: '10000000', strike: '1550.00' });
  const [activeHedges, setActiveHedges] = useState([
    { id: 'H-01', pair: 'NGN/USD', volume: '₦25,000,000', strike: '1450.00', status: 'ACTIVE', color: 'bg-emerald-50', sensitivity: 65 }
  ]);

  // --- REAL-TIME TELEMETRY ---
  const [accruedYield, setAccruedYield] = useState(12450.2245);
  const [navPulse, setNavPulse] = useState(1842500.42);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [riskProfile, setRiskProfile] = useState<'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'>('BALANCED');
  const [heartbeats, setHeartbeats] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
        setAccruedYield(prev => prev + 0.00042);
        setNavPulse(prev => prev + (Math.random() > 0.5 ? 2.45 : -1.15));
        const id = Math.random().toString(16).substr(2, 8).toUpperCase();
        setHeartbeats(prev => [`[${new Date().toLocaleTimeString()}] HSM_SIG_VERIFIED: NODE_04_RES_MATCH_${id}`, ...prev].slice(0, 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const displaySources = liquiditySources.length > 0 ? liquiditySources : [
    { id: 'LIQ-1', name: 'Core Capital (Equity)', type: 'EQUITY' as CapitalType, currency: 'USD', capacity: 1000000, deployed: 150000, costOfCapital: 0, status: 'ACTIVE', priority: 1, yieldRate: 4.2 },
    { id: 'LIQ-2', name: 'GBP Settlement Reservoir', type: 'FLOAT' as CapitalType, currency: 'GBP', capacity: 250000, deployed: 45000, costOfCapital: 0, status: 'ACTIVE', priority: 2, yieldRate: 5.1 },
    { id: 'LIQ-3', name: 'NGN Liquidity Pool', type: 'FLOAT' as CapitalType, currency: 'NGN', capacity: 50000000, deployed: 12000000, costOfCapital: 2.1, status: 'ACTIVE', priority: 3, yieldRate: 14.5 },
  ];

  const handleHarvest = async () => {
    if (accruedYield < 0.1 || isHarvesting) return;
    setIsHarvesting(true);
    await new Promise(r => setTimeout(r, 2500));
    setAccruedYield(0.0001);
    setNavPulse(prev => prev + 12450.22);
    setIsHarvesting(false);
    if (addNotification) addNotification('Harvest Successful', 'Institutional yield settled into primary vault.', 'SUCCESS');
  };

  const handleRebalance = async () => {
    setIsRebalancing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsRebalancing(false);
    if (addNotification) addNotification('Corridor Optimized', 'Global liquidity rebalanced successfully.', 'SUCCESS');
  };

  const handleExecuteBridge = async (simulateError: boolean = false) => {
    setIsConnectingNode(true);
    setLinkError(null);
    setHandshakeLogs([]);
    
    const logs = [
        `>> RESOLVING ${selectedBank?.replace(/\s+/g, '_').toUpperCase()}_API...`,
        ">> CHALLENGING HSM_ENCLAVE_SIGNATURE...",
        ">> EXCHANGING DIFFIE-HELLMAN KEYS...",
        ">> VERIFYING ACCOUNT METADATA...",
        ">> ESTABLISHING BILATERAL MIRROR..."
    ];

    for (let i = 0; i < logs.length; i++) {
        await new Promise(r => setTimeout(r, 450));
        setHandshakeLogs(prev => [...prev, logs[i]]);
    }

    if (simulateError) {
        await new Promise(r => setTimeout(r, 1000));
        setLinkError("BACKEND_ORCHESTRATOR_REJECTED_SIGNATURE");
        setHandshakeLogs(prev => [...prev, ">> CRITICAL_ERROR: REMOTE_LEDGER_AUTH_FAILED."]);
        setIsConnectingNode(false);
        if (addNotification) addNotification('Handshake Failed', 'Could not verify remote bank enclave.', 'ERROR');
    } else {
        await new Promise(r => setTimeout(r, 1000));
        setHandshakeLogs(prev => [...prev, ">> COMMITTING MIRROR TO BACKEND LEDGER...", ">> HANDSHAKE_SUCCESS: NODE_LINKED."]);
        
        // Final backend sync simulation
        const result = await BackendService.bindMirrorNode({
            bank: selectedBank!,
            accountNo: accountMetadata.accountNo,
            routing: accountMetadata.routing,
            protocol: selectedProtocol!,
            currency: selectedBank?.toLowerCase().includes('nigeria') || selectedBank?.toLowerCase().includes('bank') ? 'NGN' : (selectedBank?.toLowerCase().includes('uk') || selectedBank?.toLowerCase().includes('halifax')) ? 'GBP' : 'USD'
        });

        // Forced success for the simulation if button clicked was 'Authorize (Success)'
        if (result || true) {
            setIsConnectingNode(false);
            setBridgeStep(4);
            setIsNodeLinked(true);
            if (addNotification) addNotification('Node Binding Successful', `Bilateral mirror established with ${selectedBank}.`, 'SUCCESS');
        }
    }
  };

  const handleAdjustSensitivity = (hedge: any) => {
    setSelectedHedgeForSensitivity({...hedge});
    setIsSensitivityOpen(true);
  };

  const saveSensitivity = () => {
    setActiveHedges(prev => prev.map(h => h.id === selectedHedgeForSensitivity.id ? selectedHedgeForSensitivity : h));
    setIsSensitivityOpen(false);
    if (addNotification) addNotification('Sensitivity Updated', 'Hedge node reactivity adjusted.', 'SUCCESS');
  };

  const handleDeployHedge = async () => {
    if (isHarvesting) return;
    setIsHarvesting(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const deployedHedge = {
        id: `H-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        pair: newHedge.pair,
        volume: `${newHedge.pair.startsWith('NGN') ? '₦' : '$'}${parseInt(newHedge.volume).toLocaleString()}`,
        strike: newHedge.strike,
        status: 'ACTIVE',
        color: 'bg-emerald-50',
        sensitivity: 50
    };
    
    setActiveHedges(prev => [deployedHedge, ...prev]);
    setIsHarvesting(false);
    setIsHedgeWizardOpen(false);
    if (addNotification) addNotification('Hedge Deployed', `Protected ${deployedHedge.pair} corridor liquidity.`, 'SUCCESS');
  };

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : currency === 'GBP' ? 'en-GB' : 'en-US', { 
        style: 'currency', 
        currency: currency, 
        maximumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <PageHeader 
        title="Sovereign Treasury" 
        subtitle="Autonomous control plane mirroring real-world bank enclaves with T+0 atomic reconciliation."
        breadcrumbs={['Workspace', 'Treasury', 'Control Center']}
        status="SECURE"
        actions={
           <div className="flex gap-2">
              <button 
                onClick={handleRebalance}
                disabled={isRebalancing}
                className="px-6 py-2.5 bg-action-50 text-action-600 border border-action-200 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-action-100 transition-all flex items-center gap-3 shadow-sm disabled:opacity-50"
              >
                {isRebalancing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
                {isRebalancing ? 'Optimizing...' : 'Manual Corridor Swap'}
              </button>
              <button 
                onClick={() => { setIsAdding(true); setBridgeStep(1); setLinkError(null); setHandshakeLogs([]); setShowGlobalSearch(false); }}
                className="px-6 py-2.5 bg-brand-950 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl"
              >
                 <Network className="w-3.5 h-3.5 text-action-500" /> Connect Bank Node
              </button>
           </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
         <div className="lg:col-span-8 bg-brand-950 rounded-sm border border-brand-800 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-[10px] font-black text-action-500 uppercase tracking-[0.4em] mb-1">Active_Liquidity_Mirror</h3>
                <p className="text-brand-50 font-mono text-[9px] uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                   System Synchronized with Global HSMs
                </p>
            </div>
            
            <div className="flex h-full items-center justify-around px-20 relative">
                {/* Visual Flow Indicators */}
                <div className="absolute left-1/4 top-1/2 w-1/4 h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-emerald-400 rounded-full animate-flow blur-[2px]"></div>
                </div>
                <div className="absolute right-1/4 top-1/2 w-1/4 h-0.5 bg-gradient-to-l from-action-500/50 to-transparent">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-action-400 rounded-full animate-flow-reverse blur-[2px]"></div>
                </div>

                <div className="flex flex-col items-center gap-4 relative">
                    <div className={`w-16 h-16 bg-brand-900 border rounded-sm flex items-center justify-center group-hover:border-action-500 transition-all cursor-help relative ${isNodeLinked ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-brand-700'}`}>
                        <Landmark className="w-8 h-8 text-white" />
                        {isNodeLinked && <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[7px] font-black px-1 rounded-sm shadow-lg">LINKED</div>}
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-white tracking-widest uppercase">LAG-01</p>
                        <p className="text-[9px] font-mono text-emerald-500">₦{(45000000 + (Math.random() * 5000)).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 relative">
                    <div className="w-20 h-20 bg-brand-900 border-2 border-action-500 rounded-sm flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                        <Globe className="w-10 h-10 text-white animate-[spin_20s_linear_infinite]" />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-white tracking-widest uppercase">LON-HQ</p>
                        <p className="text-[9px] font-mono text-action-500">£124,000.00</p>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 relative">
                    <div className="w-16 h-16 bg-brand-900 border border-brand-700 rounded-sm flex items-center justify-center group-hover:border-emerald-500 transition-all cursor-help relative">
                        <Database className="w-8 h-8 text-white" />
                        <div className="absolute -top-1 -right-1 bg-emerald-500 text-[7px] font-black px-1 rounded-sm shadow-lg text-white">SYNCED</div>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black text-white tracking-widest uppercase">NYC-01</p>
                        <p className="text-[9px] font-mono text-emerald-500 font-bold">${navPulse.toLocaleString()}</p>
                    </div>
                </div>
            </div>
         </div>
         <div className="lg:col-span-4">
            <div className="h-full bg-white border border-brand-100 p-8 rounded-sm shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-105 transition-transform"><PieChart className="w-24 h-24" /></div>
                <h3 className="text-[10px] font-black text-brand-900 uppercase tracking-widest mb-10 flex items-center gap-2 border-b border-brand-50 pb-4">
                    <PieChart className="w-4 h-4 text-action-500" /> Consolidated Asset Base
                </h3>
                <div className="space-y-8">
                    {[
                        { label: 'Settlement Buffer', val: 45, color: 'bg-brand-900' },
                        { label: 'Mirrored Bank Cash', val: 32, color: 'bg-action-500' },
                        { label: 'Yield RWA', val: 23, color: 'bg-emerald-500' }
                    ].map(item => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-tight">{item.label}</span>
                                <span className="text-lg font-mono font-black text-brand-900">{item.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-brand-50 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-9 space-y-6">
            <div className="flex border-b border-brand-100 scrollbar-hide bg-white p-1 rounded-sm shadow-sm overflow-x-auto">
                {[
                    { id: 'OVERVIEW', label: 'Nodes & Liquidity', icon: Landmark },
                    { id: 'YIELD', label: 'Yield Laboratory', icon: Beaker },
                    { id: 'HEDGING', label: 'Hedging Terminal', icon: ShieldCheck },
                    { id: 'DIAGNOSTICS', label: 'Network Health', icon: Activity },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? 'border-action-500 text-brand-900 bg-brand-50/50' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
                    >
                        <t.icon className={`w-3.5 h-3.5 ${activeTab === t.id ? 'text-action-500' : 'text-brand-300'}`} />
                        {t.label}
                    </button>
                ))}
            </div>
            {activeTab === 'OVERVIEW' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  {displaySources.map((source) => (
                     <div key={source.id} className="bg-white border border-brand-200 rounded-sm p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-50 group-hover:bg-action-500 transition-colors"></div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-brand-950 rounded-sm flex items-center justify-center font-black text-white shadow-lg group-hover:scale-105 transition-transform text-xl">
                                 {source.currency === 'USD' ? '$' : source.currency === 'GBP' ? '£' : '₦'}
                              </div>
                              <div>
                                 <h4 className="text-lg font-black text-brand-900 uppercase tracking-tighter italic">{source.name}</h4>
                                 <p className="text-[10px] font-mono text-brand-400 uppercase">{source.type} // PRIORITY_{source.priority}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="block text-2xl font-mono font-black text-brand-900 tracking-tighter tabular-nums">
                                 {source.id === 'LIQ-1' ? formatMoney(navPulse, 'USD') : formatMoney(source.capacity - source.deployed, source.currency)}
                              </span>
                              <span className="text-[9px] text-brand-400 font-black uppercase tracking-widest">Real-time Mirror Balance</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
            {activeTab === 'YIELD' && (
                <div className="space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="bg-brand-950 text-white rounded-sm border border-brand-800 p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform"><Sparkles className="w-64 h-64 text-action-500" /></div>
                        <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 text-action-500 mb-2">
                                    <Zap className="w-6 h-6 fill-current" />
                                    <h3 className="text-xl font-black uppercase tracking-[0.4em] italic">Yield Laboratory</h3>
                                </div>
                                <p className="text-brand-400 text-sm max-w-lg leading-relaxed font-medium uppercase tracking-tight">Harvest spreads from automated RWA lending and institutional liquidity pools.</p>
                            </div>
                            <div className="bg-brand-900/50 border border-brand-800 p-6 text-center rounded-sm shadow-xl min-w-[240px]">
                                <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest mb-2">Institutional Rewards Accrued</p>
                                <p className="text-3xl font-mono font-black text-emerald-400 tabular-nums">
                                    ${accruedYield.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                                </p>
                                <p className="text-[8px] text-brand-600 mt-2 font-mono uppercase">REAL_TIME_ACCUMULATION</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div className="bg-black/40 p-8 rounded-sm border border-brand-800 border-l-4 border-l-emerald-500 group hover:bg-black/60 transition-all">
                                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Scale className="w-4 h-4 text-emerald-500" /> Operational Rewards</h4>
                                <div className="space-y-4 font-mono text-[11px] mb-8">
                                    <div className="flex justify-between border-b border-brand-800 pb-2 text-brand-400 italic">
                                        <span>Protocol_Fees_Share</span>
                                        <span className="text-white font-bold">$4,281.42</span>
                                    </div>
                                    <div className="flex justify-between border-b border-brand-800 pb-2 text-brand-400 italic">
                                        <span>Stable_Staking_L2</span>
                                        <span className="text-white font-bold">$8,168.80</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleHarvest}
                                    disabled={isHarvesting || accruedYield < 1}
                                    className="w-full py-4 bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isHarvesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                                    {isHarvesting ? 'Settling Rewards...' : 'Harvest to Treasury'}
                                </button>
                            </div>
                            <div className="bg-black/40 p-8 rounded-sm border border-brand-800 border-l-4 border-l-action-500">
                                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Sliders className="w-4 h-4 text-action-500" /> Actuarial Profile</h4>
                                <div className="p-4 bg-brand-900/50 rounded-sm mb-8">
                                    <p className="text-[10px] text-brand-500 uppercase font-bold mb-2">Current Strategy</p>
                                    <p className="text-sm font-black text-white tracking-tighter uppercase">{riskProfile}</p>
                                    <p className="text-[9px] text-brand-400 mt-2 italic leading-relaxed">System prioritizes capital preservation with 4.5% baseline APY target.</p>
                                </div>
                                <button 
                                    onClick={() => setShowRiskModal(true)}
                                    disabled={isHarvesting}
                                    className="w-full py-4 border border-brand-800 text-brand-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-sm hover:border-white hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {isHarvesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Settings2 className="w-4 h-4" />}
                                    Re-calibrate Risk Curve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'HEDGING' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-white border border-brand-200 rounded-sm p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-xl font-black text-brand-900 uppercase tracking-tighter italic">Corridor Hedging Terminal</h3>
                                <p className="text-brand-50 text-xs font-mono uppercase tracking-widest mt-1">Automatic protection against cross-border currency devaluation.</p>
                            </div>
                            <button 
                                onClick={() => setIsHedgeWizardOpen(true)}
                                className="px-6 py-2.5 bg-brand-950 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2"
                            >
                                <ShieldPlus className="w-3 h-3 text-action-500" /> New Hedge Node
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeHedges.map((hedge) => (
                                <div key={hedge.id} className={`${hedge.color} border border-brand-200 rounded-sm p-6 relative overflow-hidden group`}>
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShieldCheck className="w-12 h-12" /></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-900 rounded-sm flex items-center justify-center text-white font-bold text-xs uppercase">{hedge.pair.split('/')[0]}</div>
                                            <ArrowRight className="w-4 h-4 text-brand-300" />
                                            <div className="w-10 h-10 bg-brand-900 rounded-sm flex items-center justify-center text-white font-bold text-xs uppercase">{hedge.pair.split('/')[1]}</div>
                                        </div>
                                        <span className={`text-[10px] font-bold ${hedge.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-brand-400 bg-brand-50 border-brand-100'} px-2 py-0.5 rounded-sm border uppercase`}>{hedge.status}</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-brand-400 uppercase tracking-tighter">Protected Volume</span>
                                            <span className="font-mono font-black text-brand-900">{hedge.volume}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-brand-400 uppercase tracking-tighter">Strike Rate (Fixed)</span>
                                            <span className="font-mono font-black text-brand-900">{hedge.strike}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black uppercase text-brand-400">
                                                <span>Sensitivity Matrix</span>
                                                <span>{hedge.sensitivity}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-brand-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-action-500" style={{ width: `${hedge.sensitivity}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-2">
                                        <button 
                                            onClick={() => handleAdjustSensitivity(hedge)}
                                            className="flex-1 py-2.5 text-[9px] font-black uppercase text-brand-400 hover:text-brand-900 border border-brand-200 rounded-sm transition-colors"
                                        >
                                            Adjust Sensitivity
                                        </button>
                                        <button 
                                            onClick={() => setActiveHedges(prev => prev.filter(h => h.id !== hedge.id))}
                                            className="p-2.5 text-brand-300 hover:text-rose-500 border border-brand-200 rounded-sm transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'DIAGNOSTICS' && (
                <div className="bg-white border border-brand-200 rounded-sm p-8 space-y-8 animate-in fade-in duration-500 shadow-sm">
                    <div className="flex justify-between items-center border-b border-brand-50 pb-6">
                        <div>
                            <h3 className="text-xl font-black text-brand-900 uppercase tracking-tighter italic">Network Telemetry</h3>
                            <p className="text-brand-500 text-xs font-mono uppercase tracking-widest mt-1">Status: All Global Nodes Synchronized // 12 Regional Edges Online</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-brand-400 uppercase tracking-widest mb-1">HSM Cluster Latency</p>
                            <div className="flex items-center gap-2 text-xl font-mono font-black text-brand-900">
                                <Activity className="w-5 h-5 text-emerald-500 animate-pulse" /> 14ms
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Security Enclave Handshakes</h4>
                            <div className="p-5 bg-brand-50 border border-brand-100 rounded-sm space-y-4">
                                {[
                                    { node: 'Lagos_Edge_12', status: 'VERIFIED', icon: CheckCircle2, color: 'text-emerald-500' },
                                    { node: 'London_HQ_02', status: 'VERIFIED', icon: CheckCircle2, color: 'text-emerald-500' },
                                    { node: 'NYC_Vault_01', status: 'SYNCHING', icon: RefreshCw, color: 'text-action-500 animate-spin' },
                                ].map(node => (
                                    <div key={node.node} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-300"></div>
                                            <span className="text-xs font-bold text-brand-900 uppercase tracking-tight">{node.node}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 text-[9px] font-black ${node.color.replace(' animate-spin', '')} uppercase tracking-widest`}>
                                            <node.icon className={`w-3.5 h-3.5 ${node.color}`} /> {node.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Institutional Proof of Reserve</h4>
                            <div className="space-y-4">
                                <div className="p-4 border border-brand-100 rounded-sm group hover:border-brand-900 transition-colors">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-brand-700 uppercase">On-Chain Asset Verity</span>
                                        <span className="text-[10px] font-black text-emerald-500">100% MATCHED</span>
                                    </div>
                                    <div className="h-1 bg-brand-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="p-4 border border-brand-100 rounded-sm group hover:border-brand-900 transition-colors">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-[10px] font-bold text-brand-700 uppercase">Regional Bank Clearing (Shadow)</span>
                                        <span className="text-[10px] font-black text-action-500">98.4% SYNCED</span>
                                    </div>
                                    <div className="h-1 bg-brand-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-action-500 w-[98.4%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
         </div>
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-brand-950 rounded-sm border border-brand-800 overflow-hidden shadow-2xl">
                <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center">
                    <span className="text-[9px] font-black text-action-500 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 animate-pulse" /> Digital Ledger Pulse
                    </span>
                </div>
                <div className="p-4 h-48 overflow-y-auto scrollbar-hide space-y-2 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-opacity-5">
                    {heartbeats.map((hb, i) => (
                        <div key={i} className={`font-mono text-[9px] transition-all duration-500 ${i === 0 ? 'text-white' : 'text-brand-600 opacity-60'}`}>
                            {hb}
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* NEXUS BRIDGE: BANK NODE CONNECTION WIZARD */}
      {isAdding && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/98 backdrop-blur-2xl" onClick={() => !isConnectingNode && setIsAdding(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-2xl rounded-sm overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                  <div className="bg-brand-900 text-white p-4 flex justify-between items-center shrink-0 border-b border-brand-800">
                      <div className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-action-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Nexus Bridge: Bank Node Initialization</h3>
                      </div>
                      <button onClick={() => setIsAdding(false)}><X className="w-4 h-4 text-brand-500 hover:text-white" /></button>
                  </div>

                  <div className="p-10 flex-1 overflow-y-auto space-y-10">
                      <div className="flex justify-between items-center max-w-md mx-auto">
                          {[1, 2, 3, 4].map(i => (
                              <div key={i} className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${bridgeStep >= i ? 'bg-action-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-brand-100 text-brand-400'}`}>{i}</div>
                                  {i < 4 && <div className={`w-12 h-px ${bridgeStep > i ? 'bg-action-500' : 'bg-brand-100'}`}></div>}
                              </div>
                          ))}
                      </div>

                      {bridgeStep === 1 && (
                          <div className="space-y-8 animate-in slide-in-from-right-4">
                              <div className="text-center">
                                  <h4 className="text-2xl font-black text-brand-900 uppercase tracking-tighter italic">1. Select Link Protocol</h4>
                                  <p className="text-[10px] text-brand-500 uppercase font-mono mt-1 tracking-widest">Establish organizational uplink tunnel.</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {[
                                      { id: 'AGGREGATOR', label: 'Aggregator Hub', icon: ToggleLeft, desc: 'Plaid / Mono / Stitch', color: 'text-blue-500' },
                                      { id: 'DIRECT_ISO', label: 'Direct ISO-20022', icon: Landmark, desc: 'Tier-1 Institutional Node', color: 'text-emerald-500' },
                                      { id: 'SWIFT', label: 'SWIFT Network', icon: Globe, desc: 'Global Correspondent Rail', color: 'text-amber-500' },
                                  ].map(p => (
                                      <button 
                                        key={p.id}
                                        onClick={() => setSelectedProtocol(p.id as any)}
                                        className={`p-6 border rounded-sm text-left transition-all group ${selectedProtocol === p.id ? 'border-brand-900 bg-brand-50 ring-2 ring-brand-900 shadow-xl' : 'border-brand-100 opacity-60 hover:opacity-100 hover:border-brand-300'}`}
                                      >
                                          <p.icon className={`w-8 h-8 mb-6 ${p.color} transition-transform group-hover:scale-110`} />
                                          <p className="text-xs font-black text-brand-900 uppercase tracking-tight">{p.label}</p>
                                      </button>
                                  ))}
                              </div>
                              <button onClick={() => setBridgeStep(2)} disabled={!selectedProtocol} className="w-full py-5 bg-brand-900 text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-sm shadow-2xl hover:bg-black transition-all disabled:opacity-30">Continue to Institution</button>
                          </div>
                      )}

                      {bridgeStep === 2 && (
                          <div className="space-y-8 animate-in slide-in-from-right-4">
                              <div className="text-center">
                                  <h4 className="text-2xl font-black text-brand-900 uppercase tracking-tighter italic">2. Identify Institution</h4>
                                  <p className="text-[10px] text-brand-500 uppercase font-mono mt-1 tracking-widest">Select from preferred partners or browse global registry.</p>
                              </div>

                              {!showGlobalSearch ? (
                                <>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {[
                                        'Halifax UK',
                                        'Chase UK',
                                        'Guaranty Trust Bank', 
                                        'Chase Manhattan', 
                                        'Barclays PLC',
                                        'Stanbic IBTC Bank',
                                        'Access Bank',
                                        'Standard Chartered', 
                                        'Fidelity Bank'
                                      ].map(bank => (
                                          <button 
                                            key={bank} 
                                            onClick={() => { setSelectedBank(bank); setBridgeStep(3); }}
                                            className={`p-4 border rounded-sm flex items-center gap-4 hover:border-brand-900 transition-all text-left group ${selectedBank === bank ? 'border-brand-900 bg-brand-50' : 'border-brand-100'}`}
                                          >
                                              <div className="w-10 h-10 bg-brand-950 rounded-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                  <Building className="w-5 h-5 text-white" />
                                              </div>
                                              <span className="text-[10px] font-black text-brand-900 uppercase leading-tight">{bank}</span>
                                          </button>
                                      ))}
                                  </div>
                                  <div className="pt-6 border-t border-brand-100 flex flex-col gap-4">
                                      <button 
                                        onClick={() => setShowGlobalSearch(true)}
                                        className="w-full py-4 border border-dashed border-brand-300 text-brand-500 hover:text-brand-900 hover:border-brand-900 transition-all rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                      >
                                          <Globe className="w-4 h-4" /> Browse Global Bank Registry
                                      </button>
                                      <button onClick={() => setBridgeStep(1)} className="text-[10px] font-bold text-brand-400 uppercase flex items-center gap-2 hover:text-brand-900 transition-colors"><ArrowLeft className="w-3 h-3" /> Back to Protocol</button>
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-6 animate-in fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3" /> Region</label>
                                            <div className="relative">
                                                <select 
                                                    value={selectedRegion}
                                                    onChange={e => setSelectedRegion(e.target.value)}
                                                    className="w-full p-3 bg-brand-50 border border-brand-200 rounded-sm text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                                                >
                                                    <option>Africa</option>
                                                    <option>Europe</option>
                                                    <option>North America</option>
                                                    <option>Asia</option>
                                                    <option>Oceania</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1"><Globe className="w-3 h-3" /> Country</label>
                                            <div className="relative">
                                                <select 
                                                    value={selectedCountry}
                                                    onChange={e => setSelectedCountry(e.target.value)}
                                                    className="w-full p-3 bg-brand-50 border border-brand-200 rounded-sm text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer"
                                                >
                                                    {selectedRegion === 'Africa' ? (
                                                        <>
                                                            <option>Nigeria</option>
                                                            <option>Ghana</option>
                                                            <option>Kenya</option>
                                                            <option>South Africa</option>
                                                        </>
                                                    ) : selectedRegion === 'Europe' ? (
                                                        <>
                                                            <option>United Kingdom</option>
                                                            <option>Germany</option>
                                                            <option>France</option>
                                                            <option>Italy</option>
                                                        </>
                                                    ) : (
                                                        <option>United States</option>
                                                    )}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1"><SearchIcon className="w-3 h-3" /> Search Global Database</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={customBankSearch}
                                                onChange={e => setCustomBankSearch(e.target.value)}
                                                placeholder="Enter full legal bank name..."
                                                className="w-full p-4 bg-brand-50 border border-brand-200 rounded-sm text-sm outline-none focus:border-brand-900"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 space-y-4">
                                        {customBankSearch.length > 2 && (
                                            <div className="p-2 bg-brand-50 border border-brand-100 rounded-sm max-h-32 overflow-y-auto">
                                                {[customBankSearch + ' International', customBankSearch + ' Capital', customBankSearch + ' Vault'].map(b => (
                                                    <button 
                                                        key={b}
                                                        onClick={() => { setSelectedBank(b); setBridgeStep(3); }}
                                                        className="w-full p-3 text-left hover:bg-brand-900 hover:text-white text-[10px] font-bold uppercase transition-colors"
                                                    >
                                                        {b}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setShowGlobalSearch(false)}
                                                className="px-4 py-3 bg-brand-100 text-brand-900 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-brand-200 transition-all flex items-center gap-2"
                                            >
                                                <ArrowLeft className="w-3 h-3" /> Preferred
                                            </button>
                                            <button 
                                                disabled={!customBankSearch}
                                                onClick={() => { setSelectedBank(customBankSearch); setBridgeStep(3); }}
                                                className="flex-1 py-3 bg-brand-950 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-30"
                                            >
                                                Confirm Node Entry
                                            </button>
                                        </div>
                                    </div>
                                </div>
                              )}
                          </div>
                      )}

                      {bridgeStep === 3 && (
                          <div className="space-y-8 animate-in slide-in-from-right-4">
                              <div className="text-center">
                                  <h4 className="text-2xl font-black text-brand-900 uppercase tracking-tighter italic">3. Ledger Metadata Mapping</h4>
                                  <p className="text-[10px] text-brand-50 uppercase font-mono tracking-widest">TARGET: {selectedBank} via {selectedProtocol}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="group">
                                      <label className="block text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2 group-focus-within:text-brand-950 transition-colors">Account Identification No.</label>
                                      <input type="text" value={accountMetadata.accountNo} onChange={e => setAccountMetadata({...accountMetadata, accountNo: e.target.value})} className="w-full p-4 bg-brand-50 border border-brand-200 rounded-sm font-mono text-sm outline-none focus:border-action-500 transition-all shadow-inner" placeholder="0123456789" />
                                  </div>
                                  <div className="group">
                                      <label className="block text-[10px] font-black text-brand-400 uppercase tracking-widest mb-2 group-focus-within:text-brand-950 transition-colors">Sort Code / Routing</label>
                                      <input type="text" value={accountMetadata.routing} onChange={e => setAccountMetadata({...accountMetadata, routing: e.target.value})} className="w-full p-4 bg-brand-50 border border-brand-200 rounded-sm font-mono text-sm outline-none focus:border-action-500 transition-all shadow-inner" placeholder="00-11-22" />
                                  </div>
                              </div>

                              {linkError && (
                                <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm flex gap-3 text-rose-600 animate-in shake duration-300">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-tight">Handshake Error: {linkError}</p>
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleExecuteBridge(false)} 
                                    disabled={!accountMetadata.accountNo || isConnectingNode} 
                                    className="relative py-5 bg-emerald-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-sm flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-30 group"
                                >
                                    {isConnectingNode && !linkError ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <><ShieldCheck className="w-4 h-4" /> Authorize (Success)</>}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-950 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Perform Valid Handshake</div>
                                </button>
                                <button 
                                    onClick={() => handleExecuteBridge(true)} 
                                    disabled={!accountMetadata.accountNo || isConnectingNode} 
                                    className="py-5 bg-rose-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-sm flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg disabled:opacity-30 group"
                                >
                                    {isConnectingNode && linkError ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <><ShieldAlert className="w-4 h-4" /> Simulate Fail</>}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-950 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Test Error Response</div>
                                </button>
                              </div>
                              
                              {(isConnectingNode || handshakeLogs.length > 0) && (
                                  <div className="w-full bg-brand-950 p-6 rounded-sm font-mono text-[10px] text-action-500 space-y-1 h-40 overflow-y-auto shadow-inner border border-brand-800">
                                      {handshakeLogs.map((log, i) => <p key={i} className={i === handshakeLogs.length - 1 && isConnectingNode ? 'animate-pulse font-black' : 'opacity-60'}>{log}</p>)}
                                  </div>
                              )}
                          </div>
                      )}

                      {bridgeStep === 4 && (
                          <div className="space-y-10 animate-in zoom-in-95 text-center py-10">
                              <div className="relative mx-auto w-32 h-32">
                                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                  <div className="relative w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                      <CheckCircle2 className="w-16 h-16" />
                                  </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-3xl font-black text-brand-900 uppercase tracking-tighter italic">Mirror Sync Active</h4>
                                <p className="text-brand-50 text-sm">Account <strong>{selectedBank} ({accountMetadata.accountNo})</strong> officially committed to the Corporate Balance Sheet.</p>
                              </div>
                              <button onClick={() => setIsAdding(false)} className="w-full py-5 bg-brand-950 text-white font-black uppercase text-xs tracking-[0.4em] rounded-sm shadow-2xl hover:bg-black transition-all">Return to Control Deck</button>
                          </div>
                      )}
                  </div>
                  
                  {bridgeStep < 4 && (
                      <div className="p-4 bg-brand-50 border-t border-brand-100 text-center shrink-0">
                        <div className="flex justify-center items-center gap-1.5 mb-2">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${bridgeStep >= s ? 'bg-action-500' : 'bg-brand-100'}`}></div>
                            ))}
                        </div>
                        <span className="text-[8px] font-mono font-black text-brand-400 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Lock className="w-2.5 h-2.5" /> SECURE_HANDSHAKE_v4.1_TUNNEL_ACTIVE
                        </span>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* ADJUST SENSITIVITY MODAL */}
      {isSensitivityOpen && selectedHedgeForSensitivity && (
          <div className="fixed inset-0 z-[450] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-xl" onClick={() => setIsSensitivityOpen(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-sm rounded-sm overflow-hidden animate-in zoom-in-95 p-8">
                  <h3 className="text-sm font-black text-brand-900 uppercase tracking-widest mb-6">Hedge Node Sensitivity</h3>
                  <p className="text-xs text-brand-500 mb-8 leading-relaxed">Adjust how aggressively the Oracle rebalances this corridor in response to market volatility.</p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center font-mono text-xs font-bold text-brand-900">
                        <span>Reactivity</span>
                        <span className="text-action-500">{selectedHedgeForSensitivity.sensitivity}%</span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={selectedHedgeForSensitivity.sensitivity} 
                        onChange={(e) => setSelectedHedgeForSensitivity({...selectedHedgeForSensitivity, sensitivity: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-brand-100 rounded-full appearance-none accent-action-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-brand-400 font-black uppercase">
                        <span>Passive</span>
                        <span>Hyper-Active</span>
                    </div>
                  </div>

                  <button 
                    onClick={saveSensitivity}
                    className="w-full py-4 bg-brand-950 text-white font-black uppercase text-[10px] tracking-widest rounded-sm hover:bg-black transition-all shadow-xl"
                  >
                    Commit Adjustment
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
