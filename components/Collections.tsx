
import React, { useState, useRef, useEffect } from 'react';
import { PageHeader } from './PageHeader';
import { Collection, CollectionType } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { Plus, Copy, Check, Trash2, ExternalLink, QrCode, X, Download, Eye, CreditCard, Lock, Shield, Package, Repeat, Heart, Code, Smartphone, Terminal, Braces, FileCode, Globe, Camera, Loader2, Sparkles, Zap, RefreshCw, Wallet, Share2 } from 'lucide-react';

interface CollectionsProps {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  onSettle?: (id: string, amount: number) => void;
}

const PROMPT = ">>> "

export const Collections: React.FC<CollectionsProps> = ({ collections, setCollections, onSettle }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newType, setNewType] = useState<CollectionType>('PRODUCT');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCurrency, setNewCurrency] = useState('USD');
  const [newFrequency, setNewFrequency] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [embedLink, setEmbedLink] = useState<Collection | null>(null);
  const [embedTab, setEmbedTab] = useState<'HTML' | 'REACT' | 'API'>('HTML');
  const [previewLink, setPreviewLink] = useState<Collection | null>(null);
  const [isSimulatingPay, setIsSimulatingPay] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const SUPPORTED_CURRENCIES = ['USD', 'NGN', 'EUR', 'GBP', 'JPY', 'CAD'];

  const handleScanClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !process.env.API_KEY) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { inlineData: { data: base64, mimeType: file.type } },
              { text: "Extract the billing information from this invoice. Return JSON with keys: title, amount, currency (3 letter code), description." }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "amount"]
            }
          }
        });
        
        const data = JSON.parse(response.text || '{}');
        setNewTitle(data.title || '');
        setNewAmount(data.amount?.toString() || '');
        setNewCurrency(SUPPORTED_CURRENCIES.includes(data.currency) ? data.currency : 'USD');
        setNewDesc(data.description || 'Extracted via AI Vision');
        setNewType('PRODUCT');
        setIsCreating(true);
        setWizardStep(2);
      } catch (err) {
        console.error(err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!newTitle) return;

    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: newType,
      title: newTitle,
      description: newDesc,
      amount: newAmount ? parseFloat(newAmount) : undefined,
      currency: newCurrency,
      frequency: newType === 'SUBSCRIPTION' ? newFrequency : undefined,
      url: `https://payflow.app/${newType.toLowerCase()}/${Math.random().toString(36).substr(2, 6)}`,
      active: true,
      clicks: 0,
      revenue: 0
    };

    setCollections([newCollection, ...collections]);
    resetForm();
  };

  const handleSimulatePayment = async () => {
    if (!previewLink || !onSettle) return;
    setIsSimulatingPay(true);
    setSimLogs([]);
    
    const logs = [
        ">> INITIALIZING HANDSHAKE...",
        ">> AUTHORIZING CARD VIA HSM...",
        ">> COMMITTING SETTLEMENT TO GLOBAL TREASURY...",
        ">> FINALIZING LEDGER ENTRY...",
        ">> DISPATCHING WEBHOOK TO DEVELOPER SERVER..."
    ];

    for (let i = 0; i < logs.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        setSimLogs(prev => [...prev, logs[i]]);
    }

    onSettle(previewLink.id, previewLink.amount || 0);
    setIsSimulatingPay(false);
    setPreviewLink(null);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDesc('');
    setNewAmount('');
    setNewCurrency('USD');
    setNewType('PRODUCT');
    setWizardStep(1);
    setIsCreating(false);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(l => l.id !== id));
  };

  const formatAmount = (amount: number | undefined, currency: string) => {
    if (amount === undefined) return 'VAR';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  const getTypeColor = (type: CollectionType) => {
    switch(type) {
      case 'PRODUCT': return 'text-data-emerald bg-emerald-50 border-emerald-100';
      case 'SUBSCRIPTION': return 'text-data-blue bg-blue-50 border-blue-100';
      case 'DONATION': return 'text-data-violet bg-violet-50 border-violet-100';
      default: return 'text-brand-500 bg-brand-50 border-brand-100';
    }
  };

  const getTypeIcon = (type: CollectionType) => {
    switch(type) {
      case 'PRODUCT': return <Package className="w-4 h-4" />;
      case 'SUBSCRIPTION': return <Repeat className="w-4 h-4" />;
      case 'DONATION': return <Heart className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEmbedCode = (col: Collection, tab: 'HTML' | 'REACT' | 'API') => {
    switch(tab) {
      case 'HTML': return `<!-- Standard Integration -->\n<div \n  class="payflow-button" \n  data-id="${col.id}" \n  data-auto-init="true"\n></div>\n<script src="https://mesh.payflow.link/v3/init.js"></script>`;
      case 'REACT': return `import { PayFlowButton } from '@payflow/react-sdk';\n\n<PayFlowButton \n  streamId="${col.id}" \n  theme="dark" \n  onSuccess={(tx) => console.log(tx)} \n/>`;
      case 'API': return `curl -X POST https://api.payflow.link/v1/sessions \\\n  -H "Authorization: Bearer YOUR_SK" \\\n  -d "collection_id=${col.id}" \\\n  -d "amount=${col.amount || 0}"`;
      default: return '';
    }
  }

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      <PageHeader 
        title="Revenue Streams" 
        subtitle="Manage global products, subscriptions, and donation campaigns."
        breadcrumbs={['Workspace', 'Commerce', 'Collections']}
        actions={
            <div className="flex gap-2">
              <button
                onClick={handleScanClick}
                disabled={isScanning}
                className="bg-brand-950 text-action-500 border border-brand-900 px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 hover:bg-brand-900 transition-all uppercase tracking-wide disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Smart Scan
              </button>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-action-500 hover:bg-action-600 text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors uppercase tracking-wide shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create Stream
              </button>
            </div>
        }
      />

      {isScanning && (
        <div className="bg-brand-950 border border-action-500/50 p-8 rounded-sm text-center space-y-4 animate-pulse">
           <Sparkles className="w-8 h-8 text-action-500 mx-auto" />
           <p className="text-xs font-mono text-action-500 uppercase tracking-[0.2em]">Vision Oracle: OCR Parsing in Progress...</p>
        </div>
      )}

      {isCreating && (
        <div className="bg-brand-50 p-6 rounded-sm border border-brand-200 mb-6 animate-in fade-in slide-in-from-top-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-action-500"></div>
          <div className="flex justify-between items-center mb-6 border-b border-brand-200 pb-2">
             <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900">New Revenue Endpoint // Step {wizardStep}</h3>
             <button onClick={resetForm}><X className="w-4 h-4 text-brand-400 hover:text-brand-900" /></button>
          </div>

          {wizardStep === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <button onClick={() => { setNewType('PRODUCT'); setWizardStep(2); }} className="p-6 bg-white border border-brand-200 hover:border-action-500 rounded-sm text-left group">
                 <Package className="w-10 h-10 text-data-emerald mb-4" />
                 <h4 className="font-bold text-brand-900 text-sm uppercase">Product / Invoice</h4>
               </button>
               <button onClick={() => { setNewType('SUBSCRIPTION'); setWizardStep(2); }} className="p-6 bg-white border border-brand-200 hover:border-action-500 rounded-sm text-left group">
                 <Repeat className="w-10 h-10 text-data-blue mb-4" />
                 <h4 className="font-bold text-brand-900 text-sm uppercase">Subscription</h4>
               </button>
               <button onClick={() => { setNewType('DONATION'); setWizardStep(2); }} className="p-6 bg-white border border-brand-200 hover:border-action-500 rounded-sm text-left group">
                 <Heart className="w-10 h-10 text-data-violet mb-4" />
                 <h4 className="font-bold text-brand-900 text-sm uppercase">Donation</h4>
               </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-bold text-brand-500 uppercase mb-1">Title</label>
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-brand-500 uppercase mb-1">Amount</label>
                    <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full px-3 py-2 border border-brand-200 rounded-sm text-sm" />
                 </div>
               </div>
               <button onClick={handleCreate} className="px-6 py-2 bg-brand-900 text-white font-bold uppercase text-xs rounded-sm">Launch Stream</button>
            </div>
          )}
        </div>
      )}

      <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
        {collections.length === 0 ? (
          <div className="p-16 text-center"><Package className="w-12 h-12 mx-auto text-brand-200 mb-4" /><p className="text-brand-500 font-mono text-xs mt-2 uppercase">No Active Streams</p></div>
        ) : (
          <div className="divide-y divide-brand-100">
             {collections.map((col) => (
              <div key={col.id} className="p-4 hover:bg-brand-50 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`p-1.5 rounded-sm border ${getTypeColor(col.type)}`}>{getTypeIcon(col.type)}</div>
                    <h3 className="font-bold text-brand-900 text-sm truncate">{col.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-500 font-mono pl-9">
                    <span className="font-bold text-brand-700">{formatAmount(col.amount, col.currency)}</span>
                    <span className="text-brand-200">|</span>
                    <span className="text-brand-400">{col.revenue > 0 ? `$${col.revenue.toLocaleString()} EARNED` : '0 VOL'}</span>
                    <span className="text-brand-200">|</span>
                    <span className="truncate">{col.url}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => setEmbedLink(col)} className="p-1.5 border border-brand-200 rounded-sm hover:text-action-500 transition-colors" title="Get Integration Snippet"><Code className="w-3.5 h-3.5" /></button>
                   <button onClick={() => { setPreviewLink(col); setCollections(prev => prev.map(c => c.id === col.id ? {...c, clicks: c.clicks + 1} : c)) }} className="p-1.5 border border-brand-200 rounded-sm hover:text-action-500 transition-colors" title="Simulate Endpoint"><Eye className="w-3.5 h-3.5" /></button>
                   <button onClick={() => copyToClipboard(col.id, col.url)} className="p-1.5 border border-brand-200 rounded-sm hover:text-brand-900 transition-colors">{copiedId === col.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}</button>
                   <button onClick={() => deleteCollection(col.id)} className="p-1.5 text-brand-300 hover:text-data-rose transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Embed Code Modal */}
      {embedLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-950/90 backdrop-blur-sm" onClick={() => setEmbedLink(null)}></div>
          <div className="relative bg-white border border-brand-200 shadow-2xl w-full max-w-2xl rounded-sm overflow-hidden animate-in zoom-in-95">
             <div className="bg-brand-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-action-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Orchestration Gateway</h3>
                </div>
                <button onClick={() => setEmbedLink(null)}><X className="w-4 h-4" /></button>
             </div>
             
             <div className="p-8">
                <div className="mb-6">
                    <h4 className="text-xl font-bold text-brand-900 mb-1">{embedLink.title}</h4>
                    <p className="text-sm text-brand-500">Deploy this stream anywhere on your digital estate.</p>
                </div>
                
                <div className="flex border-b border-brand-100 mb-4">
                   {(['HTML', 'REACT', 'API'] as const).map(tab => (
                     <button 
                       key={tab}
                       onClick={() => setEmbedTab(tab)}
                       className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${embedTab === tab ? 'border-action-500 text-brand-900' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>

                <div className="relative group">
                   <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-brand-600 uppercase font-bold select-none opacity-50">
                       {embedTab}_SNIPPET
                   </div>
                   <pre className="bg-brand-950 text-action-500 p-6 rounded-sm text-xs font-mono overflow-x-auto h-48 border border-brand-800 shadow-inner selection:bg-action-500 selection:text-white">
                      {getEmbedCode(embedLink, embedTab)}
                   </pre>
                   <button 
                      onClick={() => copyToClipboard('embed', getEmbedCode(embedLink, embedTab))}
                      className="absolute bottom-4 right-4 p-3 bg-brand-800 text-white rounded-sm hover:bg-brand-700 transition-colors shadow-lg flex items-center gap-2 text-[10px] font-bold uppercase"
                   >
                      {copiedId === 'embed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <><Copy className="w-3.5 h-3.5" /> Copy Code</>}
                   </button>
                </div>

                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-sm flex gap-4">
                   <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
                   <div className="space-y-1">
                       <p className="text-[11px] text-emerald-800 font-bold uppercase">Automated Webhook Logic</p>
                       <p className="text-[10px] text-emerald-700 leading-relaxed font-mono">
                          {PROMPT}SUCCESS_EVENT will be broadcast to your Production Endpoint: /v1/webhooks
                       </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Checkout Simulator Modal */}
      {previewLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-brand-950/95 backdrop-blur-sm"
            onClick={() => !isSimulatingPay && setPreviewLink(null)}
          ></div>
          
          <div className="relative w-full max-w-lg bg-brand-50 rounded-sm shadow-2xl border border-brand-200 overflow-hidden animate-in slide-in-from-bottom-4">
             {/* Simulator Header */}
             <div className="bg-brand-900 text-white p-3 flex justify-between items-center border-b border-brand-800">
                <div className="flex items-center gap-2">
                   <Zap className="w-4 h-4 text-action-500 fill-current" />
                   <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Payflow Live Mesh Session</span>
                </div>
                <button 
                  onClick={() => !isSimulatingPay && setPreviewLink(null)}
                  className="hover:text-action-500 transition-colors"
                >
                   <X className="w-4 h-4" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Mock Checkout Page */}
                <div className="md:col-span-12 p-10 bg-white relative">
                    <div className="flex items-center gap-2 mb-10">
                    <div className="bg-action-500 p-1.5 rounded-sm">
                        <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-brand-900 tracking-tighter text-lg uppercase font-mono">PAYFLOW</span>
                    </div>

                    <div className="space-y-8">
                    <div>
                        <p className="text-[10px] text-brand-400 font-mono uppercase mb-1 font-bold">Authorized Merchant Request</p>
                        <h3 className="text-2xl font-bold text-brand-900 tracking-tight">{previewLink.title}</h3>
                        <p className="text-sm text-brand-500 mt-2 leading-relaxed">{previewLink.description || 'Seamless global settlement rail acquisition.'}</p>
                    </div>

                    <div className="py-6 border-y border-brand-100 flex justify-between items-end">
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Amount to Settle</span>
                        <span className="text-4xl font-mono font-bold text-brand-900">{formatAmount(previewLink.amount, previewLink.currency)}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-brand-50 border border-brand-100 rounded-sm">
                            <div className="flex items-center gap-3 text-brand-900">
                                <CreditCard className="w-5 h-5 text-brand-400" />
                                <span className="text-sm font-bold uppercase tracking-tight">Acme Dev Card (Live Simulation)</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSimulatePayment}
                            disabled={isSimulatingPay}
                            className="w-full bg-brand-950 text-white py-5 rounded-sm font-bold shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                        >
                            {isSimulatingPay ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5 text-action-500" />}
                            Authorize Settlement
                        </button>
                        
                        {isSimulatingPay && (
                            <div className="p-4 bg-brand-950 rounded-sm border border-brand-800 animate-in fade-in duration-300">
                                <div className="space-y-1 font-mono text-[9px] text-action-400">
                                    {simLogs.map((log, i) => (
                                        <p key={i} className={i === simLogs.length - 1 ? "animate-pulse" : ""}>{log}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isSimulatingPay && (
                            <p className="text-center text-[10px] text-brand-300 font-mono flex items-center justify-center gap-2">
                                <Shield className="w-3 h-3" /> HSM_TUNNEL_ENCRYPTED_SHA256
                            </p>
                        )}
                    </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
