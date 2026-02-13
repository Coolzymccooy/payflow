import React, { useState } from 'react';
import { 
    Users, Activity, ShieldCheck, FileText, ArrowRight,
    Search, Filter, X, Eye, AlertTriangle, CheckCircle,
    Banknote, RefreshCw, Smartphone, Mail, Globe, MapPin,
    AlertOctagon, BadgeCheck, Clock, Download, ChevronRight,
    TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard
} from 'lucide-react';

interface AdminDashboardProps {
    // In a real app, you'd pass user role and permissions here
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSACTIONS' | 'KYC' | 'LIQUIDITY'>('OVERVIEW');
    const [selectedTx, setSelectedTx] = useState<string | null>(null);

    // Mock Data for Demo
    const kycPending = [
        { id: 'KYC-001', name: 'John Doe', docType: 'Passport', status: 'PENDING', risk: 'LOW', submitted: '2h ago' },
        { id: 'KYC-002', name: 'Sarah Smith', docType: 'Driver Lic', status: 'PENDING', risk: 'MEDIUM', submitted: '5h ago' },
    ];

    const recentTx = [
        { id: 'RMT-X7Y9Z', sender: 'John Doe', recipient: 'Mary Jane', amount: 500, currency: 'GBP', status: 'COMPLETED', date: 'Just now' },
        { id: 'RMT-A1B2C', sender: 'Mike Ross', recipient: 'Paul Allen', amount: 1200, currency: 'USD', status: 'PROCESSING', date: '5m ago' },
        { id: 'RMT-Q9W8E', sender: 'Linda Li', recipient: 'Wei Chen', amount: 2500, currency: 'EUR', status: 'PENDING', date: '15m ago' },
    ];

