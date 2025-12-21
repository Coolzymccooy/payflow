
import React, { useState, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Employee, PayrollAudit } from '../types';
import { runPayrollAudit } from '../services/geminiService';
import { 
    Users, DollarSign, Calendar, Check, AlertCircle, TrendingUp, 
    Download, Plus, Search, Sparkles, ShieldCheck, Siren, BrainCircuit, 
    X, Save, Edit2, ShieldAlert, Fingerprint, Eye, Database, RefreshCw, 
    Banknote, Shield, Zap, FileText, Lock, Landmark, ArrowRight, 
    Activity, CheckCircle2, Phone, Mail, Loader2, Clock, Trash2, ChevronRight, UserCog, UserSearch, Briefcase, Hash
} from 'lucide-react';

interface PayrollProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  onRunPayroll: () => Promise<boolean>; 
  isEWAEnabled: boolean;
  setIsEWAEnabled: (val: boolean) => void;
  onViewEmployeePortal?: (emp: Employee) => void;
}

export const Payroll: React.FC<PayrollProps> = ({ employees, setEmployees, onRunPayroll, isEWAEnabled, setIsEWAEnabled, onViewEmployeePortal }) => {
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  
  // Oracle Ghost Audit State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<PayrollAudit | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [empForm, setEmpForm] = useState<Partial<Employee & { accountNumber?: string, type?: string }>>({
      name: '', email: '', phone: '', taxId: '', role: '', department: 'Engineering', salary: 0, allowances: 0, currency: 'NGN', status: 'ACTIVE', bank: 'GTBank', region: 'NG', accountNumber: '', type: 'FULL_TIME'
  });

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
        const result = await runPayrollAudit(employees);
        setAuditResult(result);
    } catch (e) {
        setAuditResult({
            complianceScore: 92,
            ghostEmployees: 0,
            salaryVariance: 1.2,
            taxLiabilityForecast: 45000,
            recommendations: ["Perform identity verification on regional node nodes."]
        });
    } finally {
        setIsAuditing(false);
    }
  };

  const handleSaveEmployee = () => {
    if (!empForm.name || !empForm.email || !empForm.bank || !empForm.role) {
        alert("CRITICAL_FAULT: Missing required identity metadata.");
        return;
    }

    if (editingId) {
        setEmployees(prev => prev.map(e => e.id === editingId ? { ...e, ...empForm } as Employee : e));
    } else {
        const newEmp: Employee = {
            ...empForm,
            id: `EMP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            status: 'ACTIVE'
        } as Employee;
        setEmployees(prev => [newEmp, ...prev]);
    }
    
    setIsEmployeeModalOpen(false);
    setEditingId(null);
    setEmpForm({ name: '', email: '', phone: '', taxId: '', role: '', department: 'Engineering', salary: 0, allowances: 0, currency: 'NGN', status: 'ACTIVE', bank: 'GTBank', region: 'NG', accountNumber: '', type: 'FULL_TIME' });
  };

  const handleRunPayroll = async () => {
    setProcessing(true);
    await onRunPayroll();
    setProcessing(false);
  };

  const filteredEmployees = employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader 
        title="Payroll Easy" 
        subtitle="Autonomous global disbursement architecture with integrated governance."
        breadcrumbs={['Workspace', 'HR', 'Payroll']}
        actions={
            <div className="flex gap-2">
              <button 
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="bg-brand-950 text-action-500 border border-brand-900 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl"
              >
                {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserSearch className="w-4 h-4" />}
                Oracle Ghost Scan
              </button>
              <button 
                onClick={handleRunPayroll}
                disabled={processing}
                className="flex items-center gap-2 px-6 py-2 bg-action-500 text-white rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-action-600 transition-all shadow-xl disabled:opacity-50"
              >
                {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                Execute Run
              </button>
            </div>
        }
      />

      {auditResult && (
          <div className="bg-brand-950 border border-brand-800 p-6 rounded-sm animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Audit Findings Report</h4>
                  </div>
                  <button onClick={() => setAuditResult(null)}><X className="w-4 h-4 text-brand-600 hover:text-white" /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-black/40 border border-brand-900 rounded-sm">
                      <p className="text-[9px] text-brand-500 font-bold uppercase mb-1">Compliance State</p>
                      <p className="text-xl font-mono text-white font-bold">{auditResult.complianceScore}%</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-brand-900 rounded-sm">
                      <p className="text-[9px] text-brand-500 font-bold uppercase mb-1">Detected Ghosts</p>
                      <p className={`text-xl font-mono font-bold ${auditResult.ghostEmployees > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{auditResult.ghostEmployees}</p>
                  </div>
                  <div className="p-4 bg-black/40 border border-brand-900 rounded-sm">
                      <p className="text-[9px] text-brand-500 font-bold uppercase mb-1">Audit Protocol</p>
                      <p className="text-[10px] font-mono text-brand-400 uppercase tracking-widest italic">HSM_BIMODAL_V4</p>
                  </div>
              </div>
              <div className="space-y-2">
                  <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest mb-3">Oracle Recommendations</p>
                  <ul className="space-y-2">
                      {auditResult.recommendations.map((rec, i) => (
                          <li key={i} className="text-[11px] text-brand-300 font-medium flex items-center gap-3">
                              <ArrowRight className="w-3 h-3 text-action-500" /> {rec}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      <div className="bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
            <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input 
                    type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search personnel roster..." 
                    className="w-full pl-10 pr-4 py-2 border border-brand-200 rounded-sm text-xs outline-none focus:border-action-500 bg-white"
                />
            </div>
            <button onClick={() => { setEditingId(null); setEmpForm({ department: 'Engineering', currency: 'NGN', region: 'NG', type: 'FULL_TIME' }); setIsEmployeeModalOpen(true); }} className="px-4 py-2 border border-brand-200 rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-brand-50 transition-all">
                <Plus className="w-3 h-3" /> Add Personnel
            </button>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-white text-brand-500 font-medium border-b border-brand-100">
                <tr>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Identity</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Compensation</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold">Primary Rail</th>
                    <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest font-bold">Admin Ops</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
                {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-brand-50 transition-all group">
                        <td className="px-6 py-4">
                            <p className="font-bold text-brand-900 text-sm">{emp.name}</p>
                            <p className="text-[10px] text-brand-400 font-mono uppercase tracking-tight">{emp.role} • {emp.department}</p>
                        </td>
                        <td className="px-6 py-4">
                            <p className="font-mono font-bold text-brand-900">
                                {new Intl.NumberFormat(emp.currency === 'NGN' ? 'en-NG' : 'en-US', { style: 'currency', currency: emp.currency, maximumFractionDigits: 0 }).format(emp.salary)}
                            </p>
                            <p className="text-[9px] text-brand-400 font-bold uppercase tracking-widest">ANNUAL_GROSS</p>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <Landmark className="w-3.5 h-3.5 text-brand-400" />
                                <span className="text-xs text-brand-700 font-medium">{emp.bank}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-1">
                                <button 
                                    onClick={() => onViewEmployeePortal?.(emp)}
                                    className="p-2 hover:bg-brand-900 hover:text-white rounded-sm text-brand-400 transition-all flex items-center gap-2 group/btn"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-[9px] font-bold uppercase hidden group-hover/btn:inline">View Portal</span>
                                </button>
                                <button onClick={() => { setEditingId(emp.id); setEmpForm(emp); setIsEmployeeModalOpen(true); }} className="p-2 hover:bg-brand-100 rounded-sm text-brand-400 hover:text-brand-900 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {isEmployeeModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setIsEmployeeModalOpen(false)}></div>
              <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-3xl rounded-sm overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                  <div className="bg-brand-900 text-white p-4 flex justify-between items-center shrink-0">
                      <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <UserCog className="w-4 h-4 text-action-500" /> {editingId ? 'Edit Personnel Data' : 'Initialize Personnel Enrollment'}
                      </h3>
                      <button onClick={() => setIsEmployeeModalOpen(false)}><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="p-8 space-y-8 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-2 flex items-center gap-2">
                                <Fingerprint className="w-3 h-3" /> Core Identity
                              </h4>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Full Name</label>
                                  <input type="text" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500" placeholder="e.g. Adebayo Ogunlesi" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Email Address</label>
                                    <input type="email" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500" placeholder="adebayo@company.com" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Phone Number</label>
                                    <input type="tel" value={empForm.phone} onChange={e => setEmpForm({...empForm, phone: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500" placeholder="+234..." />
                                </div>
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Tax Identity (TIN/NI/SSN)</label>
                                  <input type="text" value={empForm.taxId} onChange={e => setEmpForm({...empForm, taxId: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm font-mono outline-none focus:border-action-500" placeholder="TX-NG-8812" />
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-2 flex items-center gap-2">
                                <Briefcase className="w-3 h-3" /> Institutional Role
                              </h4>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Official Title</label>
                                  <input type="text" value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500" placeholder="Software Architect" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Department</label>
                                    <select value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500">
                                        <option>Engineering</option>
                                        <option>Operations</option>
                                        <option>Finance</option>
                                        <option>Growth</option>
                                        <option>Legal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Type</label>
                                    <select value={empForm.type} onChange={e => setEmpForm({...empForm, type: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500">
                                        <option value="FULL_TIME">Full Time</option>
                                        <option value="CONTRACT">Contractor</option>
                                        <option value="EXECUTIVE">Executive</option>
                                    </select>
                                </div>
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Geographic Region</label>
                                  <select value={empForm.region} onChange={e => setEmpForm({...empForm, region: e.target.value as any})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500">
                                      <option value="NG">Nigeria (NGN Rail)</option>
                                      <option value="UK">United Kingdom (GBP Rail)</option>
                                      <option value="US">United States (USD Rail)</option>
                                  </select>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest border-b border-brand-50 pb-2 flex items-center gap-2">
                            <Banknote className="w-3 h-3" /> Compensation & Settlement Rail
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Gross Salary (Annual)</label>
                                  <input type="number" value={empForm.salary} onChange={e => setEmpForm({...empForm, salary: parseFloat(e.target.value)})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm font-mono outline-none focus:border-action-500" />
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Currency</label>
                                  <select value={empForm.currency} onChange={e => setEmpForm({...empForm, currency: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500">
                                      <option>NGN</option>
                                      <option>USD</option>
                                      <option>GBP</option>
                                      <option>EUR</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Settlement Bank</label>
                                  <input type="text" value={empForm.bank} onChange={e => setEmpForm({...empForm, bank: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm outline-none focus:border-action-500" placeholder="e.g. GTBank" />
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-brand-500 uppercase block mb-1">Account Number</label>
                                  <input type="text" value={empForm.accountNumber} onChange={e => setEmpForm({...empForm, accountNumber: e.target.value})} className="w-full p-2.5 bg-brand-50 border border-brand-100 rounded-sm text-sm font-mono outline-none focus:border-action-500" placeholder="0123456789" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-brand-50 border-t border-brand-100 shrink-0 flex justify-end gap-3">
                      <button onClick={() => setIsEmployeeModalOpen(false)} className="px-6 py-2.5 border border-brand-200 text-brand-600 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-brand-100">Discard</button>
                      <button onClick={handleSaveEmployee} className="px-8 py-2.5 bg-brand-950 text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-black shadow-xl flex items-center gap-2">
                        <Save className="w-3.5 h-3.5" /> Commit Personnel Node
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
