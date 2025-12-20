import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { Search, LayoutDashboard, Receipt, Link as LinkIcon, Lock, Handshake, ShieldAlert, Sparkles, Code, Settings, ArrowRight, Wallet, LogOut, Package, Plus } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  changeView: (view: ViewState) => void;
}

type CommandGroup = 'NAVIGATION' | 'ACTIONS' | 'SYSTEM';

interface Command {
  id: string;
  label: string;
  group: CommandGroup;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, changeView }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define Commands
  const commands: Command[] = [
    // Navigation
    { id: 'nav-dash', label: 'Go to Dashboard', group: 'NAVIGATION', icon: LayoutDashboard, action: () => changeView(ViewState.DASHBOARD) },
    { id: 'nav-tx', label: 'View Transactions', group: 'NAVIGATION', icon: Receipt, action: () => changeView(ViewState.TRANSACTIONS) },
    { id: 'nav-links', label: 'Manage Revenue Streams', group: 'NAVIGATION', icon: Package, action: () => changeView(ViewState.COLLECTIONS) },
    { id: 'nav-vault', label: 'Access The Vault', group: 'NAVIGATION', icon: Lock, action: () => changeView(ViewState.THE_VAULT) },
    { id: 'nav-ai', label: 'AI Intelligence', group: 'NAVIGATION', icon: Sparkles, action: () => changeView(ViewState.INSIGHTS) },
    { id: 'nav-dev', label: 'Developer Tools', group: 'NAVIGATION', icon: Code, action: () => changeView(ViewState.DEVELOPERS) },
    
    // Actions
    { id: 'act-new-link', label: 'Create New Stream', group: 'ACTIONS', icon: Plus, action: () => changeView(ViewState.COLLECTIONS) }, 
    { id: 'act-payout', label: 'Initiate Payout', group: 'ACTIONS', icon: Wallet, action: () => console.log('Payout Triggered') },
    
    // System
    { id: 'sys-settings', label: 'System Configuration', group: 'SYSTEM', icon: Settings, action: () => changeView(ViewState.SETTINGS) },
    { id: 'sys-logout', label: 'Log Out Session', group: 'SYSTEM', icon: LogOut, action: () => window.location.reload() },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette Window */}
      <div className="relative w-full max-w-lg bg-brand-950 border border-brand-800 shadow-2xl rounded-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header / Input */}
        <div className="flex items-center gap-3 p-4 border-b border-brand-800">
          <div className="text-action-500 animate-pulse">
             <ArrowRight className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-brand-600 font-mono text-sm h-6"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
          <span className="text-[10px] font-mono text-brand-600 border border-brand-800 px-1.5 py-0.5 rounded-sm">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-brand-500 text-xs font-mono">
              No matching commands found.
            </div>
          ) : (
            <>
              {['NAVIGATION', 'ACTIONS', 'SYSTEM'].map((group) => {
                const groupCommands = filteredCommands.filter(c => c.group === group);
                if (groupCommands.length === 0) return null;

                return (
                  <div key={group} className="mb-2">
                    <div className="px-4 py-1.5 text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                      {group}
                    </div>
                    {groupCommands.map((cmd) => {
                      const isActive = filteredCommands.indexOf(cmd) === activeIndex;
                      const Icon = cmd.icon;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setActiveIndex(filteredCommands.indexOf(cmd))}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative
                            ${isActive ? 'bg-brand-900 text-white' : 'text-brand-400'}
                          `}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-action-500"></div>
                          )}
                          <Icon className={`w-4 h-4 ${isActive ? 'text-action-500' : 'text-brand-600'}`} />
                          <span className="font-medium">{cmd.label}</span>
                          {cmd.shortcut && (
                            <span className="ml-auto text-xs font-mono text-brand-600">{cmd.shortcut}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-brand-900/30 border-t border-brand-800 flex justify-between items-center text-[10px] text-brand-500 font-mono px-4">
           <span>PAYFLOW_OS v2.4.1</span>
           <span className="flex items-center gap-2">
             <span>Navigate</span> <span className="text-brand-400">↑↓</span>
             <span className="ml-2">Select</span> <span className="text-brand-400">↵</span>
           </span>
        </div>
      </div>
    </div>
  );
};