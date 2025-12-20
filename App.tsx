
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
import { PitchDeck } from './components/PitchDeck';
import { AccessPortal } from './components/AccessPortal';
import { Notifications } from './components/Notifications';
import { CommandPalette } from './components/CommandPalette';
import { LiveSupport } from './components/LiveSupport';
import { PublicLanding } from './components/PublicLanding';
import { AuthFlow } from './components/AuthFlow';
import { Reporting } from './components/Reporting';

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

  // Initial Mock Data Roster for Full Functionality Restore
  const [collections, setCollections] = useState<Collection[]>([
    { id: 'LINK-01', title: 'Global Enterprise License', amount: 1250, url: 'payflow.link/ent-01', active: true, clicks: 142, revenue: 177500, type: 'PRODUCT', currency: 'USD' },
    { id: 'LINK-02', title: 'Monthly SaaS Stream', amount: 45, url: 'payflow.link/saas-01', active: true, clicks: 2440, revenue: 109800, type: 'SUBSCRIPTION', currency: 'USD' }
  ]);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-8291', date: new Date().toISOString(), customerName: 'Stellar Tech Labs', amount: 1250, currency: 'USD', status: TransactionStatus.COMPLETED, type: 'PRODUCT', method: 'Visa Premium', description: 'Institutional License Sync', fraudScore: 98 },
    { id: 'TX-8290', date: new Date(Date.now() - 3600000).toISOString(), customerName: 'Digital Nomads Inc', amount: 45, currency: 'USD', status: TransactionStatus.COMPLETED, type: 'SUBSCRIPTION', method: 'Apple Pay', description: 'Auto-renewal: Node Cluster', fraudScore: 99 }
  ]);

  const [cards, setCards] = useState<Card[]>([
    { id: 'CARD-01', last4: '8821', holderName: 'Global Ops Team', expiry: '12/28', cvc: '123', limit: 25000, spent: 4500, currency: 'USD', status: 'ACTIVE', type: 'VIRTUAL', brand: 'VISA', smartCategory: 'Infrastructure' }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
      { 
        id: 'EMP-01', 
        name: 'John Doe', 
        email: 'john@acme-global.com', 
        phone: '+234 800 123 4567', 
        taxId: 'TX-NG-9921', 
        role: 'Head of Operations', 
        department: 'Engineering', 
        salary: 12000000, 
        allowances: 500000, 
        currency: 'NGN', 
        status: 'ACTIVE', 
        bank: 'GTBank', 
        region: 'NG' 
      }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [treasuryBalance, setTreasuryBalance] = useState(1842500);

  const addNotification = (title: string, message: string, type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev, newNotif]);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return (
        <Dashboard 
            treasuryBalance={treasuryBalance} 
            transactionCount={transactions.length + 1420} // Hydrated Mock Count
            linkCount={collections.length}
            cardCount={cards.length}
        />
      );
      case ViewState.REPORTING: return <Reporting />;
      case ViewState.TRANSACTIONS: return <Transactions transactions={transactions} setTransactions={setTransactions} addNotification={addNotification} />;
      case ViewState.COLLECTIONS: return <Collections collections={collections} setCollections={setCollections} onSettle={(id, amount) => setTreasuryBalance(prev => prev + amount)} />;
      case ViewState.THE_VAULT: return <TheVault addNotification={addNotification} />;
      case ViewState.PARTNERS: return <PartnerProgram onChangeView={setCurrentView} addNotification={addNotification} />;
      case ViewState.INSIGHTS: return <AIInsights transactions={transactions} />;
      case ViewState.DISPUTES: return <Disputes addNotification={addNotification} />;
      case ViewState.DEVELOPERS: return <Developers addNotification={addNotification} />;
      case ViewState.SETTINGS: return <Settings />;
      case ViewState.PAYROLL: return <Payroll employees={employees} setEmployees={setEmployees} onRunPayroll={async () => { addNotification('Payroll Success', 'Disbursements broadcast via Velocity rail.', 'SUCCESS'); return true; }} isEWAEnabled={true} setIsEWAEnabled={() => {}} />;
      case ViewState.CARDS: return <Cards cards={cards} setCards={setCards} onSimulateSpend={(id, amt) => setTreasuryBalance(prev => prev - amt)} />;
      case ViewState.TEAM: return <Team />;
      case ViewState.APPROVALS: return <Approvals />;
      case ViewState.GATEWAY_AI: return <GatewayAI onPreview={(data) => setCurrentView(ViewState.PUBLIC_STORE_VIEW)} onSettle={(amt) => setTreasuryBalance(prev => prev + amt)} />;
      case ViewState.FX_EXCHANGE: return <FXExchange />;
      case ViewState.BRIDGE: return <Web3Bridge />;
      case ViewState.LIQUIDITY_SENTINEL: return <LiquiditySentinel />;
      case ViewState.LIVE_POS: return <LivePOS recordSettlement={(items) => setTreasuryBalance(prev => prev + items.reduce((a, b) => a + b.price, 0))} />;
      case ViewState.GATEWAY_HUB: return <GatewayHub addNotification={addNotification} />;
      case ViewState.VELOCITY_SETTLEMENT: return <VelocitySettlement />;
      case ViewState.COMPLIANCE_SENTINEL: return <ComplianceSentinel />;
      case ViewState.LP_HUB: return <LPHub />;
      case ViewState.AI_TRADE_TERMINAL: return <AITradeTerminal treasuryBalance={treasuryBalance} updateBalance={(delta) => setTreasuryBalance(prev => prev + delta)} />;
      case ViewState.HELP: return <HelpCorner onChangeView={setCurrentView} />;
      case ViewState.PITCH_DECK: return <PitchDeck onExit={() => setCurrentView(ViewState.HELP)} />;
      case ViewState.EMPLOYEE_PORTAL: 
        if (employees.length > 0) return <EmployeePortal employee={employees[0]} isEWAEnabled={true} onWithdrawEWA={(amt) => { setTreasuryBalance(prev => prev - amt); addNotification('Stream Success', 'Earnings released to destination rail.', 'SUCCESS'); }} />;
        return <div className="p-12 text-center text-brand-400 font-mono">No Employee Session Profile Loaded. Configure Payroll Roster.</div>;
      default: return <div className="p-12 text-center text-brand-400 font-mono">Sub-Module Offline or Restricted.</div>;
    }
  };

  if (isPublicMode && !isAuthMode) {
    return <PublicLanding onStart={() => setIsAuthMode(true)} isLoggedIn={!!user} />;
  }

  if (isAuthMode && !user) {
    return <AuthFlow onLogin={(email) => setUser({ id: 'U1', name: email.split('@')[0], email, role: 'ADMIN', status: 'ACTIVE', lastLogin: 'Just now', mfaEnabled: true })} onCancel={() => setIsAuthMode(false)} />;
  }

  if (user && !umbrella) {
    return <AccessPortal onAccess={(u, umb) => setUmbrella(umb)} onGoHome={() => setUser(null)} />;
  }

  return (
    <div className="flex h-screen bg-brand-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        userRole={user?.role || 'VIEWER'} 
        activeUmbrella={umbrella!} 
        onLogout={() => { setUser(null); setUmbrella(null); setIsAuthMode(false); }}
        onGoHome={() => setIsPublicMode(true)}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-brand-100 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-brand-900 font-bold uppercase text-[10px]">Menu</button>
            <div className="hidden md:block h-8 w-px bg-brand-100"></div>
            <span className="text-xs font-mono text-brand-400 uppercase tracking-widest">{umbrella?.name} // {currentView.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsCommandPaletteOpen(true)} className="p-2 text-brand-400 hover:text-brand-900 uppercase text-[10px] font-bold">Search</button>
             <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 text-brand-400 hover:text-brand-900 uppercase text-[10px] font-bold relative">
               Alerts {notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-action-500 rounded-full"></span>}
             </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 relative bg-brand-50">
          {renderContent()}
        </main>
        <Notifications notifications={notifications} isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} markAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} />
        <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} changeView={setCurrentView} />
        <LiveSupport isOpen={isLiveSupportOpen} onClose={() => setIsLiveSupportOpen(false)} />
        <button onClick={() => setIsLiveSupportOpen(true)} className="fixed bottom-6 right-6 bg-brand-950 text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all z-40">
          Oracle Voice
        </button>
      </div>
    </div>
  );
};

export default App;
