
import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Activity, Globe } from 'lucide-react';

export type StatVariant = 'emerald' | 'blue' | 'violet' | 'rose' | 'neutral';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  variant?: StatVariant;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive, variant = 'neutral', icon }) => {
  
  const borderClasses = {
    emerald: 'border-t-data-emerald',
    blue: 'border-t-data-blue',
    violet: 'border-t-data-violet',
    rose: 'border-t-data-rose',
    neutral: 'border-t-brand-100',
  };

  const iconColors = {
    emerald: 'text-data-emerald',
    blue: 'text-data-blue',
    violet: 'text-data-violet',
    rose: 'text-data-rose',
    neutral: 'text-brand-500',
  };

  return (
    <div className={`bg-white p-5 rounded-sm border-x border-b border-brand-100 border-t-4 ${borderClasses[variant]} shadow-sm hover:shadow-md transition-all duration-200 relative group`}>
      <div className="flex justify-between items-start mb-2">
         <h3 className="text-brand-500 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
         <div className={`${iconColors[variant]} opacity-70 group-hover:scale-110 transition-transform`}>
           {icon}
         </div>
      </div>
      
      <div className="flex items-baseline justify-between mt-4">
        <p className="text-2xl font-bold text-brand-900 tracking-tight font-mono">{value}</p>
        
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wide
          ${isPositive 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
          {change}
        </div>
      </div>
    </div>
  );
};
