import React from 'react';
import { Notification } from '../types';
import { Bell, Check, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface NotificationsProps {
  notifications: Notification[];
  markAsRead: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, markAsRead, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch(type) {
      case 'SUCCESS': return <Check className="w-3 h-3 text-white" />;
      case 'WARNING': return <AlertTriangle className="w-3 h-3 text-white" />;
      case 'ERROR': return <AlertCircle className="w-3 h-3 text-white" />;
      default: return <Info className="w-3 h-3 text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case 'SUCCESS': return 'bg-emerald-500';
      case 'WARNING': return 'bg-amber-500';
      case 'ERROR': return 'bg-rose-500';
      default: return 'bg-brand-500';
    }
  };

  return (
    <div className="absolute top-16 right-6 w-80 bg-white rounded-sm shadow-xl border border-brand-100 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between p-3 border-b border-brand-100 bg-brand-50">
        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-wide">Notifications</h3>
        <div className="flex gap-2">
           <button onClick={markAsRead} className="text-[10px] text-action-600 font-bold hover:underline">MARK ALL READ</button>
           <button onClick={onClose}><X className="w-3 h-3 text-brand-400" /></button>
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-brand-400 text-xs font-mono">No new alerts</div>
        ) : (
          <div className="divide-y divide-brand-50">
            {notifications.slice().reverse().map((notif) => (
              <div key={notif.id} className={`p-3 hover:bg-brand-50 transition-colors ${!notif.read ? 'bg-brand-50/50' : ''}`}>
                <div className="flex gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${getColor(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-900">{notif.title}</h4>
                    <p className="text-[10px] text-brand-500 leading-tight mt-0.5">{notif.message}</p>
                    <p className="text-[9px] text-brand-300 font-mono mt-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};