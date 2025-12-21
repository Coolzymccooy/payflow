import React from 'react';
import { ChevronRight, Activity, Globe, ShieldCheck } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: string[];
  actions?: React.ReactNode;
  status?: 'LIVE' | 'SYNCING' | 'SECURE';
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions, status = 'LIVE' }) => {
  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-1 duration-300">
      {/* Breadcrumb Context Bar */}
      <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-400 mb-3">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className={index === breadcrumbs.length - 1 ? 'text-action-500' : ''}>{crumb}</span>
            {index < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-brand-200" />}
          </React.Fragment>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-sm">
           {status === 'LIVE' && <Activity className="w-3 h-3 text-data-emerald" />}
           {status === 'SYNCING' && <Globe className="w-3 h-3 text-data-blue animate-pulse" />}
           {status === 'SECURE' && <ShieldCheck className="w-3 h-3 text-brand-500" />}
           <span className={`text-[9px] ${status === 'LIVE' ? 'text-data-emerald' : 'text-brand-500'}`}>
             SYSTEM_{status}
           </span>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-brand-100 pb-6 relative">
         <div className="relative">
            {/* Decorative Accent */}
            <div className="absolute -left-6 top-1 w-1 h-8 bg-brand-900 rounded-r-sm hidden md:block"></div>
            
            <h1 className="text-2xl font-bold text-brand-900 tracking-tight leading-none mb-2">{title}</h1>
            <p className="text-sm text-brand-500 max-w-lg font-medium">{subtitle}</p>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            {actions}
         </div>
      </div>
    </div>
  );
};