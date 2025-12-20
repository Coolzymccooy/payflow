
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Zap, ShieldCheck, AlertTriangle, ArrowUpRight, History, RefreshCw, Lock, DollarSign, Percent, Info, ShieldAlert, CheckCircle2, Siren, X, ChevronRight, Activity } from 'lucide-react';
import { VelocityConfig } from '../types';

export const VelocitySettlement: React.FC = () => {
    const [config, setConfig] = useState<VelocityConfig>({
        isEnabled: true,
        payoutPercentage: 90,
        reservePercentage: 10,
        reserveBalance: 12450.00,
        trustScore: 94,
        lastAuditDate: new Date().toISOString(),
        trustLevel: 'LEVEL_2_PRO'
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    const handleToggle = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
            setIsUpdating(false);
        }, 1000);
    };

    const handleRequestIncrease = () => {
        setRequestLoading(true);
        setTimeout(() => {
            setRequestLoading(false);
            setRequestSuccess(true);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader 
                title="Velocity Settlement" 
                subtitle="High-frequency T+0 capital bypass for verified merchants."
                breadcrumbs={['Workspace', 'Finance', 'Velocity']}
                status="LIVE"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Control Center */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-brand-950 text-white rounded-sm p-8 shadow-2xl relative overflow-hidden border border-brand-800">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-48 h-48" /></div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-tighter mb-2">Instant Cashout Status</h3>
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${config.isEnabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                                        {config.isEnabled ? 'ACTIVE_T+0' : 'STANDARD_T+1'}
                                    </div>
                                    <span className="text-[10px] font-mono text-brand-500">HSM_UPTIME: 99.99%</span>
                                </div>
                            </div>
                            <button 
                                onClick={handleToggle}
                                disabled={isUpdating}
                                className={`px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${config.isEnabled ? 'bg-rose-600 hover:bg-rose-700' : 'bg-action-500 hover:bg-action-600'} flex items-center justify-center gap-2 shadow-xl`}
                            >
                                {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : config.isEnabled ? <><Lock className="w-3 h-3" /> Terminate Velocity</> : <><Zap className="w-3 h-3 fill-current" /> Initialize Velocity</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 border-t border-brand-900 pt-8">
                            <div className="space-y-1">
                                <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Instant Release</p>
                                <p className="text-4xl font-mono font-bold text-white">{config.payoutPercentage}%</p>
                                <p className="text-[9px] text-brand-400 font-mono mt-2 uppercase tracking-tighter">Settled via Local Mesh Node</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Rolling Reserve</p>
                                <p className="text-4xl font-mono font-bold text-action-500">{config.reservePercentage}%</p>
                                <p className="text-[9px] text-brand-400 font-mono mt-2 uppercase tracking-tighter">Held for 30-Day Risk Mitigation</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Trust Index</p>
                                <p className="text-4xl font-mono font-bold text-emerald-400">{config.trustScore}/100</p>
                                <p className="text-[9px] text-brand-400 font-mono mt-2 uppercase tracking-tighter">Evaluated by Oracle Reasoning</p>
                            </div>
                        </div>
                    </div>

                    {/* Digitized Reserve Pool Ledger */}
                    <div className="bg-brand-950 border border-brand-800 rounded-sm overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-brand-900 flex justify-between items-center bg-black/40">
                            <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3">
                                <Activity className="w-4 h-4 text-action-500" /> Reserve Liquidity Matrix
                            </h3>
                            <div className="text-right">
                                <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest">Collateral Balance</p>
                                <p className="text-xl font-mono font-bold text-action-500 tabular-nums">${config.reserveBalance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="font-mono text-[10px] text-brand-400">
                            <div className="grid grid-cols-12 p-3 bg-black border-b border-brand-900 font-bold text-brand-500 uppercase">
                                <div className="col-span-2">Timestamp</div>
                                <div className="col-span-5">Operation Narrative</div>
                                <div className="col-span-2 text-right">Delta</div>
                                <div className="col-span-3 text-right">Oracle Status</div>
                            </div>
                            <div className="divide-y divide-brand-900 h-[300px] overflow-y-auto">
                                {[
                                    { id: 'RL-921', ts: '2025-06-12 14:22:01', desc: 'RELEASE: 30D_MATURATION_CYCLE', amount: '-1,240.00', status: 'SETTLED', color: 'text-rose-400' },
                                    { id: 'RL-920', ts: '2025-06-12 09:10:44', desc: 'CAPTURE: SETTLEMENT_RESERVE_TX_8291', amount: '+124.00', status: 'LOCKED', color: 'text-emerald-400' },
                                    { id: 'RL-919', ts: '2025-06-11 22:45:12', desc: 'ADJUST: CLAWBACK_CASE_#772', amount: '-50.00', status: 'ADJUSTED', color: 'text-amber-400' },
                                    { id: 'RL-918', ts: '2025-06-11 18:30:00', desc: 'CAPTURE: SETTLEMENT_RESERVE_TX_8288', amount: '+890.00', status: 'LOCKED', color: 'text-emerald-400' },
                                    { id: 'RL-917', ts: '2025-06-11 12:15:05', desc: 'RELEASE: 30D_MATURATION_CYCLE', amount: '-2,100.00', status: 'SETTLED', color: 'text-rose-400' },
                                ].map(log => (
                                    <div key={log.id} className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors items-center group">
                                        <div className="col-span-2 text-brand-600">{log.ts.split(' ')[1]}</div>
                                        <div className="col-span-5 text-white truncate font-bold">{log.desc}</div>
                                        <div className={`col-span-2 text-right font-bold ${log.color}`}>{log.amount}</div>
                                        <div className="col-span-3 text-right">
                                            <span className={`px-1.5 py-0.5 border rounded-sm tracking-widest text-[8px] border-brand-800 group-hover:border-brand-600`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 bg-black/40 border-t border-brand-900 text-[9px] text-brand-600 font-mono text-center tracking-widest uppercase">
                            End of immutable ledger stream // Synchronizing with Lagos_Node_12
                        </div>
                    </div>
                </div>

                {/* Risk Intelligence Rail */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-sm border border-brand-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-action-500">
                            <ShieldAlert className="w-5 h-5" />
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Risk Parameters</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-brand-500 uppercase font-bold tracking-widest">Chargeback Rate</p>
                                    <p className="text-xl font-mono font-bold text-brand-900">0.02%</p>
                                </div>
                                <span className="text-[8px] text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded-sm border border-emerald-100">LOW_EXPOSURE</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-brand-500 uppercase font-bold tracking-widest">Velocity Cap</p>
                                    <p className="text-xl font-mono font-bold text-brand-900">$50,000/Day</p>
                                </div>
                                <button 
                                    onClick={() => setShowRequestModal(true)}
                                    className="text-[9px] text-action-500 font-black uppercase border-b-2 border-action-500/20 hover:border-action-500 transition-all pb-0.5"
                                >
                                    Request Increase
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-brand-100">
                             <div className="flex items-center gap-2 mb-4">
                                <Siren className="w-4 h-4 text-rose-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase text-rose-500 tracking-widest">Sentinel Monitoring</span>
                             </div>
                             <div className="p-4 bg-brand-50 rounded-sm border border-brand-200">
                                <p className="text-[10px] text-brand-500 leading-relaxed font-mono uppercase">{">>> "} Oracle monitoring active. Zero anomalies detected in the UK/NG corridor. System is nominal.</p>
                             </div>
                        </div>
                    </div>

                    <div className="bg-brand-900 text-white p-8 rounded-sm relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Info className="w-20 h-20" /></div>
                        <h4 className="text-xs font-bold text-action-500 uppercase tracking-widest mb-6">Settlement Safeguards</h4>
                        <div className="space-y-5 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-6 h-6 bg-brand-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-brand-700">1</div>
                                <p className="text-[10px] text-brand-300 leading-relaxed">The Rolling Reserve (10%) is held for 30 days to insulate against chargeback liability.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 bg-brand-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-brand-700">2</div>
                                <p className="text-[10px] text-brand-300 leading-relaxed">Clawback Protocol: System is authorized to debit Treasury if reserves are exhausted.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 bg-brand-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border border-brand-700">3</div>
                                <p className="text-[10px] text-brand-300 leading-relaxed">Velocity suspensions are automated if Oracle risk scores drop below 40%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Increase Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-950/95 backdrop-blur-md" onClick={() => !requestLoading && setShowRequestModal(false)}></div>
                    <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md rounded-sm overflow-hidden animate-in zoom-in-95">
                        <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <ArrowUpRight className="w-4 h-4 text-action-500" /> Limit Escalation Request
                            </h3>
                            {!requestLoading && <button onClick={() => setShowRequestModal(false)}><X className="w-4 h-4 text-brand-500 hover:text-white" /></button>}
                        </div>

                        {requestSuccess ? (
                            <div className="p-12 text-center space-y-6 animate-in fade-in">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                                    <CheckCircle2 className="w-10 h-10" />
                                </div>
                                <h4 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">Under Oracle Review</h4>
                                <p className="text-brand-500 text-xs font-mono">CASE_ID: #VEL-{Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
                                <p className="text-xs text-brand-700 leading-relaxed italic">"Identity verified. We are analyzing your last 90 days of settlement health. Response expected in 4-6 hours."</p>
                                <button onClick={() => setShowRequestModal(false)} className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm">Back to Dashboard</button>
                            </div>
                        ) : (
                            <div className="p-8 space-y-6">
                                <div className="p-4 bg-brand-50 border border-brand-100 rounded-sm space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-brand-500">Current Velocity</span>
                                        <span className="text-brand-900">$50k/Day</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-brand-500">Target Velocity</span>
                                        <span className="text-action-500">$250k/Day</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-brand-700 leading-relaxed">
                                        To qualify for <strong>Tier-3 Elite Velocity</strong> ($250k+), your entity must maintain a Trust Score  &gt; 90 and zero unresolved disputes for 60 consecutive days.
                                    </p>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-sm">
                                        <ShieldCheck className="w-4 h-4 shrink-0" />
                                        <span className="text-[10px] font-bold uppercase">Pre-Qualification Met: 94 Trust Index</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleRequestIncrease}
                                    disabled={requestLoading}
                                    className="w-full py-4 bg-brand-900 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    {requestLoading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Performing Logic Check...</> : 'Confirm Request Escalation'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
