
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Transaction, TransactionStatus, CollectionType } from '../types';
// Added RefreshCw to the list of icons imported from lucide-react
import { Search, Filter, Download, X, User, Calendar, CreditCard, FileText, ShieldCheck, ShieldAlert, Package, Repeat, Heart, Loader2, CheckCircle2, FileDown, RefreshCw } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onRefundTransaction?: (tx: Transaction) => Promise<void>;
  addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, onRefundTransaction, addNotification }) => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<CollectionType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredTransactions = transactions
    .filter(t => filterType === 'ALL' || t.type === filterType)
    .filter(t => t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()));

  const getTypeIcon = (type: CollectionType) => {
    switch(type) {
      case 'PRODUCT': return <Package className="w-3 h-3" />;
      case 'SUBSCRIPTION': return <Repeat className="w-3 h-3" />;
      case 'DONATION': return <Heart className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: CollectionType) => {
    switch(type) {
      case 'PRODUCT': return 'text-data-emerald bg-emerald-50 border-emerald-100';
      case 'SUBSCRIPTION': return 'text-data-blue bg-blue-50 border-blue-100';
      case 'DONATION': return 'text-data-violet bg-violet-50 border-violet-100';
      default: return 'text-brand-50 bg-brand-50 border-brand-100';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
     return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Customer', 'Amount', 'Currency', 'Status', 'Type', 'Method'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => [
        tx.id, tx.date, `"${tx.customerName}"`, tx.amount, tx.currency, tx.status, tx.type, tx.method
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `payflow_ledger_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    if (addNotification) addNotification('Export Complete', `Successfully exported ${filteredTransactions.length} records.`, 'SUCCESS');
  };

  const handleRefund = async () => {
    if (!selectedTx || selectedTx.status !== TransactionStatus.COMPLETED) return;
    setIsRefunding(true);
    
    try {
        if (onRefundTransaction) {
            await onRefundTransaction(selectedTx);
        }
        setSelectedTx(null);
    } catch (e) {
        if (addNotification) addNotification('Refund Error', 'Failed to communicate with acquisition gateway.', 'ERROR');
    } finally {
        setIsRefunding(false);
    }
  };

  const handleDownloadReceipt = async () => {
    if (!selectedTx) return;
    setIsDownloading(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const receiptContent = `
PAYFLOW OS - SETTLEMENT RECEIPT
-----------------------------------
REF_ID: ${selectedTx.id}
TIMESTAMP: ${new Date(selectedTx.date).toLocaleString()}
ENTITY: ${selectedTx.customerName}
AMOUNT: ${formatCurrency(selectedTx.amount, selectedTx.currency)}
STATUS: ${selectedTx.status}
METHOD: ${selectedTx.method}
TYPE: ${selectedTx.type}
-----------------------------------
Authorized by Tiwaton Global HSM
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `RECEIPT_${selectedTx.id}.txt`;
    link.click();

    setIsDownloading(false);
    if (addNotification) addNotification('Receipt Generated', 'Transaction document downloaded to local storage.', 'SUCCESS');
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Ledger" 
        subtitle="Recent incoming settlements across all channels."
        breadcrumbs={['Workspace', 'Finance', 'Transactions']}
        actions={
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-200 rounded-sm text-brand-600 hover:border-action-500 hover:text-action-600 transition-colors text-xs font-bold uppercase tracking-wide"
            >
                <Download className="w-3 h-3" />
                CSV Export
            </button>
        }
      />

      <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
        <div className="p-3 border-b border-brand-100 flex flex-col md:flex-row gap-3 justify-between bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref ID or client..."
              className="w-full pl-8 pr-3 py-1.5 border border-brand-200 rounded-sm text-xs font-mono focus:ring-1 focus:ring-action-500 focus:border-action-500 outline-none bg-brand-50 text-brand-900 placeholder:text-brand-400"
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'PRODUCT', 'SUBSCRIPTION', 'DONATION'] as const).map(type => (
               <button 
                 key={type}
                 onClick={() => setFilterType(type)}
                 className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wide transition-colors border
                   ${filterType === type 
                     ? 'bg-brand-900 text-white border-brand-900' 
                     : 'bg-white text-brand-50 border-brand-200 hover:border-brand-300'
                   }`}
               >
                 {type}
               </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-50 text-brand-500 font-medium border-b border-brand-100">
              <tr>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-semibold">Reference</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-semibold">Type</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-semibold">Entity</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider font-mono font-semibold">State</th>
                <th className="px-4 py-3 text-right text-xs uppercase tracking-wider font-mono font-semibold">Vol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-brand-50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-mono text-xs text-brand-500 group-hover:text-brand-900">
                    {tx.id}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${getTypeColor(tx.type)}`}>
                      {getTypeIcon(tx.type)}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-brand-900 text-sm">{tx.customerName}</div>
                  </td>
                  <td className="px-4 py-3 text-brand-500 text-xs font-mono">
                    {new Date(tx.date).toLocaleDateString()} <span className="text-brand-300">/</span> {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-4 py-3">
                    {tx.status === TransactionStatus.COMPLETED && <span className="text-[10px] font-mono font-bold text-data-emerald bg-emerald-50 px-1.5 py-0.5 rounded-sm border border-emerald-100">SETTLED</span>}
                    {tx.status === TransactionStatus.PENDING && <span className="text-[10px] font-mono font-bold text-action-600 bg-action px-1.5 py-0.5 rounded-sm border border-action-100">HOLD</span>}
                    {tx.status === TransactionStatus.FAILED && <span className="text-[10px] font-mono font-bold text-data-rose bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-100">DECLINED</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-brand-900 font-mono-nums">
                    {formatCurrency(tx.amount, tx.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm"
            onClick={() => !isRefunding && setSelectedTx(null)}
          ></div>
          <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-100 rounded-sm">
            <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
              <h3 className="font-mono text-sm font-bold text-brand-900 uppercase tracking-widest">TX_ENTRY: {selectedTx.id}</h3>
              <button 
                onClick={() => !isRefunding && setSelectedTx(null)}
                className="hover:bg-brand-200 p-1 rounded-sm transition-colors"
              >
                <X className="w-4 h-4 text-brand-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-end border-b border-dashed border-brand-200 pb-4">
                <span className="text-xs text-brand-500 font-mono font-bold uppercase">Settled Volume</span>
                <span className="text-3xl font-mono font-medium text-brand-900">{formatCurrency(selectedTx.amount, selectedTx.currency)}</span>
              </div>

              {/* Fraud Analysis Section */}
              <div className="border border-brand-200 p-4 rounded-sm bg-brand-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-brand-500 tracking-wider">Risk Heuristic</span>
                  <span className={`font-mono text-[10px] font-bold ${selectedTx.fraudScore >= 90 ? 'text-data-emerald' : 'text-data-rose'}`}>
                    HSM_SCORE: {selectedTx.fraudScore}
                  </span>
                </div>
                <p className="text-[10px] text-brand-600 font-mono leading-relaxed uppercase">
                  {selectedTx.fraudScore >= 90 
                    ? ">> ENTITY_MATCH: VERIFIED_CHANNEL" 
                    : ">> WARNING: VELOCITY_THROTTLED"}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-500 uppercase font-bold tracking-widest">Client Identity</span>
                  <span className="font-bold text-brand-900">{selectedTx.customerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-500 uppercase font-bold tracking-widest">Settlement Rail</span>
                  <span className="font-mono text-brand-700 flex items-center gap-1.5 uppercase text-xs">
                     <CreditCard className="w-3.5 h-3.5 text-action-500" /> {selectedTx.method}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-500 uppercase font-bold tracking-widest">Channel Class</span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm border font-bold uppercase ${getTypeColor(selectedTx.type)}`}>
                    {selectedTx.type}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-brand-500 uppercase font-bold tracking-widest">Operation Memo</span>
                  <span className="text-brand-700 text-xs text-right max-w-[200px]">{selectedTx.description}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-brand-100 bg-brand-50 flex gap-3">
              <button 
                onClick={handleDownloadReceipt}
                disabled={isDownloading || isRefunding}
                className="flex-1 px-4 py-3 bg-white border border-brand-200 rounded-sm text-xs font-bold text-brand-900 hover:border-brand-900 uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><FileDown className="w-3.5 h-3.5 text-action-500" /> Receipt PDF</>}
              </button>
              <button 
                onClick={handleRefund}
                disabled={isRefunding || selectedTx.status !== TransactionStatus.COMPLETED}
                className="flex-1 px-4 py-3 bg-brand-950 text-white rounded-sm text-xs font-bold hover:bg-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
              >
                {isRefunding ? (
                    <><RefreshCw className="w-3.5 h-3.5 animate-spin text-action-500" /> Reversing...</>
                ) : (
                    <><RefreshCw className="w-3.5 h-3.5" /> Issue Refund</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
