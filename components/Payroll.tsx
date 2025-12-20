
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Employee, PayrollAudit } from '../types';
import { BackendService } from '../services/backend';
import { Users, DollarSign, Calendar, Check, AlertCircle, TrendingUp, Download, Plus, Search, Sparkles, ShieldCheck, Siren, BrainCircuit, X, Save, Edit2, ShieldAlert, Fingerprint, Eye, Database, RefreshCw, Banknote, Shield, Zap, FileText, Lock, Landmark, ArrowRight, Activity, CheckCircle2, Phone, Mail, Loader2, Clock } from 'lucide-react';

interface PayrollProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onRunPayroll: () => Promise<boolean>; 
  isEWAEnabled: boolean;
  setIsEWAEnabled: (val: boolean) => void;
}

const NIGERIAN_BANKS = ['GTBank', 'Zenith Bank', 'Access Bank', 'FirstBank', 'UBA', 'Kuda', 'Moniepoint', 'Opay'];

export const Payroll: React.FC<PayrollProps> = ({ employees, setEmployees, onRunPayroll, isEWAEnabled, setIsEWAEnabled }) => {
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClearingRoomOpen, setIsClearingRoomOpen] = useState(false);
  const [clearingLogs, setClearingLogs] = useState<string[]>([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [empForm, setEmpForm] = useState<Partial<Employee>>({
      name: '', email: '', phone: '', taxId: '', role: '', department: 'Engineering', salary: 0, allowances: 0, currency: 'NGN', status: 'ACTIVE', bank: 'GTBank', region: 'NG'
  });

  const totalPayrollNGN = employees.filter(e => e.currency === 'NGN' && e.status === 'ACTIVE').reduce((acc, curr) => acc + curr.salary, 0);
  const totalPayrollGBP = employees.filter(e => e.currency === 'GBP' && e.status === 'ACTIVE').reduce((acc, curr) => acc + curr.salary, 0);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(amount);
  };

  const handleRunPayroll = async () => {
    const totalUSDValue = (totalPayrollNGN / 1500) + totalPayrollGBP * 1.27;
    if (totalUSDValue > 10000) {
        setProcessing(true);
        const result = await BackendService.requestApproval({
            type: 'PAYROLL_RUN',
            details: `Execute June Batch for ${employees.length} personnel. Vol: $${totalUSDValue.toLocaleString()}`,
            severity: 'HIGH',
            amount: totalUSDValue,
            currency: 'USD'
        });
        if (result && result.success) setWaitingForApproval(true);
        setProcessing(false);
        return;
    }

    setIsClearingRoomOpen(true);
    setClearingLogs([]);
    const steps = [">> ATTACHING TO LIQUIDITY...", ">> HSM SIGNING...", ">> DISPATCHING..."];
    for (const s of steps) {
        await new Promise(r => setTimeout(r, 600));
        setClearingLogs(prev => [...prev, s]);
    }
    setProcessing(true);
    await onRunPayroll();
    setProcessing(false);
    setIsClearingRoomOpen(false);
  };

  const handleSaveEmployee = () => {
      if (!empForm.name || !empForm.email) return;
      if (editingId) {
          setEmployees(prev => prev.map(e => e.id === editingId ? { ...e, ...empForm } as Employee : e));
      } else {
          const newEmp: Employee = {
              id: `EMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
              ...empForm
          } as Employee;
          setEmployees(prev => [...prev, newEmp]);
      }
      setIsEmployeeModalOpen(false);
      setEditingId(null);
  };

  const filteredEmployees = employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payroll Easy" 
        subtitle="Autonomous global disbursement architecture with integrated governance."
        breadcrumbs={['Workspace', 'HR', 'Payroll']}
        actions={
            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingId(null); setIsEmployeeModalOpen(true); }}
                className="bg-white border border-brand-200 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-brand-50 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Personnel
              </button>
              <button 
                onClick={handleRunPayroll}
                disabled={processing || waitingForApproval}
                className={`flex items-center gap-2 px-6 py-2 rounded-sm text-sm font-bold uppercase tracking-widest transition-all shadow-xl ${waitingForApproval ? 'bg-amber-600 text-white' : 'bg-action-500 text-white hover:bg-action-600'}`}
              >
                {waitingForApproval ? <><Clock className="w-4 h-4" /> Pending Approval</> : processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</> : <><Zap className="w-4 h-4 fill-current" /> Execute Run</>}
              </button>
            </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
           <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Headcount</p>
           <p className="text-3xl font-bold text-brand-900">{employees.length}</p>
        </div>
        <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
           <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Total Gross (NGN)</p>
           <p className="text-xl font-mono font-bold text-brand-900">{formatCurrency(totalPayrollNGN, 'NGN')}</p>
        </div>
        <div className="bg-white p-6 border border-brand-100 rounded-sm shadow-sm">
           <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1">Total Gross (GBP)</p>
           <p className="text-xl font-mono font-bold text-brand-900">{formatCurrency(totalPayrollGBP, 'GBP')}</p>
        </div>
        <div className="bg-brand-950 p-6 rounded-sm text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="w-16 h-16" /></div>
           <p className="text-action-500 uppercase font-bold text-[10px] tracking-widest">Oracle Audit</p>
           <p className="text-xl font-bold text-emerald-400 font-mono">OPTIMAL</p>
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input 
                    type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search personnel roster..." 
                    className="w-full pl-10 pr-4 py-2 border border-brand-200 rounded-sm text-xs outline-none focus:border-action-500 bg-white font-medium"
                />
            </div>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-white text-brand-500 font-medium border-b border-brand-100">
                <tr>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Identity</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Comp Plan</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Disbursement Rail</th>
                    <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
                {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-brand-50 transition-all group">
                        <td className="px-6 py-4">
                            <p className="font-bold text-brand-900 text-sm">{emp.name}</p>
                            <p className="text-[10px] text-brand-400 font-mono uppercase">{emp.role} • {emp.department}</p>
                        </td>
                        <td className="px-6 py-4">
                            <p className="font-mono font-bold text-brand-900">{formatCurrency(emp.salary, emp.currency)}</p>
                            <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">ANNUAL_GROSS</p>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Landmark className="w-3.5 h-3.5 text-brand-400" />
                                <span className="text-xs text-brand-700 font-medium">{emp.bank}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button onClick={() => { setEditingId(emp.id); setEmpForm(emp); setIsEmployeeModalOpen(true); }} className="p-2 hover:bg-brand-100 rounded-sm text-brand-400 hover:text-brand-900 transition-colors">
                                <Edit2 className="w-4 h-4" />
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setIsEmployeeModalOpen(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-xl rounded-sm overflow-hidden animate-in zoom-in-95">
                  <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        {editingId ? <Edit2 className="w-4 h-4 text-action-500" /> : <Plus className="w-4 h-4 text-action-500" />}
                        {editingId ? 'Edit Personnel' : 'Onboard New Personnel'}
                      </h3>
                      <button onClick={() => setIsEmployeeModalOpen(false)}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-500 uppercase">Legal Name</label>
                              <input type="text" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full px-4 py-2 border border-brand-200 rounded-sm text-sm" placeholder="e.g. Jane Doe" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-500 uppercase">Email Address</label>
                              <input type="email" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} className="w-full px-4 py-2 border border-brand-200 rounded-sm text-sm" placeholder="jane@company.com" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-500 uppercase">Region</label>
                              <select value={empForm.region} onChange={e => setEmpForm({...empForm, region: e.target.value as any, currency: e.target.value === 'NG' ? 'NGN' : 'GBP'})} className="w-full px-4 py-2 border border-brand-200 rounded-sm text-sm">
                                  <option value="NG">Nigeria</option>
                                  <option value="UK">United Kingdom</option>
                                  <option value="US">United States</option>
                              </select>
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] font-bold text-brand-500 uppercase">Gross Salary (Annual)</label>
                              <input type="number" value={empForm.salary} onChange={e => setEmpForm({...empForm, salary: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-brand-200 rounded-sm text-sm" />
                          </div>
                      </div>
                      <button onClick={handleSaveEmployee} className="w-full py-4 bg-brand-950 text-white font-bold uppercase text-[10px] tracking-widest rounded-sm hover:bg-black shadow-xl transition-all">
                        {editingId ? 'Apply Identity Update' : 'Initialize Onboarding'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
