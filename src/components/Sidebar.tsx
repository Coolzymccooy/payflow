
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, Sparkles, LogOut, Wallet, Settings, ShieldAlert, Code, Lock, Handshake, Package, Users, CreditCard, UserCog, ShieldCheck, Zap, HelpCircle, ArrowRightLeft, Coins, BrainCircuit, Scan, Terminal, Shield, Activity, Cpu, Database, Crown, User, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { ViewState, Role, Umbrella, Entitlement } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  userRole: Role;
  activeUmbrella: Umbrella;
  onLogout: () => void;
  onGoHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen, userRole, activeUmbrella, onLogout, onGoHome }) => {
  const [telemetry, setTelemetry] = useState({ cpu: 12, mem: 42, latency: 14 });

  useEffect(() => {
    const interval = setInterval(() => {
        setTelemetry({
            cpu: Math.floor(Math.random() * 15) + 5,
            mem: Math.floor(Math.random() * 10) + 35,
            latency: Math.floor(Math.random() * 20) + 8
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'FINANCE', 'HR', 'DEVELOPER', 'VIEWER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.REPORTING, label: 'Reporting & AI', icon: BarChart3, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.REMITTANCE_HUB, label: 'Remittance Hub', icon: Globe, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.LP_HUB, label: 'Strategic Exit Hub', icon: Crown, roles: ['ADMIN'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.AI_TRADE_TERMINAL, label: 'AI Trade Terminal', icon: TrendingUp, roles: ['ADMIN', 'FINANCE'], entitlement: 'TREASURY_MGMT' as Entitlement },
    { id: ViewState.GATEWAY_HUB, label: 'Gateway Hub', icon: Terminal, roles: ['ADMIN', 'DEVELOPER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.COMPLIANCE_SENTINEL, label: 'Compliance Hub', icon: Shield, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.FX_EXCHANGE, label: 'FX & Remittance', icon: ArrowRightLeft, roles: ['ADMIN', 'FINANCE'], entitlement: 'TREASURY_MGMT' as Entitlement },
    { id: ViewState.BRIDGE, label: 'Web3 Bridge', icon: Coins, roles: ['ADMIN', 'FINANCE'], entitlement: 'WEB3_BRIDGE' as Entitlement },
    { id: ViewState.VELOCITY_SETTLEMENT, label: 'Velocity (T+0)', icon: Zap, roles: ['ADMIN', 'FINANCE'], entitlement: 'VELOCITY_PAYOUTS' as Entitlement },
    { id: ViewState.LIQUIDITY_SENTINEL, label: 'Liquidity Sentinel', icon: BrainCircuit, roles: ['ADMIN', 'FINANCE'], entitlement: 'AI_SENTINEL' as Entitlement },
    { id: ViewState.LIVE_POS, label: 'Live Register', icon: Scan, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.TRANSACTIONS, label: 'Transactions', icon: Receipt, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.COLLECTIONS, label: 'Revenue Streams', icon: Package, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.GATEWAY_AI, label: 'Gateway AI', icon: Zap, roles: ['ADMIN', 'DEVELOPER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.PAYROLL, label: 'Payroll Easy', icon: Users, roles: ['ADMIN', 'HR'], entitlement: 'PAYROLL_AUTO' as Entitlement }, 
    { id: ViewState.EMPLOYEE_PORTAL, label: 'Employee View', icon: User, roles: ['ADMIN', 'HR'], entitlement: 'PAYROLL_AUTO' as Entitlement }, 
    { id: ViewState.CARDS, label: 'Corporate Cards', icon: CreditCard, roles: ['ADMIN', 'FINANCE'], entitlement: 'CARD_ISSUING' as Entitlement }, 
    { id: ViewState.THE_VAULT, label: 'Treasury', icon: Lock, roles: ['ADMIN', 'FINANCE'], entitlement: 'TREASURY_MGMT' as Entitlement }, 
    { id: ViewState.PARTNERS, label: 'Partner Program', icon: Handshake, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.APPROVALS, label: 'Approvals', icon: ShieldCheck, roles: ['ADMIN', 'FINANCE', 'HR'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.TEAM, label: 'Team & Access', icon: UserCog, roles: ['ADMIN', 'HR'], entitlement: 'CORE_PAYMENTS' as Entitlement }, 
    { id: ViewState.DISPUTES, label: 'Disputes', icon: ShieldAlert, roles: ['ADMIN', 'FINANCE'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.INSIGHTS, label: 'AI Intelligence', icon: Sparkles, roles: ['ADMIN', 'FINANCE', 'VIEWER'], entitlement: 'AI_SENTINEL' as Entitlement },
    { id: ViewState.DEVELOPERS, label: 'Developers', icon: Code, roles: ['ADMIN', 'DEVELOPER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.ADMIN_DASHBOARD, label: 'Admin Console', icon: ShieldAlert, roles: ['ADMIN'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings, roles: ['ADMIN', 'FINANCE', 'DEVELOPER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
    { id: ViewState.HELP, label: 'Knowledge Hub', icon: HelpCircle, roles: ['ADMIN', 'FINANCE', 'HR', 'DEVELOPER', 'VIEWER'], entitlement: 'CORE_PAYMENTS' as Entitlement },
  ];

  const filteredItems = menuItems.filter(item => 
      item.roles.includes(userRole) && 
      activeUmbrella.entitlements.includes(item.entitlement)
  );

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-brand-950 text-slate-400 transform transition-transform duration-200 ease-out border-r border-brand-900
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-auto
  `;

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm z-20 md:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={sidebarClasses}>
        <button onClick={onGoHome} className="w-full flex items-center gap-3 p-6 border-b border-brand-900 h-16 bg-brand-950 hover:bg-brand-900/50 transition-colors group text-left">
          <div className="bg-action-500 p-1.5 rounded-sm group-hover:scale-110 transition-transform"><Wallet className="w-4 h-4 text-white" /></div>
          <span className="text-lg font-bold tracking-tight text-white font-mono uppercase">PAYFLOW</span>
        </button>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-hide">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button key={item.id} onClick={() => { onChangeView(item.id); setIsOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 group relative ${isActive ? 'bg-brand-900 text-white' : 'text-slate-400 hover:text-white hover:bg-brand-900/50'}`}>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-action-500 rounded-l-sm"></div>}
                <Icon className={`w-4 h-4 ml-1 ${isActive ? 'text-action-500' : 'text-slate-500'}`} />
                <span className={`font-medium ${isActive ? 'translate-x-1' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 w-full p-4 space-y-3 bg-brand-950/80 backdrop-blur-xl border-t border-brand-900">
           <div className="p-3 rounded-sm bg-black/40 border border-brand-800 space-y-2">
              <div className="flex justify-between items-center text-[8px] font-mono font-bold text-brand-500 uppercase">
                <span className="flex items-center gap-1"><Cpu className="w-2 h-2"/> {telemetry.cpu}%</span>
                <span className="flex items-center gap-1"><Database className="w-2 h-2"/> {telemetry.mem}MB</span>
                <span className="flex items-center gap-1"><Activity className="w-2 h-2"/> {telemetry.latency}ms</span>
              </div>
              <div className="h-0.5 bg-brand-900 rounded-full overflow-hidden">
                <div className="h-full bg-action-500 w-1/3 animate-pulse"></div>
              </div>
           </div>
           
           <div className="p-3 rounded-sm bg-brand-900/50 border border-brand-800 text-center">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider truncate mb-1">{activeUmbrella.name}</h4>
              <span className="text-[8px] font-mono text-action-500 border border-action-500/30 px-1 py-0.5 rounded-sm">TIER_{activeUmbrella.tier}</span>
           </div>
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-brand-500 hover:text-action-500 uppercase tracking-widest border border-brand-900 rounded-sm transition-all">
              <LogOut className="w-3 h-3" /> Terminate Session
           </button>
        </div>
      </aside>
    </>
  );
};
