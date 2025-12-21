
import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from './PageHeader';
import { 
    Terminal, Code, Smartphone, Globe, Lock, ShieldCheck, Zap, Copy, ExternalLink, Play, Eye, 
    RefreshCw, FileCode, Braces, ArrowRight, Loader2, Activity, CheckCircle2, X, CreditCard, 
    ShieldAlert, Cpu, Database, Network, Key, Settings2, Trash2, Plus, Info, ChevronDown,
    Layers, Search, Filter, History, Send, Smartphone as Phone, Github, AlertTriangle, 
    BarChart3, Clock, Server, CloudLightning, Shield, Gauge, Power,
    EyeOff, Download, Sliders, Check, Bug
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GatewayHubProps {
    addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
}

export const GatewayHub: React.FC<GatewayHubProps> = ({ addNotification }) => {
    const [activeTab, setActiveTab] = useState<'IDENTITY' | 'OBSERVABILITY' | 'PLAYGROUND' | 'WEBHOOKS' | 'SDK' | 'GOVERNANCE'>('IDENTITY');
    const [isSimulating, setIsSimulating] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    // Section A: API Keys State
    const [showProdKey, setShowProdKey] = useState(false);
    const [prodKey, setProdKey] = useState("pk_live_8291028349234");
    const [testKey, setTestKey] = useState("pk_test_1234567890");

    // Section B: Monitoring State (Digital Real-time)
    const [liveRequests, setLiveRequests] = useState([
        { id: '1', time: '13:45:23', method: 'POST', path: '/v1/payments', status: 201, latency: '78ms', alert: false },
        { id: '2', time: '13:45:24', method: 'GET', path: '/v1/balance', status: 200, latency: '34ms', alert: false },
        { id: '3', time: '13:45:24', method: 'POST', path: '/v1/webhooks', status: 200, latency: '45ms', alert: false },
        { id: '4', time: '13:45:25', method: 'POST', path: '/v1/payments', status: 401, latency: '12ms', alert: true },
    ]);
    const [totalRequests, setTotalRequests] = useState(124582);

    useEffect(() => {
        const interval = setInterval(() => {
            const methods = ['GET', 'POST', 'PATCH', 'DELETE'];
            const paths = ['/v1/payments', '/v1/balance', '/v1/refunds', '/v1/customers', '/v1/fx/convert'];
            const statuses = [200, 201, 200, 401, 200, 500];
            const newReq = {
                id: Math.random().toString(),
                time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
                method: methods[Math.floor(Math.random() * methods.length)],
                path: paths[Math.floor(Math.random() * paths.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                latency: `${Math.floor(Math.random() * 200) + 20}ms`,
                alert: Math.random() > 0.8
            };
            setLiveRequests(prev => [newReq, ...prev].slice(0, 20));
            setTotalRequests(prev => prev + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const latencyData = [
        { name: '13:00', p50: 82, p90: 142, p99: 450 },
        { name: '13:10', p50: 89, p90: 156, p99: 480 },
        { name: '13:20', p50: 85, p90: 140, p99: 440 },
        { name: '13:30', p50: 92, p90: 168, p99: 510 },
        { name: '13:40', p50: 88, p90: 145, p99: 460 },
    ];

    // Section C: Playground State
    const [pgMethod, setPgMethod] = useState('POST');
    const [pgEndpoint, setPgEndpoint] = useState('/v1/payments');
    const [pgBody, setPgBody] = useState(JSON.stringify({
        amount: 50000,
        currency: "NGN",
        email: "customer@example.com",
        reference: `TXN_${Date.now()}`,
        callback_url: "https://mysite.com/webhook"
    }, null, 2));
    const [pgResponse, setPgResponse] = useState<any>(null);

    // Section D: Webhooks State
    const [webhookEvents, setWebhookEvents] = useState({
        'payment.success': true,
        'payment.failed': true,
        'refund.processed': true,
        'settlement.completed': true,
        'customer.created': false,
        'dispute.opened': false
    });
    const [resendingId, setResendingId] = useState<string | null>(null);

    // Section E: SDK Platform
    const [sdkPlatform, setSdkPlatform] = useState('Node.js');

    // Section F: Governance Toggles
    const [throttlingEnabled, setThrottlingEnabled] = useState(true);
    const [ddosEnabled, setDdosEnabled] = useState(true);
    const [geoEnabled, setGeoEnabled] = useState(false);

    // --- FUNCTIONAL HANDLERS ---

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
        if (addNotification) addNotification('Copied to Clipboard', 'The payload is ready for integration.', 'SUCCESS');
    };

    const runPgRequest = () => {
        setIsSimulating(true);
        setPgResponse(null);
        setTimeout(() => {
            setPgResponse({
                status: "success",
                data: {
                    payment_id: "pay_" + Math.random().toString(36).substr(2, 10),
                    status: "pending",
                    authorization_url: "https://checkout.payflow.os/auth/..."
                }
            });
            setIsSimulating(false);
            if (addNotification) addNotification('Request Successful', 'Simulator returned status 201.', 'SUCCESS');
        }, 1200);
    };

    const rotateKey = (type: 'live' | 'test') => {
        const newKey = `pk_${type}_${Math.random().toString(36).substr(2, 14)}`;
        if (type === 'live') setProdKey(newKey);
        else setTestKey(newKey);
        if (addNotification) addNotification('Credentials Rotated', `A new ${type} key has been provisioned. Old key revoked.`, 'WARNING');
    };

    const handleDownloadSample = () => {
        const content = "Payflow SDK Sample Project v1.0\nStructure:\n/src\n  /index.js\n/package.json";
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payflow_sdk_${sdkPlatform.toLowerCase()}_sample.zip`;
        a.click();
        if (addNotification) addNotification('Download Started', 'Sample project bundle dispatched.', 'INFO');
    };

    const handleResendWebhook = (id: string) => {
        setResendingId(id);
        setTimeout(() => {
            setResendingId(null);
            if (addNotification) addNotification('Webhook Re-sent', `Event ${id} was successfully re-dispatched to endpoint.`, 'SUCCESS');
        }, 1500);
    };

    const handleUpgrade = () => {
        if (addNotification) addNotification('Enterprise Access', 'Contact your strategic manager to increase global caps.', 'INFO');
    };

    const openCodeSandbox = () => {
        window.open('https://codesandbox.io/s/payflow-sdk-demo-q2z9w', '_blank');
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <PageHeader 
                title="Gateway Hub" 
                subtitle="The developer control plane for institutional-grade payment orchestration."
                breadcrumbs={['Workspace', 'Infrastructure', 'Gateway Hub']}
                status="LIVE"
                actions={
                    <div className="flex gap-2">
                        <button onClick={() => window.open('https://github.com/payflow-os/sdk', '_blank')} className="bg-white border border-brand-200 px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:border-brand-900 transition-all shadow-sm">
                            <Github className="w-3.5 h-3.5" /> SDK Source
                        </button>
                        <button onClick={() => handleCopy('https://api.payflow.os/v1/spec.json', 'spec')} className="bg-brand-950 text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-xl">
                            <Braces className="w-3.5 h-3.5 text-action-500" /> {copied === 'spec' ? 'Copied' : 'API Spec'}
                        </button>
                    </div>
                }
            />

            <div className="flex border-b border-brand-100 overflow-x-auto scrollbar-hide bg-white p-1 rounded-sm shadow-sm">
                {[
                    { id: 'IDENTITY', label: 'API Management', icon: Key },
                    { id: 'OBSERVABILITY', label: 'Monitoring', icon: Activity },
                    { id: 'PLAYGROUND', label: 'Playground', icon: Terminal },
                    { id: 'WEBHOOKS', label: 'Webhooks', icon: CloudLightning },
                    { id: 'SDK', label: 'SDK & Guides', icon: Code },
                    { id: 'GOVERNANCE', label: 'Rate Limits', icon: Shield },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === t.id ? 'border-action-500 text-brand-900 bg-brand-50/50' : 'border-transparent text-brand-400 hover:text-brand-600 hover:bg-brand-50/30'}`}
                    >
                        <t.icon className={`w-3.5 h-3.5 ${activeTab === t.id ? 'text-action-500' : 'text-brand-300'}`} />
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                
                {activeTab === 'IDENTITY' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-white border border-brand-200 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-3.5 h-3.5 text-brand-400" /> Production Credentials
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => rotateKey('live')} className="text-[9px] font-bold text-brand-500 hover:text-brand-900 uppercase tracking-widest flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Auto-Rotate</button>
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="bg-brand-50 border border-brand-100 p-6 rounded-sm relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Production Secret Key</p>
                                            <div className="flex items-center gap-4">
                                                <code className="text-sm font-mono font-bold text-brand-900">
                                                    {showProdKey ? prodKey : 'pk_live_••••••••••••••••••••'}
                                                </code>
                                                <button onClick={() => setShowProdKey(!showProdKey)} className="text-brand-400 hover:text-brand-900 transition-colors">
                                                    {showProdKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleCopy(prodKey, 'prod')} className="text-brand-400 hover:text-brand-900 transition-colors">
                                                    {copied === 'prod' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-sm">ACTIVE</span>
                                            <p className="text-[8px] text-brand-400 mt-1 font-mono uppercase">Last Used: 2 Mins Ago</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-brand-200">
                                        <div>
                                            <p className="text-[8px] font-bold text-brand-400 uppercase mb-1">Permissions</p>
                                            <span className="text-[10px] font-bold text-brand-700">Full Access</span>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-brand-400 uppercase mb-1">Rate Limit</p>
                                            <span className="text-[10px] font-bold text-brand-700">10,000/hr (3% used)</span>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[8px] font-bold text-brand-400 uppercase mb-1">IP Whitelist</p>
                                            <span className="text-[10px] font-mono text-brand-500">203.45.67.*, 10.0.1.0/24</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-2">
                                        <button onClick={() => rotateKey('live')} className="px-4 py-1.5 bg-brand-950 text-white text-[10px] font-bold uppercase rounded-sm hover:bg-black transition-all">Rotate Key</button>
                                        <button onClick={() => setActiveTab('OBSERVABILITY')} className="px-4 py-1.5 bg-white border border-brand-200 text-brand-600 text-[10px] font-bold uppercase rounded-sm hover:bg-brand-50 transition-all">View Usage</button>
                                        <button className="ml-auto p-1.5 text-brand-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="bg-white border border-brand-100 p-6 rounded-sm opacity-60 hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Sandbox Test Key</p>
                                    <div className="flex items-center gap-4">
                                        <code className="text-sm font-mono font-bold text-brand-900">{testKey}</code>
                                        <button onClick={() => handleCopy(testKey, 'test')} className="text-brand-400 hover:text-brand-900 transition-colors">
                                            {copied === 'test' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                        <span className="ml-auto text-[9px] font-bold bg-brand-50 text-brand-500 border border-brand-100 px-2 py-0.5 rounded-sm uppercase tracking-widest">Test Only</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'OBSERVABILITY' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Requests (24h)', val: totalRequests.toLocaleString(), change: '+12%', color: 'text-brand-900', glow: true },
                                { label: 'Success Rate', val: '99.94%', change: 'Stable', color: 'text-emerald-600', glow: false },
                                { label: 'Avg Latency', val: '142ms', change: '-4ms', color: 'text-brand-900', glow: false },
                                { label: 'Error Rate', val: '0.06%', change: '75 total', color: 'text-rose-600', glow: false },
                            ].map(s => (
                                <div key={s.label} className="bg-white p-5 border border-brand-100 rounded-sm shadow-sm relative overflow-hidden group">
                                    {s.glow && <div className="absolute inset-0 bg-action-500/5 animate-pulse pointer-events-none"></div>}
                                    <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.val}</p>
                                    <p className="text-[8px] font-bold text-brand-300 mt-2 uppercase tracking-tighter">{s.change}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-brand-100 rounded-sm overflow-hidden shadow-sm">
                                    <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                                        <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                            <Gauge className="w-4 h-4 text-brand-400" /> Endpoint Performance
                                        </h3>
                                        <button className="text-[9px] font-bold text-action-500 uppercase hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-[11px] font-mono">
                                            <thead className="bg-brand-50/50 text-brand-400 uppercase font-bold border-b border-brand-100">
                                                <tr>
                                                    <th className="px-6 py-3">Endpoint</th>
                                                    <th className="px-6 py-3 text-right">Req/s</th>
                                                    <th className="px-6 py-3 text-right">Latency</th>
                                                    <th className="px-6 py-3 text-right">Errors</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-brand-50">
                                                {[
                                                    { path: 'POST /v1/payments', req: '45', lat: '78ms', err: '0.01%', color: 'text-emerald-500' },
                                                    { path: 'GET  /v1/balance', req: '23', lat: '34ms', err: '0.00%', color: 'text-emerald-500' },
                                                    { path: 'POST /v1/refunds', req: '8', lat: '156ms', err: '0.12%', color: 'text-amber-500' },
                                                    { path: 'GET  /v1/webhooks', req: '12', lat: '45ms', err: '0.00%', color: 'text-emerald-500' },
                                                    { path: 'POST /v1/fx/convert', req: '18', lat: '234ms', err: '0.08%', color: 'text-emerald-500' },
                                                ].map(e => (
                                                    <tr key={e.path} className="hover:bg-brand-50 transition-all group">
                                                        <td className="px-6 py-4 font-bold text-brand-900">{e.path}</td>
                                                        <td className="px-6 py-4 text-right text-brand-500">{e.req}</td>
                                                        <td className="px-6 py-4 text-right text-brand-900 font-bold">{e.lat}</td>
                                                        <td className={`px-6 py-4 text-right font-bold ${e.color}`}>{e.err}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-brand-950 p-6 rounded-sm border border-brand-900 shadow-xl">
                                    <h3 className="text-[10px] font-bold text-action-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Latency Distribution (p50/p90/p99)
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={latencyData}>
                                                <defs>
                                                    <linearGradient id="p50" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                                                <Tooltip contentStyle={{ background: '#020617', border: 'none', color: '#fff', fontSize: '10px' }} />
                                                <Area type="monotone" dataKey="p50" stroke="#f97316" fillOpacity={1} fill="url(#p50)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="p90" stroke="#64748b" fill="transparent" strokeWidth={1} strokeDasharray="4 4" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-brand-950 rounded-sm border border-brand-900 shadow-xl overflow-hidden flex flex-col h-[650px] relative">
                                    <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center z-10">
                                        <div className="flex items-center gap-2 text-action-500">
                                            <CloudLightning className="w-4 h-4 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Request Stream</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide font-mono">
                                        {liveRequests.map((req, i) => (
                                            <div key={req.id} className={`flex justify-between items-center text-[10px] p-2 hover:bg-white/5 rounded-sm transition-all animate-in slide-in-from-top-1 duration-500 ${i === 0 ? 'bg-white/5 shadow-[0_0_10px_rgba(249,115,22,0.1)] border-l-2 border-action-500' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-brand-600">{req.time}</span>
                                                    <span className="text-action-500 font-bold">{req.method}</span>
                                                    <span className="text-brand-100 truncate max-w-[100px]">{req.path}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={req.status < 400 ? 'text-emerald-500' : 'text-rose-500'}>{req.status}</span>
                                                    <span className="text-brand-700 text-[8px]">{req.latency}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-black/60 border-t border-brand-900 text-[8px] text-brand-600 font-bold text-center uppercase tracking-widest">
                                        Node_Lagos_Edge_04 // Active_Uplink_Established
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'PLAYGROUND' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-300">
                        <div className="bg-white border border-brand-200 rounded-sm shadow-sm flex flex-col">
                            <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-action-500" /> Request Console
                                </h3>
                            </div>
                            <div className="p-6 space-y-6 flex-1">
                                <div className="flex gap-4">
                                    <div className="w-32">
                                        <label className="text-[10px] font-bold text-brand-400 uppercase mb-2 block tracking-widest">Method</label>
                                        <select 
                                            value={pgMethod} 
                                            onChange={e => setPgMethod(e.target.value)}
                                            className="w-full bg-brand-50 border border-brand-200 p-2.5 rounded-sm font-bold text-xs outline-none focus:border-action-500"
                                        >
                                            <option>GET</option>
                                            <option>POST</option>
                                            <option>PUT</option>
                                            <option>PATCH</option>
                                            <option>DELETE</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold text-brand-400 uppercase mb-2 block tracking-widest">Endpoint</label>
                                        <div className="flex bg-brand-50 border border-brand-200 rounded-sm group focus-within:border-action-500 transition-all">
                                            <span className="p-2.5 text-xs text-brand-400 font-mono select-none">/v1</span>
                                            <input 
                                                value={pgEndpoint} 
                                                onChange={e => setPgEndpoint(e.target.value)}
                                                className="bg-transparent flex-1 p-2.5 text-xs font-mono outline-none text-brand-900" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Request Body (JSON)</label>
                                    </div>
                                    <div className="bg-brand-950 p-4 rounded-sm border border-brand-800 focus-within:border-action-500 transition-colors">
                                        <textarea 
                                            value={pgBody}
                                            onChange={e => setPgBody(e.target.value)}
                                            className="w-full h-48 bg-transparent text-action-500 font-mono text-xs outline-none resize-none selection:bg-action-500/30"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={runPgRequest}
                                    disabled={isSimulating}
                                    className="w-full py-4 bg-action-500 text-white rounded-sm font-black uppercase text-[11px] tracking-[0.4em] shadow-xl hover:bg-action-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                >
                                    {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Execute Session</>}
                                </button>
                            </div>
                        </div>

                        <div className="bg-brand-950 border border-brand-900 rounded-sm shadow-xl flex flex-col h-full min-h-[500px]">
                            <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> System Response
                                </h3>
                                {pgResponse && (
                                    <div className="flex items-center gap-4 text-[9px] font-mono">
                                        <span className="text-emerald-500 font-bold">201 CREATED</span>
                                        <span className="text-brand-600">234ms</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-6 font-mono text-xs overflow-y-auto relative">
                                {isSimulating && (
                                    <div className="space-y-2 text-action-500 animate-pulse">
                                        <p>&gt;&gt; Negotiating HSM Enclave Handshake...</p>
                                        <p>&gt;&gt; Validating Economic Model Coefficients...</p>
                                        <p>&gt;&gt; Committing Transaction to Regional Ledger...</p>
                                    </div>
                                )}
                                {pgResponse && !isSimulating && (
                                    <div className="animate-in fade-in duration-300">
                                        <pre className="text-emerald-400 whitespace-pre-wrap">{JSON.stringify(pgResponse, null, 2)}</pre>
                                        <div className="mt-8 pt-8 border-t border-brand-900 flex flex-wrap gap-2">
                                            <button onClick={() => handleCopy(`curl -X POST https://api.payflow.link/v1${pgEndpoint} -H "Authorization: Bearer pk_live_..."`, 'curl')} className="px-3 py-1.5 border border-brand-800 text-brand-500 text-[9px] font-bold uppercase rounded-sm hover:text-white transition-colors">
                                                {copied === 'curl' ? 'Copied' : 'Copy cURL'}
                                            </button>
                                            <button onClick={() => handleCopy(`const payment = await payflow.payments.create({...})`, 'node')} className="px-3 py-1.5 border border-brand-800 text-brand-500 text-[9px] font-bold uppercase rounded-sm hover:text-white transition-colors">
                                                {copied === 'node' ? 'Copied' : 'Copy Node.js'}
                                            </button>
                                            <button onClick={() => handleCopy(`payment = payflow.payments.create(...)`, 'python')} className="px-3 py-1.5 border border-brand-800 text-brand-500 text-[9px] font-bold uppercase rounded-sm hover:text-white transition-colors">
                                                {copied === 'python' ? 'Copied' : 'Copy Python'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {!pgResponse && !isSimulating && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <Terminal className="w-12 h-12 mb-4 text-brand-500" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Command...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'WEBHOOKS' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white border border-brand-200 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-4 bg-brand-50 border-b border-brand-100 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                    <CloudLightning className="w-4 h-4 text-brand-400" /> Active Webhook Endpoints
                                </h3>
                                <button className="bg-brand-950 text-white px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-black transition-all">
                                    <Plus className="w-3 h-3" /> Add Endpoint
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="bg-brand-50 border border-brand-200 p-6 rounded-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-sm font-mono font-bold text-brand-900">https://mysite.com/api/payflow/webhook</h4>
                                            <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-1">Status: 🟢 Healthy | Success Rate: 99.8%</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 border border-brand-200 rounded-sm hover:bg-brand-100 transition-all"><RefreshCw className="w-3.5 h-3.5 text-brand-500" /></button>
                                            <button className="p-2 border border-brand-200 rounded-sm hover:bg-brand-100 transition-all"><Settings2 className="w-3.5 h-3.5 text-brand-500" /></button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">Event Subscriptions</p>
                                            {Object.entries(webhookEvents).map(([evt, active]) => (
                                                <label key={evt} className="flex items-center gap-3 cursor-pointer group">
                                                    <div 
                                                        onClick={() => setWebhookEvents(prev => ({...prev, [evt]: !active}))}
                                                        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${active ? 'bg-action-500 border-action-500' : 'bg-white border-brand-200 group-hover:border-brand-400'}`}
                                                    >
                                                        {active && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className={`text-xs font-mono font-bold ${active ? 'text-brand-900' : 'text-brand-400'}`}>{evt}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">Security Protocol</p>
                                            <div className="p-3 bg-white border border-brand-100 rounded-sm flex justify-between items-center">
                                                <div>
                                                    <p className="text-[10px] font-bold text-brand-900 uppercase">HMAC Signature Secret</p>
                                                    <code className="text-[9px] text-brand-500">wh_sec_K9s...</code>
                                                </div>
                                                <button onClick={() => rotateKey('test')} className="text-[9px] font-bold text-action-500 uppercase hover:underline">Rotate</button>
                                            </div>
                                            <div className="p-3 bg-white border border-brand-100 rounded-sm">
                                                <p className="text-[10px] font-bold text-brand-900 uppercase">Static IP Whitelist</p>
                                                <code className="text-[9px] text-brand-500">203.45.67.89</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-950 border border-brand-900 rounded-sm shadow-xl overflow-hidden">
                            <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-action-500 uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4" /> Webhook Debugger Ledger
                                </h3>
                            </div>
                            <div className="divide-y divide-brand-900/50 max-h-[400px] overflow-y-auto scrollbar-hide">
                                {[
                                    { time: '13:45:23', event: 'payment.success', status: 200, latency: '145ms', id: 'evt_abc123' },
                                    { time: '13:42:15', event: 'refund.processed', status: 200, latency: '98ms', id: 'evt_xyz789' },
                                    { time: '13:40:08', event: 'payment.failed', status: 500, latency: '12ms', id: 'evt_def456', alert: true },
                                ].map(evt => (
                                    <div key={evt.id} className="p-4 hover:bg-white/5 transition-all group flex justify-between items-center">
                                        <div className="flex gap-6 items-center">
                                            <span className="text-[10px] font-mono text-brand-600">{evt.time}</span>
                                            <span className="text-[11px] font-bold text-brand-100 uppercase">{evt.event}</span>
                                            <span className={`text-[10px] font-mono font-bold ${evt.status < 400 ? 'text-emerald-500' : 'text-rose-500'}`}>{evt.status}</span>
                                            <span className="text-[9px] text-brand-700">{evt.latency}</span>
                                            {evt.alert && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                                        </div>
                                        <button 
                                            onClick={() => handleResendWebhook(evt.id)}
                                            disabled={resendingId === evt.id}
                                            className="text-[9px] font-bold text-brand-500 hover:text-white uppercase px-3 py-1 border border-brand-800 rounded-sm opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
                                        >
                                            {resendingId === evt.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                            {resendingId === evt.id ? 'Re-dispatching...' : 'Resend'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'SDK' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
                        <div className="bg-white border border-brand-200 rounded-sm p-10 shadow-sm text-center">
                            <h3 className="text-2xl font-black text-brand-900 uppercase tracking-tighter mb-10 italic">Platform Integration Center</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Node.js', 'Python', 'PHP', 'Ruby', 'C#', 'Java', 'Go'].map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setSdkPlatform(p)}
                                        className={`px-8 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest border transition-all ${sdkPlatform === p ? 'bg-brand-950 text-white border-brand-950 shadow-xl' : 'bg-brand-50 text-brand-400 hover:border-brand-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-brand-950 rounded-sm border border-brand-900 shadow-2xl overflow-hidden">
                            <div className="p-4 bg-black/40 border-b border-brand-900 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-brand-900 rounded-sm flex items-center justify-center text-action-500 font-bold border border-brand-800">
                                        {sdkPlatform === 'Node.js' ? 'JS' : sdkPlatform.slice(0, 2).toUpperCase()}
                                    </div>
                                    <h4 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">{sdkPlatform} Core Integration</h4>
                                </div>
                                <button className="text-[9px] font-bold text-brand-600 hover:text-white uppercase flex items-center gap-2"><ExternalLink className="w-3 h-3" /> Technical Docs</button>
                            </div>
                            <div className="p-10 space-y-10">
                                <section className="space-y-4">
                                    <p className="text-[10px] font-bold text-action-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-action-500"></div> 1. Install Protocol Wrapper
                                    </p>
                                    <div className="bg-black/50 p-4 rounded-sm border border-brand-800 relative group">
                                        <code className="text-emerald-400 font-mono text-xs">npm install @payflow/node-sdk</code>
                                        <button onClick={() => handleCopy('npm install @payflow/node-sdk', 'inst')} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                                            {copied === 'inst' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </section>
                                <section className="space-y-4">
                                    <p className="text-[10px] font-bold text-action-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-action-500"></div> 2. Construct Handshake
                                    </p>
                                    <div className="bg-black/50 p-6 rounded-sm border border-brand-800 font-mono text-xs text-brand-300">
                                        <p><span className="text-action-500">const</span> Payflow = <span className="text-emerald-500">require</span>(<span className="text-amber-500">'@payflow/node-sdk'</span>);</p>
                                        <p><span className="text-action-500">const</span> payflow = <span className="text-action-500">new</span> Payflow({'{'}</p>
                                        <p className="pl-6">apiKey: <span className="text-amber-500">'pk_live_829910283492'</span></p>
                                        <p>{'}'});</p>
                                    </div>
                                </section>
                            </div>
                            <div className="p-6 bg-black/40 border-t border-brand-900 flex gap-4">
                                <button onClick={openCodeSandbox} className="flex-1 py-3 bg-brand-900 border border-brand-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-2">
                                    <ExternalLink className="w-3.5 h-3.5 text-action-500" /> Open in CodeSandbox
                                </button>
                                <button onClick={handleDownloadSample} className="flex-1 py-3 bg-brand-900 border border-brand-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-800 transition-all flex items-center justify-center gap-2">
                                    <Download className="w-3.5 h-3.5 text-action-500" /> Download Sample Project
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'GOVERNANCE' && (
                    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-7 space-y-6">
                                <div className="bg-white border border-brand-200 rounded-sm p-8 shadow-sm">
                                    <div className="flex justify-between items-start mb-10">
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-900 uppercase tracking-tighter">Global Usage Quota</h3>
                                            <p className="text-[10px] text-brand-500 font-mono mt-1 uppercase tracking-widest">Plan: Enterprise v4.1</p>
                                        </div>
                                        <button onClick={handleUpgrade} className="px-5 py-2 bg-brand-950 text-white text-[10px] font-bold uppercase rounded-sm hover:bg-black transition-all shadow-md">Upgrade Plan</button>
                                    </div>
                                    <div className="space-y-12">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[11px] font-bold text-brand-700 uppercase">
                                                <span>Hourly Request Limit</span>
                                                <span className="font-mono text-brand-900">342 / 10,000 used</span>
                                            </div>
                                            <div className="h-2 w-full bg-brand-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-action-500 animate-pulse" style={{ width: '3.4%' }}></div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-100">
                                            <div>
                                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Rate / Min</p>
                                                <p className="text-3xl font-mono font-bold text-brand-950">200</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">Burst Cap</p>
                                                <p className="text-3xl font-mono font-bold text-brand-950">50</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-6">
                                <div className="bg-brand-950 text-white rounded-sm p-8 border border-brand-800 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Shield className="w-32 h-32" /></div>
                                    <div className="flex items-center gap-3 text-action-500 mb-8 border-b border-brand-900 pb-4">
                                        <Zap className="w-5 h-5 fill-current" />
                                        <h3 className="text-xs font-bold uppercase tracking-widest">Intelligent Safeguards</h3>
                                    </div>
                                    <div className="space-y-6 relative z-10">
                                        <div 
                                            onClick={() => setThrottlingEnabled(!throttlingEnabled)}
                                            className={`p-4 border rounded-sm transition-all cursor-pointer ${throttlingEnabled ? 'bg-action-500/10 border-action-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'bg-brand-900 border-brand-800 grayscale'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[11px] font-bold uppercase">AI Auto-Throttling</span>
                                                {throttlingEnabled ? <CheckCircle2 className="w-4 h-4 text-action-500" /> : <Power className="w-4 h-4 text-brand-600" />}
                                            </div>
                                            <p className="text-[9px] text-brand-500 uppercase tracking-widest">Adaptive Latency Mitigation</p>
                                        </div>
                                        <div 
                                            onClick={() => setDdosEnabled(!ddosEnabled)}
                                            className={`p-4 border rounded-sm transition-all cursor-pointer ${ddosEnabled ? 'bg-blue-500/10 border-blue-500/30' : 'bg-brand-900 border-brand-800 grayscale'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[11px] font-bold uppercase">DDoS Protection</span>
                                                {ddosEnabled ? <CloudLightning className="w-4 h-4 text-blue-500" /> : <Power className="w-4 h-4 text-brand-600" />}
                                            </div>
                                            <p className="text-[9px] text-brand-500 uppercase tracking-widest">Cloudflare Node Mirroring</p>
                                        </div>
                                        <div 
                                            onClick={() => setGeoEnabled(!geoEnabled)}
                                            className={`p-4 border rounded-sm transition-all cursor-pointer ${geoEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-brand-900 border-brand-800 grayscale'}`}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[11px] font-bold uppercase">Geographic Barrier</span>
                                                {geoEnabled ? <Globe className="w-4 h-4 text-emerald-500" /> : <Power className="w-4 h-4 text-brand-600" />}
                                            </div>
                                            <p className="text-[9px] text-brand-500 uppercase tracking-widest">Region-Based Traffic Isolators</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
