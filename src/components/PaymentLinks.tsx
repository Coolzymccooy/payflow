import React, { useState } from 'react';
import { PaymentLink } from '../types';
import { Plus, Copy, Check, Trash2, ExternalLink, QrCode, X, Download, Link as LinkIcon, Eye, CreditCard, Lock, Shield } from 'lucide-react';

interface PaymentLinksProps {
  links: PaymentLink[];
  setLinks: React.Dispatch<React.SetStateAction<PaymentLink[]>>;
}

export const PaymentLinks: React.FC<PaymentLinksProps> = ({ links, setLinks }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<PaymentLink | null>(null);
  const [previewLink, setPreviewLink] = useState<PaymentLink | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newLink: PaymentLink = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      title: newTitle,
      amount: parseFloat(newAmount),
      url: `https://payflow.app/pay/${Math.random().toString(36).substr(2, 6)}`,
      active: true,
      clicks: 0
    };

    setLinks([newLink, ...links]);
    setNewTitle('');
    setNewAmount('');
    setIsCreating(false);
  };

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-brand-100 pb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-900 tracking-tight">Payment Gateways</h2>
          <p className="text-brand-500 text-sm mt-1">Active collection endpoints.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-action-500 hover:bg-action-600 text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wide shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Endpoint
        </button>
      </div>

      {isCreating && (
        <div className="bg-brand-50 p-6 rounded-sm border border-brand-200 mb-6 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand-900">Configure Endpoint</h3>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Reference Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-200 rounded-sm focus:ring-1 focus:ring-action-500 focus:border-action-500 outline-none bg-white text-sm text-brand-900"
                  placeholder="e.g. CONSULT_FEE_V1"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-brand-500 mb-1 uppercase">Value (USD)</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-200 rounded-sm focus:ring-1 focus:ring-action-500 focus:border-action-500 outline-none bg-white font-mono text-sm text-brand-900"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex justify-start gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-900 text-white rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-brand-800 transition-colors"
              >
                Deploy Link
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-brand-600 hover:bg-brand-200 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
        {links.length === 0 ? (
          <div className="p-12 text-center">
            <LinkIcon className="w-8 h-8 mx-auto text-brand-300 mb-3" />
            <p className="text-brand-500 font-mono text-sm">NO ACTIVE ENDPOINTS</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-100">
             {links.map((link) => (
              <div key={link.id} className="p-4 hover:bg-brand-50 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-brand-900 text-sm truncate">{link.title}</h3>
                    <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase ${link.active ? 'bg-emerald-50 text-data-emerald border border-emerald-100' : 'bg-brand-100 text-brand-500 border border-brand-200'}`}>
                      {link.active ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-500 font-mono">
                    <span className="font-bold text-brand-700">${link.amount.toFixed(2)}</span>
                    <span className="text-brand-200">|</span>
                    <span>{link.clicks} HITS</span>
                    <span className="text-brand-200">|</span>
                    <span className="truncate">{link.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button
                    onClick={() => setPreviewLink(link)}
                    className="p-1.5 border border-brand-200 rounded-sm hover:border-brand-900 hover:text-brand-900 text-brand-400 transition-colors group/eye"
                    title="Simulate Checkout"
                  >
                    <Eye className="w-3 h-3 group-hover/eye:text-action-500" />
                  </button>
                  <button
                    onClick={() => setQrLink(link)}
                    className="p-1.5 border border-brand-200 rounded-sm hover:border-brand-900 hover:text-brand-900 text-brand-400 transition-colors"
                    title="Generate QR"
                  >
                    <QrCode className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(link.id, link.url)}
                    className="p-1.5 border border-brand-200 rounded-sm hover:border-brand-900 hover:text-brand-900 text-brand-400 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === link.id ? <Check className="w-3 h-3 text-data-emerald" /> : <Copy className="w-3 h-3" />}
                  </button>
                  <div className="w-px h-4 bg-brand-100 mx-1"></div>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-1.5 border border-transparent hover:bg-rose-50 hover:text-data-rose text-brand-300 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm"
            onClick={() => setQrLink(null)}
          ></div>
          <div className="relative bg-white border border-brand-200 shadow-xl w-full max-w-sm p-6 text-center rounded-sm">
             <button 
                onClick={() => setQrLink(null)}
                className="absolute top-3 right-3 p-1 hover:bg-brand-50 rounded-sm text-brand-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            
            <div className="mb-4 text-left">
              <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide">QR Access Point</h3>
              <p className="text-brand-500 text-xs font-mono mt-1">ID: {qrLink.id}</p>
            </div>
            
            <div className="bg-white p-2 border border-brand-200 inline-block mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink.url)}`}
                alt="QR Code" 
                className="w-48 h-48 grayscale contrast-125"
              />
            </div>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink.url)}`;
                link.download = `qrcode-${qrLink.id}.png`;
                link.target = '_blank';
                link.click();
              }} 
              className="w-full px-4 py-2 bg-brand-900 text-white rounded-sm text-xs font-bold uppercase tracking-wide hover:bg-brand-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-3 h-3" />
              Download .PNG
            </button>
          </div>
        </div>
      )}

      {/* Checkout Simulator Modal */}
      {previewLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-950/95 backdrop-blur-sm"
            onClick={() => setPreviewLink(null)}
          ></div>
          
          <div className="relative w-full max-w-md bg-brand-50 rounded-sm shadow-2xl border border-brand-200 overflow-hidden">
             {/* Simulator Header */}
             <div className="bg-brand-900 text-white p-3 flex justify-between items-center border-b border-brand-800">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-data-emerald"></div>
                   <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Checkout Simulator Mode</span>
                </div>
                <button 
                  onClick={() => setPreviewLink(null)}
                  className="hover:text-action-500 transition-colors"
                >
                   <X className="w-4 h-4" />
                </button>
             </div>

             {/* Mock Checkout Page */}
             <div className="p-8 bg-white">
                <div className="flex items-center gap-2 mb-8">
                   <div className="w-8 h-8 bg-action-500 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                   </div>
                   <span className="font-bold text-brand-900 tracking-tight">MERCHANT_STORE</span>
                </div>

                <div className="space-y-6">
                   <div>
                      <p className="text-xs text-brand-500 font-mono uppercase mb-1">Payment For</p>
                      <h3 className="text-xl font-bold text-brand-900">{previewLink.title}</h3>
                      <p className="text-2xl font-mono text-brand-900 mt-2">${previewLink.amount.toFixed(2)}</p>
                   </div>

                   <div className="space-y-4 pt-6 border-t border-brand-100">
                      <div>
                         <label className="block text-xs font-bold text-brand-900 mb-1.5">Email address</label>
                         <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm outline-none focus:border-action-500 focus:ring-1 focus:ring-action-500" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-brand-900 mb-1.5">Card information</label>
                         <div className="border border-brand-200 rounded-sm overflow-hidden bg-white">
                            <div className="flex items-center px-3 py-2 border-b border-brand-100">
                               <CreditCard className="w-4 h-4 text-brand-400 mr-2" />
                               <input type="text" placeholder="Card number" className="flex-1 text-sm outline-none" />
                            </div>
                            <div className="flex divide-x divide-brand-100">
                               <input type="text" placeholder="MM / YY" className="w-1/2 px-3 py-2 text-sm outline-none" />
                               <input type="text" placeholder="CVC" className="w-1/2 px-3 py-2 text-sm outline-none" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <button className="w-full bg-brand-900 text-white py-3 rounded-sm font-bold shadow-md hover:bg-brand-800 transition-colors flex items-center justify-center gap-2">
                      <Lock className="w-3 h-3" />
                      Pay ${previewLink.amount.toFixed(2)}
                   </button>
                   
                   <p className="text-center text-[10px] text-brand-400 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Secured by PayFlow OS
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};