
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { WebhookEvent } from '../types';
import { Copy, Eye, EyeOff, RefreshCw, Terminal, Globe, Shield, Plus, X, Zap, CheckCircle, Activity, Box, ArrowRight, ShieldCheck } from 'lucide-react';

interface DevelopersProps {
  addNotification?: (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => void;
  webhookEvents?: WebhookEvent[];
}

export const Developers: React.FC<DevelopersProps> = ({ addNotification, webhookEvents = [] }) => {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk_live_9928349238492384');
  const [isRolling, setIsRolling] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhooks, setWebhooks] = useState([
      { id: '1', url: 'https://api.myapp.com/webhooks', status: 'Active', events: 'charge.completed, charge.failed' }
  ]);

  const handleRollKey = () => {
      setIsRolling(true);
      setTimeout(() => {
          setApiKey(`sk_live_${Math.random().toString(36).substr(2, 16)}`);
          setIsRolling(false);
          if (addNotification) addNotification('API Key Rolled', 'Old key revoked. Update your environment variables.', 'WARNING');
      }, 1500);
  };

  const handleTestWebhook = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      if (addNotification) addNotification('Manual Webhook Sent', 'Test event [charge.success] dispatched.', 'SUCCESS');
    }, 2000);
  };

  const handleAddWebhook = () => {
      if (!webhookUrl) return;
      setWebhooks([...webhooks, { id: Date.now().toString(), url: webhookUrl, status: 'Active', events: 'all.events' }]);
      setWebhookUrl('');
      setIsAddingWebhook(false);
      if (addNotification) addNotification('Endpoint Registered', 'Active and listening for events.', 'SUCCESS');
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Developer Console" 
        subtitle="Manage credentials and real-time reconciliation hooks."
        breadcrumbs={['Workspace', 'Developers', 'Infrastructure']}
        status="LIVE"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys Section */}
        <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-4 h-4 text-brand-900" />
            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest">Authentication Keys</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono font-bold text-brand-500 mb-1 uppercase tracking-widest">Live Publishable Key</label>
              <div className="flex gap-2">
                <code className="flex-1 bg-brand-50 px-3 py-2 rounded-sm border border-brand-200 text-xs font-mono text-brand-900 truncate">
                  pk_live_51Msz7aG0O3hG234x
                </code>
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText('pk_live_51Msz7aG0O3hG234x');
                        if(addNotification) addNotification('Copied', 'Public Key copied to clipboard.', 'INFO');
                    }}
                    className="p-2 hover:bg-brand-100 rounded-sm text-brand-400 transition-all border border-transparent"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-brand-500 mb-1 uppercase tracking-widest">Live Secret Key</label>
              <div className="flex gap-2">
                <code className="flex-1 bg-brand-50 px-3 py-2 rounded-sm border border-brand-200 text-xs font-mono text-brand-900 flex items-center justify-between">
                  <span>{showKey ? apiKey : 'sk_live_••••••••••••••••'}</span>
                </code>
                <button onClick={() => setShowKey(!showKey)} className="p-2 hover:bg-brand-100 rounded-sm text-brand-400">
                  {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button 
                    onClick={() => {
                        navigator.clipboard.writeText(apiKey);
                        if(addNotification) addNotification('Copied', 'Secret Key copied. Store it securely.', 'WARNING');
                    }}
                    className="p-2 hover:bg-brand-100 rounded-sm text-brand-400"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-[9px] text-action-600 bg-action-50 inline-flex px-2 py-1 rounded-sm border border-action-100 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> RESTRICTED ACCESS REQUIRED
              </div>
            </div>
            
             <button 
                onClick={handleRollKey}
                disabled={isRolling}
                className="text-[10px] text-brand-500 hover:text-brand-900 font-bold uppercase flex items-center gap-2 mt-4 pt-4 border-t border-brand-100 w-full transition-colors disabled:opacity-50"
             >
              <RefreshCw className={`w-3 h-3 ${isRolling ? 'animate-spin' : ''}`} /> 
              {isRolling ? 'Rotating Keyring...' : 'Roll Secret Credentials'}
            </button>
          </div>
        </div>

        {/* Webhooks Section */}
        <div className="bg-white p-6 rounded-sm border border-brand-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <Globe className="w-4 h-4 text-brand-900" />
               <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest">Event Webhooks</h3>
            </div>
            <button 
              onClick={handleTestWebhook}
              disabled={isSimulating}
              className="px-3 py-1 bg-brand-900 text-white rounded-sm text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-brand-800 transition-colors"
            >
              {isSimulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-action-500" />}
              Send Test Event
            </button>
          </div>

          <div className="space-y-4">
            {webhooks.map(hook => (
                <div key={hook.id} className="p-3 bg-brand-50 border border-brand-100 rounded-sm flex items-start gap-4 relative group">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 animate-pulse"></div>
                    <div className="flex-1">
                        <p className="text-xs font-mono font-bold text-brand-900 truncate">{hook.url}</p>
                        <p className="text-[9px] text-brand-400 uppercase mt-0.5 font-bold tracking-[0.1em]">Target: HTTPS/POST • State: Operational</p>
                    </div>
                    <button className="text-[9px] font-bold text-brand-500 hover:text-brand-900 uppercase tracking-widest transition-colors">Details</button>
                </div>
            ))}

             {isAddingWebhook ? (
                 <div className="p-4 bg-brand-50 border border-brand-200 rounded-sm animate-in fade-in slide-in-from-top-1">
                     <div className="flex gap-2 mb-3">
                         <input 
                            type="text" 
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border border-brand-200 rounded-sm outline-none font-mono" 
                            placeholder="https://your-server.com/hooks" 
                         />
                     </div>
                     <div className="flex gap-2">
                         <button onClick={handleAddWebhook} className="bg-brand-900 text-white px-4 py-1.5 text-[10px] font-bold uppercase rounded-sm hover:bg-black">Deploy Endpoint</button>
                         <button onClick={() => setIsAddingWebhook(false)} className="bg-white border border-brand-200 text-brand-600 px-4 py-1.5 text-[10px] font-bold uppercase rounded-sm hover:bg-brand-100">Cancel</button>
                     </div>
                 </div>
             ) : (
                <div className="p-3 bg-brand-50 border border-brand-200 border-dashed rounded-sm flex items-center justify-center">
                    <button 
                        onClick={() => setIsAddingWebhook(true)}
                        className="text-[10px] text-brand-500 font-bold hover:text-brand-900 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-3 h-3" /> Connect New Webhook
                    </button>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Real-time Event Stream */}
      <div className="bg-brand-950 rounded-sm overflow-hidden text-brand-300 font-mono text-xs border border-brand-900 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-brand-900 bg-brand-900/50">
           <span className="font-bold text-white uppercase tracking-widest text-[10px] flex items-center gap-2">
             <Activity className="w-3 h-3 text-action-500" /> System Telemetry: Live Webhook Dispatch Stream
           </span>
           <div className="flex gap-3 text-[9px] font-bold text-brand-500 uppercase">
             <span>Lagos_Edge_04</span>
             <span className="text-brand-700">|</span>
             <span>AES-256 Enabled</span>
           </div>
        </div>
        <div className="p-4 space-y-3 h-64 overflow-y-auto scrollbar-hide">
          {(isSimulating || (webhookEvents.length === 0)) && (
            <div className={`flex gap-4 border-b border-brand-800/30 pb-3 ${isSimulating ? 'animate-pulse' : 'opacity-30'}`}>
                <span className="text-action-500 font-bold">READY</span>
                <span className="text-brand-400">awaiting_activity</span>
                <span className="text-brand-600 ml-auto">0ms</span>
            </div>
          )}
          
          {webhookEvents.map((event) => (
            <div key={event.id} className="flex flex-col gap-2 border-b border-brand-800/50 pb-3 animate-in slide-in-from-left-2">
                <div className="flex gap-4 items-center">
                    <span className="text-emerald-500 font-bold text-[10px]">200_OK</span>
                    <span className="text-white font-bold uppercase text-[10px]">{event.type}</span>
                    <span className="text-brand-500 text-[9px]">{event.id}</span>
                    <span className="text-brand-600 ml-auto text-[9px]">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="bg-black/40 p-2 rounded-sm text-brand-500 text-[9px] overflow-x-auto">
                    {JSON.stringify(event.payload)}
                </div>
                <div className="flex items-center gap-2 text-[8px] text-brand-600">
                    <ArrowRight className="w-2 h-2" /> DISPATCHED TO {event.targetUrl}
                </div>
            </div>
          ))}
          
          <div className="flex gap-4 opacity-50">
            <span className="text-brand-600">--</span>
            <span className="text-brand-500 uppercase">DEBUG</span>
            <span className="text-brand-400">Oracle heartbeat synchronized across 4 nodes.</span>
            <span className="text-brand-600 ml-auto">just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