    const liquidityPools = [
        { currency: 'NGN', balance: 45000000, partner: 'GTBank', status: 'HEALTHY' },
        { currency: 'GBP', balance: 18500, partner: 'Barclays', status: 'LOW' },
        { currency: 'USD', balance: 52000, partner: 'Chase', status: 'HEALTHY' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-brand-950 uppercase italic tracking-tighter">Command Center</h2>
                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mt-1">Global Operations & Oversight</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-2">
                        <Activity className="w-3 h-3" /> Systems Optimal
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-brand-100 pb-1">
                {['OVERVIEW', 'TRANSACTIONS', 'KYC', 'LIQUIDITY'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-action-500 border-b-2 border-action-500' : 'text-brand-300 hover:text-brand-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'OVERVIEW' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 bg-white p-8 rounded-3xl border border-brand-100 shadow-xl">
                            <h3 className="text-sm font-black text-brand-900 uppercase tracking-widest mb-6">Volume Velocity</h3>
                            <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-brand-50">
                                {/* Fake Chart Bars */}
                                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                    <div key={i} className="w-full bg-brand-50 hover:bg-brand-100 transition-all rounded-t-lg relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            £{h}k
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[9px] font-bold text-brand-300 uppercase tracking-widest">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-brand-950 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10"><Globe className="w-24 h-24" /></div>
                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2">Total Processed (24h)</p>
                                <p className="text-4xl font-mono font-bold tracking-tighter">£482,500</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                                    <TrendingUp className="w-3 h-3" /> +12.5% vs yesterday
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-lg">
                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">Pending Actions</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                                            <span className="text-xs font-bold text-amber-900">KYC Reviews</span>
                                        </div>
                                        <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-amber-600">5</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl border border-rose-100">
                                        <div className="flex items-center gap-3">
                                            <AlertOctagon className="w-4 h-4 text-rose-600" />
                                            <span className="text-xs font-bold text-rose-900">Failed Payouts</span>
                                        </div>
                                        <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-rose-600">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'TRANSACTIONS' && (
                    <div className="bg-white rounded-3xl border border-brand-100 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-brand-50 flex justify-between items-center bg-brand-50/30">
                            <div className="relative w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300" />
                                <input type="text" placeholder="Search by Ref ID, Sender, or Phone..." className="w-full pl-10 pr-4 py-3 bg-white border border-brand-100 rounded-xl text-xs font-bold outline-none focus:border-brand-500" />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white border border-brand-100 rounded-xl hover:bg-brand-50 text-brand-500"><Filter className="w-4 h-4" /></button>
                                <button className="p-3 bg-white border border-brand-100 rounded-xl hover:bg-brand-50 text-brand-500"><Download className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-50/50 text-[9px] font-black text-brand-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Ref ID</th>
                                        <th className="p-6">Sender</th>
                                        <th className="p-6">Recipient</th>
                                        <th className="p-6 text-right">Amount</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6">Timestamp</th>
                                        <th className="p-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold text-brand-900 divide-y divide-brand-50">
                                    {recentTx.map(tx => (
                                        <tr key={tx.id} className="hover:bg-brand-50/30 transition-colors group">
                                            <td className="p-6 font-mono text-brand-500">{tx.id}</td>
                                            <td className="p-6">{tx.sender}</td>
                                            <td className="p-6">{tx.recipient}</td>
                                            <td className="p-6 text-right font-mono">{tx.amount.toLocaleString()} {tx.currency}</td>
                                            <td className="p-6">
                                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                                                    tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                    tx.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="p-6 text-brand-400">{tx.date}</td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => setSelectedTx(tx.id)} className="text-action-500 hover:text-action-700 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'KYC' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {kycPending.map(k => (
                             <div key={k.id} className="bg-white p-6 rounded-3xl border border-brand-100 shadow-lg flex justify-between items-start">
                                 <div className="space-y-4">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-600">{k.name.charAt(0)}</div>
                                         <div>
                                             <p className="font-bold text-brand-950">{k.name}</p>
                                             <p className="text-[10px] text-brand-400 font-mono uppercase">{k.id}</p>
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-2 gap-4 text-xs">
                                         <div>
                                             <p className="text-[9px] font-bold text-brand-300 uppercase tracking-widest">Document</p>
                                             <p className="font-bold text-brand-700">{k.docType}</p>
                                         </div>
                                         <div>
                                             <p className="text-[9px] font-bold text-brand-300 uppercase tracking-widest">Risk Level</p>
                                             <p className={`font-black uppercase tracking-wider ${k.risk === 'LOW' ? 'text-emerald-500' : 'text-amber-500'}`}>{k.risk}</p>
                                         </div>
                                     </div>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <button className="px-4 py-2 bg-brand-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Review</button>
                                     <button className="px-4 py-2 bg-white border border-brand-100 text-brand-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-50 transition-all">Reject</button>
                                 </div>
                             </div>
                         ))}
                    </div>
                )}

                {activeTab === 'LIQUIDITY' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {liquidityPools.map(pool => (
                                <div key={pool.currency} className="bg-white p-6 rounded-3xl border border-brand-100 shadow-lg relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-2 h-full ${pool.status === 'HEALTHY' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="bg-brand-50 px-3 py-1 rounded-lg text-xs font-black text-brand-900">{pool.currency}</div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${pool.status === 'HEALTHY' ? 'text-emerald-600' : 'text-rose-600'}`}>{pool.status}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Available Float</p>
                                    <p className="text-3xl font-mono font-bold text-brand-950 tracking-tighter">{pool.balance.toLocaleString()}</p>
                                    <div className="mt-6 pt-4 border-t border-brand-50 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1"><Landmark className="w-3 h-3" /> {pool.partner}</span>
                                        <button className="text-action-500 hover:text-action-700 text-[10px] font-black uppercase tracking-widest">Rebalance</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-brand-950 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5"><RefreshCw className="w-64 h-64 animate-spin-slow" /></div>
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Mirror Protocol Status</h3>
                                    <p className="text-brand-300 text-sm max-w-lg">Bilateral settlement engine active. Automatic rebalancing scheduled for 16:00 GMT.</p>
                                </div>
                                <button className="px-6 py-3 bg-white text-brand-950 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-100 transition-all shadow-xl">
                                    Force Sync
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction Detail Modal (Simplified) */}
            {selectedTx && (
                <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                            <h3 className="font-black text-brand-950 uppercase tracking-tight">Transaction Details</h3>
                            <button onClick={() => setSelectedTx(null)} className="p-2 hover:bg-brand-100 rounded-full"><X className="w-5 h-5 text-brand-500" /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-2xl border border-brand-100">
                                <div className="bg-white p-3 rounded-xl border border-brand-100"><FileText className="w-6 h-6 text-brand-500" /></div>
                                <div>
                                    <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Reference ID</p>
                                    <p className="text-xl font-mono font-bold text-brand-950">{selectedTx}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Sender</p>
                                    <p className="font-bold text-brand-900">John Doe</p>
                                    <p className="text-xs text-brand-500">+44 7123 456 789</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest mb-1">Recipient</p>
                                    <p className="font-bold text-brand-900">Mary Jane</p>
                                    <p className="text-xs text-brand-500">GTBank • 0123456789</p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-brand-100 flex justify-end gap-3">
                                <button className="px-5 py-3 bg-white border border-brand-100 text-brand-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-50 transition-all">Download Receipt</button>
                                <button className="px-5 py-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Flag Suspicious</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
