
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Terminal, Code, Smartphone, Globe, Lock, ShieldCheck, Zap, Copy, ExternalLink, Play, Eye, RefreshCw, FileCode, Braces, ArrowRight, Loader2, Activity, CheckCircle2 } from 'lucide-react';

interface GatewayHubProps {
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const GatewayHub: React.FC<GatewayHubProps> = ({ addNotification }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCS' | 'SANDBOX'>('OVERVIEW');
    const [isSimulating, setIsSimulating] = useState(false);
    const [isTestingWebhooks, setIsTestingWebhooks] = useState(false);
    const [testLogs, setTestLogs] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const publicKey = "pk_live_af_829910283492";

    const handleCopy = () => {
        navigator.clipboard.writeText(publicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTestEndpoints = async () => {
        setIsTestingWebhooks(true);
        setTestLogs([]);
        
        const logLines = [
            ">> INITIALIZING WEBHOOK TEST SEQUENCE...",
            ">> RETRIEVING REGISTERED ENDPOINTS (1 FOUND)...",
            ">> DISPATCHING EVENT [charge.completed]...",
            ">> AWAITING HANDSHAKE FROM TARGET SERVER...",
            ">> RESPONSE RECEIVED: 200 OK (Latency: 142ms)",
            ">> VERIFYING SIGNATURE [X-Payflow-Signature]...",
            ">> TEST CYCLE COMPLETED: SUCCESS"
        ];

        for (let i = 0; i < logLines.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setTestLogs(prev => [...prev, logLines[i]]);
        }

        setIsTestingWebhooks(false);
        if (addNotification) {
            addNotification('Webhook Test Passed', 'Merchant server correctly acknowledged the test payload.', 'SUCCESS');
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Headless Gateway Hub" 
                subtitle="Enlist Payflow as your primary settlement rail without the dashboard overhead."
                breadcrumbs={['Workspace', 'Integration', 'Gateway Hub']}
                status="SYNCING"
            />

            <div className="flex border-b border-brand-100 mb-8 overflow-x-auto">
                {['OVERVIEW', 'DOCS', 'SANDBOX'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t as any)}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === t ? 'border-action-500 text-brand-900' : 'border-transparent text-brand-400 hover:text-brand-600'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Pane */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32" /></div>
                                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest mb-6">Your Gateway Identity</h3>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <label className="text-[10px] font-bold text-brand-500 uppercase mb-2 block">Public Integration Key</label>
                                        <div className="flex gap-2">
                                            <code className="flex-1 bg-brand-50 p-3 rounded-sm border border-brand-200 font-mono text-sm text-brand-900">{publicKey}</code>
                                            <button onClick={handleCopy} className="p-3 bg-brand-950 text-white rounded-sm hover:bg-black transition-colors">
                                                {copied ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                        <p className="text-xs text-emerald-800 font-medium">Headless Mesh is active. Your site is currently authorizing transactions via Lagos_Edge_04.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-brand-200 p-6 rounded-sm">
                                    <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">API Velocity</h4>
                                    <div className="flex items-end gap-2 h-20">
                                        {[4,6,8,5,9,10,7,8,6,5,4,3].map((h, i) => (
                                            <div key={i} className="flex-1 bg-action-500/20 rounded-t-sm border-t border-action-500" style={{ height: `${h * 10}%` }}></div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-brand-500 font-mono mt-4">AVG RESPONSE: 142ms</p>
                                </div>
                                <div className="bg-brand-950 p-6 rounded-sm border border-brand-900 relative">
                                    <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-4">Webhook Health</h4>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-brand-400">SUCCESS RATE</span>
                                            <span className="text-emerald-500">99.98%</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-mono">
                                            <span className="text-brand-400">DISPATCH LATENCY</span>
                                            <span className="text-white">12ms</span>
                                        </div>
                                    </div>

                                    {testLogs.length > 0 && (
                                        <div className="mb-6 p-3 bg-black border border-brand-800 rounded-sm font-mono text-[9px] text-action-500 space-y-1 h-32 overflow-y-auto animate-in fade-in">
                                            {testLogs.map((log, i) => (
                                                <p key={i} className={i === testLogs.length - 1 && isTestingWebhooks ? "animate-pulse" : ""}>{log}</p>
                                            ))}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleTestEndpoints}
                                        disabled={isTestingWebhooks}
                                        className="w-full py-2 bg-brand-900 text-white text-[9px] font-bold uppercase hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isTestingWebhooks ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3 text-action-500" />}
                                        {isTestingWebhooks ? 'Running Diagnostics...' : 'Test Endpoints'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'DOCS' && (
                        <div className="bg-brand-950 text-white rounded-sm p-8 font-mono text-sm space-y-8 animate-in fade-in duration-300 h-[600px] overflow-y-auto">
                            <section>
                                <h3 className="text-action-500 font-bold mb-4">// QUICK INTEGRATION</h3>
                                <p className="text-brand-400 mb-4 text-xs">Inject the Payflow mesh into any HTML environment.</p>
                                <div className="bg-black/50 p-4 border border-brand-800 rounded-sm">
                                    <code className="text-emerald-400">
                                        {`<script src="https://mesh.payflow.link/v3/init.js"></script>\n<button data-payflow-key="${publicKey}">\n  Pay Now\n</button>`}
                                    </code>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-action-500 font-bold mb-4">// SERVER-SIDE AUTH</h3>
                                <div className="bg-black/50 p-4 border border-brand-800 rounded-sm">
                                    <code className="text-blue-400">
                                        {`const session = await fetch('https://api.payflow.link/v1/sessions', {\n  method: 'POST',\n  headers: { 'Authorization': 'Bearer YOUR_SK' },\n  body: JSON.stringify({ amount: 5000, currency: 'NGN' })\n});`}
                                    </code>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'SANDBOX' && (
                        <div className="bg-white border border-brand-200 rounded-sm p-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300 min-h-[500px]">
                            <div className="w-full max-w-sm space-y-8">
                                <div className="text-center">
                                    <Smartphone className="w-12 h-12 mx-auto text-brand-200 mb-4" />
                                    <h3 className="text-lg font-bold text-brand-900">Headless Playground</h3>
                                    <p className="text-xs text-brand-500 mt-2">Simulate a customer clicking your white-labeled Payflow button.</p>
                                </div>

                                <div className="p-6 border-2 border-brand-100 rounded-sm hover:border-action-500 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <div className="bg-brand-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm group-hover:bg-action-500 transition-colors">
                                            White-Label Button
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-brand-200 group-hover:text-action-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-brand-100">
                                    <button 
                                        onClick={() => { setIsSimulating(true); setTimeout(() => setIsSimulating(false), 2000); }}
                                        className="w-full py-4 bg-brand-950 text-white rounded-sm font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
                                    >
                                        {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Play className="w-3 h-3 fill-current text-action-500" /> Start Emulation Session</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Metadata Rail */}
                <div className="space-y-6">
                    <div className="bg-brand-900 text-white p-6 rounded-sm">
                        <div className="flex items-center gap-2 mb-4 text-action-500">
                            <Lock className="w-4 h-4" />
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Security Manifest</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-brand-400 font-mono">TLS 1.3 enforced for all headless mesh connections.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-brand-400 font-mono">Automatic IP-rate limiting active for Public Keys.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border border-brand-100 bg-white rounded-sm">
                        <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-4">Platform Integration Tips</h4>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-brand-50 rounded-sm hover:bg-brand-100 transition-colors">
                                <span className="text-[10px] font-bold text-brand-700">Shopify Webhooks</span>
                                <ExternalLink className="w-3 h-3 text-brand-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-brand-50 rounded-sm hover:bg-brand-100 transition-colors">
                                <span className="text-[10px] font-bold text-brand-700">WooCommerce Mod</span>
                                <ExternalLink className="w-3 h-3 text-brand-400" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-brand-50 rounded-sm hover:bg-brand-100 transition-colors">
                                <span className="text-[10px] font-bold text-brand-700">React Hooks SDK</span>
                                <ExternalLink className="w-3 h-3 text-brand-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
