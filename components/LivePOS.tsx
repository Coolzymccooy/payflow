
import React, { useState, useRef } from 'react';
import { PageHeader } from './PageHeader';
import { Camera, X, CheckCircle2, ShoppingBag, CreditCard, Smartphone, QrCode, Loader2, ArrowRight, Scan, Receipt, Package, ShieldAlert, RefreshCw, Keyboard, Info, Database, Zap } from 'lucide-react';

const PROMPT = ">> ";
// Centralized Mock Registry for testing
const MOCK_REGISTRY: Record<string, { name: string; price: number }> = {
    'SKU-0001': { name: 'Global Enterprise License', price: 1250.00 },
    'SKU-0002': { name: 'Manual Settlement Unit', price: 45.00 },
    'SKU-0003': { name: 'Direct Corridor Pass', price: 15.00 }
};

interface LivePOSProps {
    recordSettlement: (items: { id: string; name: string; price: number }[]) => void;
}

export const LivePOS: React.FC<LivePOSProps> = ({ recordSettlement }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([]);
    const [checkoutStep, setCheckoutStep] = useState<'IDLE' | 'SCANNING' | 'PAYING' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [scanError, setScanError] = useState<string | null>(null);
    const [manualSku, setManualSku] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startScanner = async () => {
        setScanError(null);
        setCheckoutStep('SCANNING');
        setIsScanning(true);

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("HARDWARE_NOT_SUPPORTED");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (e: any) {
            setIsScanning(false);
            setCheckoutStep('ERROR');
            setScanError(e.name === 'NotAllowedError' ? "CAMERA_ACCESS_DENIED" : "HARDWARE_FAULT");
        }
    };

    const handleManualAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const upperSku = manualSku.toUpperCase().trim();
        const found = MOCK_REGISTRY[upperSku];
        
        if (found) {
            setCart([...cart, { id: upperSku, ...found }]);
            setManualSku('');
            setCheckoutStep('IDLE');
        } else {
            alert(`SKU [${upperSku}] not found in Registry.`);
        }
    };

    const simulateScan = () => {
        const product = MOCK_REGISTRY['SKU-0001'];
        setCart([...cart, { id: 'SKU-0001', ...product }]);
        setIsScanning(false);
        setCheckoutStep('IDLE');
        stopCamera();
    };

    const handleSimulatePayment = async () => {
        setCheckoutStep('SYNCING');
        
        // MIMICKING TRUE DESTINATION SYNC (HSM & Oracle Verification)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Execute real data write to the global records
        recordSettlement(cart);
        
        setCheckoutStep('SUCCESS');
    };

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <PageHeader 
                title="Live Register" 
                subtitle="High-performance Point of Sale with real-time Ledger Synchronization."
                breadcrumbs={['Workspace', 'Commerce', 'POS']}
                status="LIVE"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Viewport */}
                <div className="bg-brand-950 rounded-xl overflow-hidden aspect-[3/4] relative border border-brand-800 shadow-2xl">
                    
                    {checkoutStep === 'SCANNING' ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-action-500 rounded-3xl animate-pulse flex items-center justify-center">
                                    <div className="w-72 h-0.5 bg-action-500/50 absolute animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 z-20">
                                <button onClick={() => { stopCamera(); setCheckoutStep('IDLE'); }} className="p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full px-10">
                                <button 
                                    onClick={simulateScan}
                                    className="w-full py-4 bg-white text-brand-950 font-bold uppercase text-xs tracking-widest rounded-full shadow-2xl hover:bg-brand-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <Scan className="w-4 h-4" /> Resolve SKU-0001
                                </button>
                            </div>
                        </>
                    ) : checkoutStep === 'SYNCING' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-6 animate-pulse">
                            <Database className="w-16 h-16 text-action-500 animate-bounce" />
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-white uppercase tracking-tighter">Syncing to Registry</p>
                                <p className="text-brand-500 text-[10px] font-mono uppercase tracking-widest">Writing to global liquidity pool...</p>
                            </div>
                        </div>
                    ) : checkoutStep === 'ERROR' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-6 animate-in fade-in">
                            <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/30">
                                <ShieldAlert className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-white uppercase tracking-tighter">Diagnostic Warning</p>
                                <p className="text-brand-400 text-[10px] font-mono leading-relaxed uppercase">{scanError}</p>
                            </div>
                            <div className="w-full space-y-4">
                                <div className="p-4 bg-brand-900 border border-brand-700 rounded-sm text-left">
  <div className="flex items-center gap-2 text-action-500 mb-2">
    <Info className="w-3.5 h-3.5" />
    <span className="text-[10px] font-bold uppercase tracking-widest">Test Registry</span>
  </div>

  <p className="text-[9px] text-brand-400 font-mono uppercase">
    {PROMPT}SKU-0001: Enterprise
  </p>
  <p className="text-[9px] text-brand-400 font-mono uppercase">
    {PROMPT}SKU-0002: Manual Unit
  </p>
