
import React, { useState, useEffect } from 'react';
import { ViewState, User, Umbrella, Role, Collection, Transaction, Card, Employee, Notification, TransactionStatus } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Collections } from './components/Collections';
import { TheVault } from './components/TheVault';
import { PartnerProgram } from './components/PartnerProgram';
import { AIInsights } from './components/AIInsights';
import { Disputes } from './components/Disputes';
import { Developers } from './components/Developers';
import { Settings } from './components/Settings';
import { Payroll } from './components/Payroll';
import { Cards } from './components/Cards';
import { Team } from './components/Team';
import { PublicPartnerPage } from './components/PublicPartnerPage';
import { PublicStoreView } from './components/PublicStoreView';
import { PublicRemittance } from './components/PublicRemittance';
import { EmployeePortal } from './components/EmployeePortal';
import { Approvals } from './components/Approvals';
import { GatewayAI } from './components/GatewayAI';
import { HelpCorner } from './components/HelpCorner';
import { FXExchange } from './components/FXExchange';
import { Web3Bridge } from './components/Web3Bridge';
import { LiquiditySentinel } from './components/LiquiditySentinel';
import { LivePOS } from './components/LivePOS';
import { GatewayHub } from './components/GatewayHub';
import { VelocitySettlement } from './components/VelocitySettlement';
import { ComplianceSentinel } from './components/ComplianceSentinel';
import { LPHub } from './components/LPHub';
import { AITradeTerminal } from './components/AITradeTerminal';
import { RemittanceHub } from './components/RemittanceHub';
import { PitchDeck } from './components/PitchDeck';
import { AccessPortal } from './components/AccessPortal';
import { Notifications } from './components/Notifications';
import { CommandPalette } from './components/CommandPalette';
import { LiveSupport } from './components/LiveSupport';
import { PublicLanding } from './components/PublicLanding';
import { AuthFlow } from './components/AuthFlow';
import { Reporting } from './components/Reporting';
import { BackendService } from './services/backend';
import "./index.css";


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [umbrella, setUmbrella] = useState<Umbrella | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLiveSupportOpen, setIsLiveSupportOpen] = useState(false);
  const [isPublicMode, setIsPublicMode] = useState(true);
  const [isAuthMode, setIsAuthMode] = useState(false);

  // Core Data State
  const [collections, setCollections] = useState<Collection[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<Card[]>([
    { id: 'CARD-01', last4: '8821', holderName: 'Global Ops Team', expiry: '12/28', cvc: '123', limit: 25000, spent: 4500, currency: 'USD', status: 'ACTIVE', type: 'VIRTUAL', brand: 'VISA', smartCategory: 'Infrastructure' }
  ]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activeEmployeeView, setActiveEmployeeView] = useState<Employee | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [treasuryBalance, setTreasuryBalance] = useState(1842500);

  // Sync with Backend
  useEffect(() => {
    if (umbrella) {
      const sync = async () => {
        const data = await BackendService.syncAll();
        if (data) {
          setTransactions(data.transactions);
          setEmployees(data.employees);
          setCollections(data.collections);
          setTreasuryBalance(data.treasury.USD);
          addNotification('System Sync', 'Handshake successful.', 'SUCCESS');
        }
      };
      sync();
    }
  }, [umbrella]);

  const addNotification = (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => {
    const newNotif: Notification = { id: Date.now().toString(), title, message, type, read: false, timestamp: new Date().toISOString() };
    setNotifications(prev => [...prev, newNotif]);
  };

  const handleSettle = async (id: string, amount: number) => {
    setTreasuryBalance(prev => prev + amount);
    const result = await BackendService.recordTransaction({ amount, currency: 'USD', customerName: 'Simulated Customer', type: 'PRODUCT', description: `Settlement for endpoint ${id}` });
    if (result && result.success) {
        setTransactions(prev => [result.tx, ...prev]);
        addNotification('Settlement Recorded', `Captured $${amount.toLocaleString()} into treasury.`, 'SUCCESS');
    }
  };

  const renderContent = () => {
    // These views are rendered within the Sidebar/Dashboard shell (requires umbrella)
    switch (currentView) {
      case ViewState.DASHBOARD: 
        return <Dashboard treasuryBalance={treasuryBalance} transactionCount={transactions.length} linkCount={collections.length} cardCount={cards.length} addNotification={addNotification} />;
      case ViewState.REPORTING: 
        return <Reporting transactions={transactions} />;
      case ViewState.REMITTANCE_HUB:
        return <RemittanceHub addNotification={addNotification} />;
      case ViewState.TRANSACTIONS: 
        return <Transactions transactions={transactions} setTransactions={setTransactions} addNotification={addNotification} />;
      case ViewState.COLLECTIONS: 
        return <Collections collections={collections} setCollections={setCollections} onSettle={handleSettle} />;
      case ViewState.THE_VAULT: 
        return <TheVault liquiditySources={[]} addNotification={addNotification} setLiquiditySources={() => {}} />;
      case ViewState.PAYROLL: 
        return (
          <Payroll 
              employees={employees} 
              setEmployees={setEmployees} 
              onRunPayroll={async () => { addNotification('Payroll Success', 'Disbursements broadcast.', 'SUCCESS'); return true; }} 
              isEWAEnabled={true} 
              setIsEWAEnabled={() => {}}
              onViewEmployeePortal={(emp) => {
                  setActiveEmployeeView(emp);
                  setCurrentView(ViewState.EMPLOYEE_PORTAL);
              }}
          />
        );
      case ViewState.EMPLOYEE_PORTAL: 
        const targetEmp = activeEmployeeView || (employees.length > 0 ? employees[0] : null);
        if (targetEmp) return <EmployeePortal employee={targetEmp} isEWAEnabled={true} onWithdrawEWA={(amt) => setTreasuryBalance(prev => prev - amt)} />;
        return <div className="p-12 text-center text-brand-400 font-mono">No Active Session.</div>;
      case ViewState.INSIGHTS: 
        return <AIInsights transactions={transactions} />;
      case ViewState.GATEWAY_HUB: 
        return <GatewayHub addNotification={addNotification} />;
      case ViewState.FX_EXCHANGE: 
        return <FXExchange />;
      case ViewState.CARDS: 
        return <Cards cards={cards} setCards={setCards} onSimulateSpend={(id, amt) => setTreasuryBalance(prev => prev - amt)} />;
      case ViewState.SETTINGS: 
        return <Settings />;
      case ViewState.LP_HUB:
        return <LPHub />;
      case ViewState.AI_TRADE_TERMINAL:
        return <AITradeTerminal addNotification={addNotification} treasuryBalance={treasuryBalance} updateBalance={(delta) => setTreasuryBalance(prev => prev + delta)} onWebhookDispatched={(ev) => addNotification('Trade Event', ev.type, 'INFO')} />;
      case ViewState.COMPLIANCE_SENTINEL:
        return <ComplianceSentinel />;
      case ViewState.BRIDGE:
        return <Web3Bridge 
            treasuryBalance={treasuryBalance} 
            addNotification={addNotification}
            onBridgeSuccess={(amt, fee) => {
                setTreasuryBalance(prev => prev - (amt + fee));
                addNotification('Ledger Updated', `Debited $${(amt + fee).toLocaleString()} from corporate vault.`, 'SUCCESS');
            }} 
        />;
      case ViewState.VELOCITY_SETTLEMENT:
        return <VelocitySettlement />;
      case ViewState.LIQUIDITY_SENTINEL:
        return <LiquiditySentinel />;
      case ViewState.LIVE_POS:
        return <LivePOS recordSettlement={(items) => handleSettle('POS-LIVE', items.reduce((acc, i) => acc + i.price, 0))} />;
      case ViewState.GATEWAY_AI:
        return <GatewayAI onPreview={(data) => { setIsPublicMode(false); setCurrentView(ViewState.PUBLIC_STORE_VIEW); }} onSettle={(amt, desc) => handleSettle('AI-GATEWAY', amt)} />;
      case ViewState.PARTNERS:
        return <PartnerProgram addNotification={addNotification} onChangeView={setCurrentView} />;
      case ViewState.APPROVALS:
        return <Approvals />;
      case ViewState.TEAM:
        return <Team />;
      case ViewState.DISPUTES:
        return <Disputes addNotification={addNotification} />;
      case ViewState.DEVELOPERS:
        return <Developers addNotification={addNotification} />;
      case ViewState.HELP:
        return <HelpCorner onChangeView={setCurrentView} />;
      case ViewState.PITCH_DECK:
        return <PitchDeck onExit={() => setCurrentView(ViewState.DASHBOARD)} />;
      case ViewState.PUBLIC_PARTNER_VIEW:
        return <PublicPartnerPage partnerName="Acme Partner" onBack={() => setCurrentView(ViewState.PARTNERS)} />;
      case ViewState.PUBLIC_STORE_VIEW:
        return <PublicStoreView data={{ title: 'AI Storefront', headline: 'Elite Products', subheadline: 'Settle instantly.', cta: 'Pay Now', features: ['Fast', 'Secure', 'Direct'], theme: 'NEON_CYBER' }} onBack={() => setCurrentView(ViewState.GATEWAY_AI)} onSettle={(amt, desc) => handleSettle('AI-STORE', amt)} />;
      
      default: 
        return <div className="p-12 text-center text-brand-400 font-mono">Module Restricted or Offline.</div>;
    }
  };

  // --- TOP-LEVEL ROUTING LOGIC ---

  // 1. PUBLIC REMITTANCE (Must be first to prevent authenticated shell crash)
  if (currentView === ViewState.PUBLIC_REMITTANCE) {
    return <PublicRemittance onBack={() => { setIsPublicMode(true); setCurrentView(ViewState.DASHBOARD); }} />;
  }

  // 2. LANDING PAGE
  if (isPublicMode && !isAuthMode) {
    return <PublicLanding onStart={() => setIsAuthMode(true)} isLoggedIn={!!user} onRemittance={() => { setIsPublicMode(false); setCurrentView(ViewState.PUBLIC_REMITTANCE); }} />;
  }

  // 3. AUTHENTICATION FLOW
  if (isAuthMode && !user) {
    return <AuthFlow onLogin={(email) => setUser({ id: 'U1', name: email.split('@')[0], email, role: 'ADMIN', status: 'ACTIVE', lastLogin: 'Just now', mfaEnabled: true })} onCancel={() => setIsAuthMode(false)} />;
  }

  // 4. ORGANIZATION ACCESS (UMBRELLA SELECTION)
  if (user && !umbrella) {
    return <AccessPortal onAccess={(u, umb) => setUmbrella(umb)} onGoHome={() => setUser(null)} />;
  }

  // 5. MAIN APPLICATION SHELL (Requires Non-Null Umbrella)
  return (
    <div className="flex h-screen bg-brand-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} onChangeView={setCurrentView} 
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
        userRole={user?.role || 'VIEWER'} activeUmbrella={umbrella!} 
        onLogout={() => { setUser(null); setUmbrella(null); setIsAuthMode(false); }}
        onGoHome={() => { setIsPublicMode(true); setCurrentView(ViewState.DASHBOARD); }}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-brand-100 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">{umbrella?.name} // {currentView.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsCommandPaletteOpen(true)} className="p-2 text-brand-400 hover:text-brand-900 uppercase text-[10px] font-bold">Search</button>
             <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 text-brand-400 hover:text-brand-900 uppercase text-[10px] font-bold relative">
               Alerts {notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-action-500 rounded-full"></span>}
             </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto relative p-8 bg-brand-50">
          {renderContent()}
        </main>
        <Notifications notifications={notifications} isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} markAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} />
        <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} changeView={setCurrentView} />
        <LiveSupport isOpen={isLiveSupportOpen} onClose={() => setIsLiveSupportOpen(false)} />
        <button onClick={() => setIsLiveSupportOpen(true)} className="fixed bottom-6 right-6 bg-brand-950 text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all z-40">Oracle Voice</button>
      </div>
    </div>
  );
};

export default App;
