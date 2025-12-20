
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { BackendService } from '../services/backend';
import { MarketRegion, AuditLog } from '../types';
import { 
  Save, Building, Mail, Activity, Globe, Check, AlertTriangle, ArrowRight, Zap, 
  RefreshCw, CreditCard, Landmark, Smartphone, Lock, Plus, X, Trash2, 
  Loader2, Shield, Clock, Network, Wallet, Bitcoin, WifiOff, Fingerprint, 
  ShieldCheck, ShieldAlert, History, Key, Eye, EyeOff, Server, Sliders,
  Download, PlusCircle
} from 'lucide-react';

type Tab = 'GENERAL' | 'MARKETS' | 'PAYOUTS' | 'SECURITY' | 'AUDIT';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('MARKETS');
  const [regions, setRegions] = useState<MarketRegion[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isAddingRegion, setIsAddingRegion] = useState(false);
  const [newRegionForm, setNewRegionForm] = useState({ name: '', code: '', currency: 'USD' });
  const [addingRailTo, setAddingRailTo] = useState<string | null>(null);
  const [newRailName, setNewRailName] = useState('');
  const [isLocal, setIsLocal] = useState(false);

  // --- SECURITY STATES ---
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [isRotatingKeys, setIsRotatingKeys] = useState(false);
  const [ipList, setIpList] = useState(['192.168.1.1', '10.0.0.42']);
  const [newIp, setNewIp] = useState('');
  const [isAddingIp, setIsAddingIp] = useState(false);

  // --- PAYOUT STATES ---
  const [autoWithdraw, setAutoWithdraw] = useState(true);
  const [payoutThreshold, setPayoutThreshold] = useState('5000');

  // --- AUDIT LOGS ---
  const [auditLogs] = useState([
    { ts: '2025-06-12 14:10', user: 'JDoe', action: 'RAIL_CONFIG_UPDATE', target: 'NG_GTBANK', ip: '10.0.0.42' },
    { ts: '2025-06-12 11:22', user: 'SSmith', action: 'PAYOUT_THRESHOLD_CHANGE', target: 'TREASURY', ip: '192.168.1.1' },
    { ts: '2025-06-11 18:45', user: 'SYSTEM', action: 'HSM_HEARTBEAT_SYNC', target: 'LOCAL_NODE_04', ip: 'internal' },
    { ts: '2025-06-11 09:12', user: 'JDoe', action: 'USER_ROLE_ESCALATION', target: 'MJohnson', ip: '10.0.0.42' },
  ]);

  const loadRegions = async () => {
    setIsLoadingRegions(true);
    const data = await BackendService.getRegions();
    if (data && data.length > 0) {
        setRegions(data);
        setIsLocal(false);
    } else {
        setIsLocal(true);
        setRegions([
            { id: 'REG-NG', name: 'Nigeria (West Africa)', code: 'NG', currency: 'NGN', fxRate: 1485, status: 'ACTIVE', compliance: 'VERIFIED', rails: ['Bank', 'Mobile Money'] },
            { id: 'REG-UK', name: 'United Kingdom', code: 'UK', currency: 'GBP', fxRate: 0.79, status: 'ACTIVE', compliance: 'VERIFIED', rails: ['Bank', 'Card'] }
        ]);
    }
    setIsLoadingRegions(false);
  };

  useEffect(() => {
    if (activeTab === 'MARKETS') {
        loadRegions();
    }
  }, [activeTab]);

  // --- HANDLERS ---

  const handleRotateKeys = () => {
    setIsRotatingKeys(true);
    setTimeout(() => {
        setIsRotatingKeys(false);
        alert("HSM Re-keying successful. Master keys rotated across 3 nodes.");
    }, 2500);
  };

  const handleAddIp = () => {
    if (!newIp) return;
    setIpList([...ipList, newIp]);
    setNewIp('');
    setIsAddingIp(false);
  };

  const removeIp = (ip: string) => {
    setIpList(ipList.filter(i => i !== ip));
  };

  const downloadAuditCSV = () => {
    const headers = "Timestamp,User,Action,Target,IP\n";
    const rows = auditLogs.map(log => `${log.ts},${log.user},${log.action},${log.target},${log.ip}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `payflow_audit_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleToggleRegion = async (id: string) => {
    setRegions(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r));
    await BackendService.toggleRegionStatus(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Configuration" 
        subtitle="Manage entity details, security enclaves, and global market nodes."
        breadcrumbs={['Workspace', 'Admin', 'Settings']}
        status={isLoadingRegions ? "SYNCING" : "SECURE"}
      />

      <div className="flex border-b border-brand-100 overflow-x-auto mb-8 scrollbar-hide">
        {['GENERAL', 'MARKETS', 'PAYOUTS', 'SECURITY', 'AUDIT'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all whitespace-nowrap ${activeTab === t ? 'border-action-500 text-brand-900' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* GENERAL TAB */}
          {activeTab === 'GENERAL' && (
            <div className="bg-white p-8 rounded-sm border border-brand-100 shadow-sm space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Legal Entity Name</label>
                  <input className="w-full px-4 py-3 bg-brand-50 border border-brand-200 rounded-sm text-sm font-medium outline-none focus:border-action-500 transition-all" defaultValue="Acme Global Corporation" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Support Email</label>
                  <input className="w-full px-4 py-3 bg-brand-50 border border-brand-200 rounded-sm text-sm font-medium outline-none focus:border-action-500 transition-all" defaultValue="ops@acme-global.com" />
                </div>
              </div>
              <div className="pt-6 border-t border-brand-50">
                <button className="bg-brand-950 text-white px-8 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg">
                  <Save className="w-3.5 h-3.5" /> Save Entity Details
                </button>
              </div>
            </div>
          )}

          {/* MARKETS TAB */}
          {activeTab === 'MARKETS' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-brand-900 uppercase">Active Market Nodes</h3>
                    {isLocal && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-sm text-[9px] font-bold font-mono">
                            <WifiOff className="w-2.5 h-2.5" /> LOCAL_MODE
                        </span>
                    )}
                </div>
                <button onClick={() => setIsAddingRegion(true)} className="bg-brand-950 text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-black transition-all shadow-md">
                   <Plus className="w-3 h-3" /> Provision New Region
                </button>
              </div>

              {isLoadingRegions && regions.length === 0 ? (
                <div className="p-20 text-center bg-white border border-brand-100 rounded-sm">
                   <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-action-500" />
                   <p className="text-brand-500 font-mono text-xs uppercase tracking-widest">Syncing Global Mesh...</p>
                </div>
              ) : (
                regions.map(region => (
                  <div key={region.id} className={`bg-white border p-6 rounded-sm transition-all ${region.status === 'ACTIVE' ? 'border-brand-200 shadow-sm' : 'border-brand-100 opacity-60'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-brand-950 text-white rounded-sm flex items-center justify-center font-black text-lg">{region.code}</div>
                            <div>
                                <h4 className="font-bold text-brand-900 uppercase tracking-tight">{region.name}</h4>
                                <p className="text-[10px] text-brand-500 font-mono mt-0.5">Currency: {region.currency} • Node: {region.id}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleToggleRegion(region.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${region.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-brand-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${region.status === 'ACTIVE' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PAYOUTS TAB */}
          {activeTab === 'PAYOUTS' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm space-y-8">
                   <div>
                      <h3 className="text-sm font-bold text-brand-900 uppercase tracking-tight mb-2">Automated Settlement Velocity</h3>
                      <p className="text-xs text-brand-500">Configure when and how your global funds are released to your primary local banking rail.</p>
                   </div>

                   <div className="flex items-center justify-between p-6 bg-brand-50 rounded-sm border border-brand-100">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-brand-950 text-action-500 rounded-sm flex items-center justify-center">
                            <Zap className="w-5 h-5 fill-current" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-brand-900 uppercase">Auto-Sweep Liquidity</p>
                            <p className="text-[10px] text-brand-500 mt-1 uppercase">Move funds to bank immediately upon clearance.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setAutoWithdraw(!autoWithdraw)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${autoWithdraw ? 'bg-emerald-500' : 'bg-brand-200'}`}
                      >
                         <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoWithdraw ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'SECURITY' && (
             <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm space-y-6">
                      <div className="flex items-center gap-3 text-brand-900 border-b border-brand-100 pb-4">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                         <h3 className="text-xs font-bold uppercase tracking-widest">HSM Enclave</h3>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between text-xs">
                            <span className="text-brand-500">Node Cluster Status</span>
                            <span className="text-emerald-600 font-bold uppercase">Operational</span>
                         </div>
                         <div className="flex justify-between text-xs">
                            <span className="text-brand-500">Encryption Level</span>
                            <span className="text-brand-900 font-mono font-bold uppercase">AES-256-GCM</span>
                         </div>
                         <button 
                            onClick={handleRotateKeys}
                            disabled={isRotatingKeys}
                            className="w-full py-3 bg-brand-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                         >
                            {isRotatingKeys ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                            Rotate Master Keys
                         </button>
                      </div>
                   </div>

                   <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm space-y-6">
                      <div className="flex items-center gap-3 text-brand-900 border-b border-brand-100 pb-4">
                         <Fingerprint className="w-5 h-5 text-action-500" />
                         <h3 className="text-xs font-bold uppercase tracking-widest">2-Step Verification</h3>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[11px] text-brand-500 leading-relaxed uppercase">MFA is required for all high-value treasury movements.</p>
                         <button 
                            onClick={() => setMfaEnabled(!mfaEnabled)}
                            className={`w-full py-3 border-2 font-bold uppercase text-[10px] tracking-widest rounded-sm transition-all ${mfaEnabled ? 'border-brand-100 text-brand-400' : 'border-action-500 text-action-500'}`}
                         >
                            {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                         </button>
                      </div>
                   </div>
                </div>

                <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Trusted IP Whitelist
                      </h3>
                      {isAddingIp ? (
                        <div className="flex gap-2 animate-in slide-in-from-right-2">
                            <input 
                                autoFocus
                                value={newIp}
                                onChange={(e) => setNewIp(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddIp()}
                                placeholder="e.g. 192.168.1.1"
                                className="px-3 py-1 border border-brand-200 rounded-sm text-xs font-mono outline-none focus:border-action-500"
                            />
                            <button onClick={handleAddIp} className="text-[10px] font-bold text-emerald-600 uppercase">Save</button>
                            <button onClick={() => setIsAddingIp(false)} className="text-[10px] font-bold text-brand-300 uppercase">Esc</button>
                        </div>
                      ) : (
                        <button onClick={() => setIsAddingIp(true)} className="text-[10px] font-bold text-action-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                            <PlusCircle className="w-3 h-3" /> Add Authorised IP
                        </button>
                      )}
                   </div>
                   <div className="space-y-3">
                      {ipList.map(ip => (
                         <div key={ip} className="flex justify-between items-center p-3 bg-brand-50 rounded-sm border border-brand-100 group">
                            <code className="text-xs font-mono text-brand-900">{ip}</code>
                            <button onClick={() => removeIp(ip)} className="text-brand-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === 'AUDIT' && (
             <div className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-sm animate-in fade-in">
                <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                   <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest">Global Action Ledger</h3>
                   <button 
                    onClick={downloadAuditCSV}
                    className="text-[10px] font-bold text-action-500 uppercase hover:underline flex items-center gap-1.5"
                   >
                     <Download className="w-3.5 h-3.5" /> Download CSV
                   </button>
                </div>
                <div className="divide-y divide-brand-50 max-h-[500px] overflow-y-auto font-mono">
                   {auditLogs.map((log, i) => (
                      <div key={i} className="p-4 text-[10px] grid grid-cols-12 gap-4 items-center hover:bg-brand-50 transition-colors">
                         <span className="col-span-2 text-brand-400">{log.ts}</span>
                         <span className="col-span-2 font-bold text-brand-900">{log.user}</span>
                         <span className="col-span-4 text-brand-700 font-bold">{log.action}</span>
                         <span className="col-span-2 text-brand-500">{log.target}</span>
                         <span className="col-span-2 text-right text-brand-300">{log.ip}</span>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-4">
             <div className="bg-brand-950 p-6 rounded-sm text-white border border-brand-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-32 h-32" /></div>
                <div className="flex items-center gap-2 mb-6 text-action-500">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Network Synchronization</span>
                </div>
                <div className="space-y-4 relative z-10 font-mono">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-brand-500">ORCHESTRATOR_SYNC</span>
                        <span className={isLocal ? 'text-rose-400' : 'text-emerald-400'}>{isLocal ? 'LOCAL_BYPASS' : 'ACTIVE'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-brand-500">ACTIVE_NODES</span>
                        <span className="text-white">{regions.length} Units</span>
                    </div>
                    <div className="h-1 bg-brand-900 rounded-full overflow-hidden">
                        <div className={`h-full bg-action-500 animate-pulse ${isLocal ? 'w-full' : 'w-2/3'}`}></div>
                    </div>
                </div>
             </div>
             
             {isLocal && (
                 <div className="p-5 bg-rose-950/20 border border-rose-900/50 rounded-sm text-rose-500 flex gap-3 items-start animate-in zoom-in-95">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Backend Offline</h4>
                        <p className="text-[10px] leading-relaxed mt-1 uppercase">Cloud sync is unavailable. Your local Node server is not responding at http://localhost:5000. Changes will be cached locally.</p>
                    </div>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