</div>

                                <form onSubmit={handleManualAdd} className="relative group">
                                    <input 
                                        type="text" 
                                        value={manualSku}
                                        onChange={(e) => setManualSku(e.target.value)}
                                        placeholder="ENTER SKU (e.g. SKU-0002)..." 
                                        className="w-full bg-brand-900 border border-brand-700 px-4 py-4 rounded-sm text-xs font-mono text-white outline-none focus:border-action-500 transition-all"
                                    />
                                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-action-500 hover:text-white">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                                <button 
                                    onClick={startScanner}
                                    className="text-[10px] font-bold text-brand-500 hover:text-white uppercase tracking-widest"
                                >
                                    Try Scanner Again
                                </button>
                            </div>
                        </div>
                    ) : checkoutStep === 'PAYING' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-8">
                            <QrCode className="w-48 h-48 text-white p-4 bg-white/10 rounded-2xl" />
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-white uppercase tracking-tighter">Scan to Pay</p>
                                <p className="text-brand-400 text-xs font-mono">Present to customer to complete settlement.</p>
                            </div>
                            <button 
                                onClick={handleSimulatePayment}
                                className="px-8 py-4 bg-action-500 text-white font-bold uppercase text-[10px] rounded-sm shadow-xl hover:bg-action-600 transition-all flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4 fill-current" /> Simulate Payment Success
                            </button>
                        </div>
                    ) : checkoutStep === 'SUCCESS' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 animate-in zoom-in-95">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <p className="text-2xl font-bold text-white uppercase tracking-tighter">Settled</p>
                            <p className="text-brand-500 font-mono text-xs mt-2 uppercase tracking-[0.2em]">Transaction Synced to Vault</p>
                            <button 
                                onClick={() => { setCart([]); setCheckoutStep('IDLE'); }}
                                className="mt-12 text-[10px] font-bold text-action-500 uppercase tracking-widest hover:underline"
                            >
                                Start New Checkout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-12 space-y-6">
                            <div className="w-20 h-20 bg-brand-900 rounded-full flex items-center justify-center text-brand-500 border border-brand-800">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <p className="text-brand-400 text-sm font-mono uppercase tracking-widest">Register Idle</p>
                            <div className="w-full max-w-[200px] space-y-3">
                                <button 
                                    onClick={startScanner}
                                    className="w-full py-4 bg-action-500 text-white font-bold uppercase text-[10px] tracking-widest rounded-full hover:bg-action-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Scan className="w-4 h-4" /> Optical Scanner
                                </button>
                                <button 
                                    onClick={() => setCheckoutStep('ERROR')}
                                    className="w-full py-3 bg-brand-900 text-brand-400 font-bold uppercase text-[9px] tracking-widest rounded-full hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Keyboard className="w-3.5 h-3.5" /> Manual Entry
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tally / Cart */}
                <div className="flex flex-col h-full bg-white border border-brand-100 rounded-sm shadow-sm overflow-hidden min-h-[600px]">
                    <div className="p-6 border-b border-brand-100 bg-brand-50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-brand-400" /> Tally Sheet
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-brand-400">{cart.length} ITEMS</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-30">
                                <Package className="w-12 h-12 mb-2" />
                                <p className="text-[10px] font-bold uppercase">Bag is empty</p>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-brand-50 pb-4 animate-in slide-in-from-right-2">
                                    <div>
                                        <p className="font-bold text-brand-900 text-sm">{item.name}</p>
                                        <p className="text-[10px] text-brand-400 font-mono uppercase">Unit_ID: {item.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-brand-900">${item.price.toFixed(2)}</p>
                                        <button 
                                            onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                            className="text-[10px] text-brand-300 hover:text-data-rose"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-8 bg-brand-50 border-t border-brand-100 space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">Total Volume</span>
                            <span className="text-4xl font-mono font-bold text-brand-900">${total.toFixed(2)}</span>
                        </div>
                        <button 
                            disabled={cart.length === 0 || checkoutStep !== 'IDLE'}
                            onClick={() => setCheckoutStep('PAYING')}
                            className="w-full py-5 bg-brand-950 text-white rounded-sm font-bold uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <CreditCard className="w-5 h-5 text-action-500" /> Process Settlement
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
