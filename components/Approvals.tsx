
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { BackendService } from '../services/backend';
import { ApprovalRequest, ApprovalStatus } from '../types';
import { ShieldCheck, Clock, Check, X, User, AlertTriangle, ArrowRight, History, Landmark, Users, Lock, RefreshCw, Loader2 } from 'lucide-react';

export const Approvals: React.FC = () => {
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        const data = await BackendService.getApprovals();
        if (data) setRequests(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, status: ApprovalStatus) => {
        setProcessingId(id);
        const result = await BackendService.processApproval(id, status);
        if (result && result.success) {
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        }
        setProcessingId(null);
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'BANK_ACCOUNT': return <Landmark className="w-4 h-4 text-blue-500" />;
            case 'PAYROLL_RUN': return <Users className="w-4 h-4 text-emerald-500" />;
            case 'TREASURY_TRANSFER': return <Lock className="w-4 h-4 text-amber-500" />;
            default: return <User className="w-4 h-4 text-brand-400" />;
        }
    };

    const activeRequests = requests.filter(r => r.status === 'PENDING');
    const history = requests.filter(r => r.status !== 'PENDING');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Governance Console" 
                subtitle="High-fidelity authorization movement trees. Your decisions sync across all regional nodes."
                breadcrumbs={['Workspace', 'Admin', 'Approvals']}
                status="SECURE"
                actions={
                    <button onClick={fetchRequests} className="p-2 bg-white border border-brand-200 rounded-sm hover:bg-brand-50 transition-colors">
                        <RefreshCw className={`w-4 h-4 text-brand-500 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-4">
                    {isLoading ? (
                        <div className="p-20 text-center bg-white border border-brand-100 rounded-sm">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-action-500" />
                            <p className="text-brand-500 font-mono text-xs uppercase">Syncing Governance Ledger...</p>
                        </div>
                    ) : activeRequests.length === 0 ? (
                        <div className="p-12 text-center bg-white border border-brand-100 rounded-sm">
                            <ShieldCheck className="w-12 h-12 text-emerald-100 mx-auto mb-4" />
                            <p className="text-brand-900 font-bold uppercase tracking-tight">Queue Clear</p>
                            <p className="text-brand-500 font-mono text-[10px] mt-1 uppercase">No movements require identity verification.</p>
                        </div>
                    ) : (
                        activeRequests.map(req => (
                            <div key={req.id} className="bg-white border border-brand-200 rounded-sm overflow-hidden shadow-sm hover:border-brand-400 transition-all group animate-in slide-in-from-left-2">
                                <div className="p-5 flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-brand-50 rounded-sm flex items-center justify-center border border-brand-100 shrink-0">
                                            {getTypeIcon(req.type)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold bg-brand-950 text-white px-1.5 py-0.5 rounded-sm font-mono">{req.id}</span>
                                                <h4 className="text-sm font-bold text-brand-900 uppercase tracking-tight">{req.type.replace('_', ' ')}</h4>
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${req.severity === 'HIGH' ? 'bg-rose-50 text-data-rose border-rose-100' : req.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-brand-50 text-brand-500 border-brand-200'}`}>
                                                    {req.severity}_RISK
                                                </span>
                                            </div>
                                            <p className="text-sm text-brand-700 font-medium">{req.details}</p>
                                            <div className="flex items-center gap-4 mt-2 text-[10px] text-brand-400 font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {req.requester}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(req.timestamp).toLocaleTimeString()}</span>
                                                {req.amount && <span className="text-brand-900 font-black">${req.amount.toLocaleString()} {req.currency}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={processingId === req.id}
                                            onClick={() => handleAction(req.id, 'REJECTED')}
                                            className="px-4 py-2 border border-brand-200 text-brand-600 hover:bg-rose-50 hover:text-data-rose hover:border-rose-200 rounded-sm text-xs font-bold uppercase transition-all disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                        <button 
                                            disabled={processingId === req.id}
                                            onClick={() => handleAction(req.id, 'APPROVED')}
                                            className="px-4 py-2 bg-brand-950 text-white hover:bg-black rounded-sm text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                                        >
                                            {processingId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Check className="w-3.5 h-3.5 text-action-500" /> Authorize</>}
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-brand-50 px-5 py-2 border-t border-brand-100 flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-brand-400 uppercase tracking-widest">Movement Ladder: Policy Compliance Verified → <span className="text-brand-900">Final HSM Sign-off Required</span></span>
                                    <ArrowRight className="w-3 h-3 text-brand-300" />
                                </div>
                            </div>
                        ))
                    )}

                    {history.length > 0 && (
                        <div className="mt-12 space-y-4">
                            <h3 className="text-xs font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4" /> Governance Audit History
                            </h3>
                            <div className="bg-white border border-brand-100 rounded-sm overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <tbody className="divide-y divide-brand-50">
                                        {history.map(req => (
                                            <tr key={req.id} className="text-[10px] font-mono opacity-70 hover:opacity-100 transition-opacity">
                                                <td className="p-4 font-bold text-brand-900">{req.id}</td>
                                                <td className="p-4 uppercase font-bold text-brand-600">{req.type}</td>
                                                <td className="p-4 text-brand-500 truncate max-w-[200px]">{req.details}</td>
                                                <td className="p-4 text-right">
                                                    <span className={`font-bold uppercase px-2 py-0.5 rounded-sm border ${req.status === 'APPROVED' ? 'bg-emerald-50 text-data-emerald border-emerald-100' : 'bg-rose-50 text-data-rose border-rose-100'}`}>
                                                        {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-brand-950 p-6 rounded-sm text-white border border-brand-800 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5"><Lock className="w-20 h-20" /></div>
                        <div className="flex items-center gap-2 mb-4 text-action-500">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Active Policy</h3>
                        </div>
                        <p className="text-[11px] text-brand-400 leading-relaxed font-mono relative z-10">
                            The "Four-Eyes" principle is enforced for all High Impact movement types. Dual authorization from independent HSM nodes required.
                        </p>
                        <div className="mt-6 pt-4 border-t border-brand-800 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-brand-500 uppercase tracking-widest">Node Health</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-white border border-brand-100 rounded-sm shadow-sm space-y-4">
                         <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Governance Tip</h4>
                         <p className="text-[11px] text-brand-600 leading-relaxed italic">
                            "Approving a payroll run releases funds instantly via the Velocity Rail. Ensure regional currency reserves (NGN/GBP) are balanced before authorizing."
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
