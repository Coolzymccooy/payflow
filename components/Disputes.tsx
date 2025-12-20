import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Dispute } from '../types';
import { ShieldAlert, AlertCircle, CheckCircle, Clock, Info, X, FileText, Upload } from 'lucide-react';

interface DisputesProps {
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

const PROMPT = ">>>"
export const Disputes: React.FC<DisputesProps> = ({ addNotification }) => {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  // Mock Disputes
  const disputes: Dispute[] = [
    { id: 'DSP-9982', transactionId: 'TX-829A', amount: 150.00, reason: 'Product not received', status: 'OPEN', dueDate: '2024-06-15' },
    { id: 'DSP-1102', transactionId: 'TX-773B', amount: 45.50, reason: 'Duplicate processing', status: 'WON', dueDate: '2024-05-20' },
    { id: 'DSP-3321', transactionId: 'TX-112C', amount: 200.00, reason: 'Fraudulent transaction', status: 'LOST', dueDate: '2024-05-10' },
  ];

  const handleSubmitEvidence = () => {
      setSelectedDispute(null);
      if(addNotification) addNotification('Evidence Submitted', 'Case updated. Review in 3-5 days.', 'SUCCESS');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dispute Resolution" 
        subtitle="Case management and evidence submission."
        breadcrumbs={['Workspace', 'Finance', 'Disputes']}
      />

      {/* Info Strip */}
      <div className="flex items-start gap-3 p-3 bg-brand-50 border border-brand-200 rounded-sm text-sm text-brand-600">
        <Info className="w-4 h-4 mt-0.5 text-brand-900" />
        <p>
          <span className="font-bold text-brand-900 block md:inline md:mr-2">AUTOMATED EVIDENCE ACTIVE:</span>
          System automatically compiling shipping logs for open cases. Estimated recovery: $450.00.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-sm border border-brand-100 shadow-sm">
           <p className="text-xs font-mono uppercase text-brand-500 mb-2 font-bold">Dispute Rate</p>
           <p className="text-2xl font-mono font-medium text-brand-900">0.02%</p>
           <p className="text-[10px] text-data-emerald font-bold uppercase mt-1">{PROMPT}LOW RISK TIER</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-brand-100 shadow-sm">
           <p className="text-xs font-mono uppercase text-brand-500 mb-2 font-bold">Win Rate</p>
           <p className="text-2xl font-mono font-medium text-brand-900">85%</p>
           <p className="text-[10px] text-brand-400 font-bold uppercase mt-1">vs INDUSTRY 40%</p>
        </div>
        <div className="bg-white p-4 rounded-sm border border-brand-100 shadow-sm border-l-4 border-l-action-500">
           <p className="text-xs font-mono uppercase text-brand-500 mb-2 font-bold">Active Cases</p>
           <p className="text-2xl font-mono font-medium text-action-600">1</p>
           <p className="text-[10px] text-action-600 font-bold uppercase mt-1">{PROMPT}ACTION REQUIRED</p>
        </div>
      </div>

      <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-brand-500 font-medium border-b border-brand-100">
            <tr>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold">Case ID</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold">Reference</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold">Reason</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold">Amount</th>
              <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-bold">Status</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-wider font-mono font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {disputes.map((d) => (
              <tr key={d.id} className="hover:bg-brand-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-brand-900">{d.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-brand-500">{d.transactionId}</td>
                <td className="px-4 py-3 text-brand-700">{d.reason}</td>
                <td className="px-4 py-3 font-mono font-bold text-brand-900">${d.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {d.status === 'OPEN' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-action-50 text-action-700 border border-action-100">
                      EVIDENCE REQ
                    </span>
                  )}
                  {d.status === 'WON' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-emerald-50 text-data-emerald border border-emerald-100">
                      RESOLVED
                    </span>
                  )}
                  {d.status === 'LOST' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-rose-50 text-data-rose border border-rose-100">
                      LOST
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => setSelectedDispute(d)}
                    className="text-xs font-bold uppercase border border-brand-200 text-brand-600 px-2 py-1 rounded-sm hover:bg-brand-900 hover:text-white hover:border-brand-900 transition-colors"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Management Modal */}
      {selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm" onClick={() => setSelectedDispute(null)}></div>
              <div className="relative bg-white border border-brand-200 shadow-xl w-full max-w-lg rounded-sm overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4" /> Dispute Resolution Center
                      </h3>
                      <button onClick={() => setSelectedDispute(null)}><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-6 pb-4 border-b border-brand-100">
                          <div>
                              <div className="text-xs font-mono text-brand-500 mb-1">CASE ID</div>
                              <div className="text-xl font-bold text-brand-900">{selectedDispute.id}</div>
                          </div>
                          <div className="text-right">
                              <div className="text-xs font-mono text-brand-500 mb-1">DISPUTED AMOUNT</div>
                              <div className="text-xl font-mono font-bold text-brand-900">${selectedDispute.amount.toFixed(2)}</div>
                          </div>
                      </div>

                      <div className="space-y-4 mb-6">
                          <div>
                              <label className="block text-xs font-bold text-brand-900 uppercase mb-2">Evidence Required</label>
                              <div className="p-3 bg-brand-50 border border-brand-200 rounded-sm text-xs text-brand-600">
                                  Proof of Delivery, Customer Communication Logs, Terms of Service Acceptance.
                              </div>
                          </div>
                          
                          <div className="border border-brand-200 border-dashed rounded-sm p-8 text-center hover:bg-brand-50 transition-colors cursor-pointer">
                              <Upload className="w-6 h-6 text-brand-300 mx-auto mb-2" />
                              <p className="text-xs font-bold text-brand-600 uppercase">Drag & Drop Evidence Files</p>
                              <p className="text-[10px] text-brand-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button onClick={handleSubmitEvidence} className="flex-1 py-2 bg-brand-900 text-white font-bold uppercase text-xs rounded-sm hover:bg-brand-800">Submit Evidence Pack</button>
                          <button onClick={() => setSelectedDispute(null)} className="px-4 py-2 bg-white border border-brand-200 text-brand-600 font-bold uppercase text-xs rounded-sm hover:bg-brand-50">Cancel</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};