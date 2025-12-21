
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TRANSACTIONS = 'TRANSACTIONS',
  COLLECTIONS = 'COLLECTIONS',
  THE_VAULT = 'THE_VAULT', 
  PARTNERS = 'PARTNERS',
  INSIGHTS = 'INSIGHTS',
  DISPUTES = 'DISPUTES',
  DEVELOPERS = 'DEVELOPERS',
  SETTINGS = 'SETTINGS',
  PAYROLL = 'PAYROLL',
  CARDS = 'CARDS',
  TEAM = 'TEAM',
  PUBLIC_PARTNER_VIEW = 'PUBLIC_PARTNER_VIEW',
  PUBLIC_STORE_VIEW = 'PUBLIC_STORE_VIEW',
  PUBLIC_REMITTANCE = 'PUBLIC_REMITTANCE',
  EMPLOYEE_PORTAL = 'EMPLOYEE_PORTAL',
  APPROVALS = 'APPROVALS',
  GATEWAY_AI = 'GATEWAY_AI',
  HELP = 'HELP',
  FX_EXCHANGE = 'FX_EXCHANGE',
  BRIDGE = 'BRIDGE',
  LIQUIDITY_SENTINEL = 'LIQUIDITY_SENTINEL',
  LIVE_POS = 'LIVE_POS',
  GATEWAY_HUB = 'GATEWAY_HUB',
  VELOCITY_SETTLEMENT = 'VELOCITY_SETTLEMENT',
  COMPLIANCE_SENTINEL = 'COMPLIANCE_SENTINEL',
  LP_HUB = 'LP_HUB',
  AI_TRADE_TERMINAL = 'AI_TRADE_TERMINAL',
  PITCH_DECK = 'PITCH_DECK',
  REPORTING = 'REPORTING',
  REMITTANCE_HUB = 'REMITTANCE_HUB'
}

export type Role = 'ADMIN' | 'FINANCE' | 'HR' | 'DEVELOPER' | 'VIEWER';

export type Entitlement = 
  | 'CORE_PAYMENTS' 
  | 'TREASURY_MGMT' 
  | 'WEB3_BRIDGE' 
  | 'AI_SENTINEL' 
  | 'PAYROLL_AUTO' 
  | 'CARD_ISSUING' 
  | 'VELOCITY_PAYOUTS'
  | 'REMITTANCE_CONTROL';

export enum AutonomyLevel {
  LEVEL_0_OBSERVE = 'L0_OBSERVE',
  LEVEL_1_RECOMMEND = 'L1_RECOMMEND',
  LEVEL_2_CONDITIONAL = 'L2_CONDITIONAL',
  LEVEL_3_AUTONOMOUS = 'L3_AUTONOMOUS'
}

export interface RemittanceRecord {
  id: string;
  timestamp: string;
  sender: {
    name: string;
    phone: string;
    idType: string;
    idNumber: string;
    source: string;
  };
  beneficiary: {
    name: string;
    bank: string;
    accountNo: string;
  };
  corridor: string;
  amountFrom: number;
  currencyFrom: string;
  amountTo: number;
  currencyTo: string;
  rate: number;
  status: 'PENDING' | 'SETTLED' | 'FROZEN' | 'CANCELLED' | 'QUEUED' | 'THROTTLED';
  riskScore: number;
  eta?: string;
  impact?: 'LOW' | 'MEDIUM' | 'HIGH';
  aiConfidence?: number;
  complianceStatus?: 'VERIFIED' | 'FLAGGED' | 'MANUAL_REVIEW';
  autoAction?: string;
}

export interface Umbrella {
  id: string;
  name: string;
  region: string;
  status: string;
  tier: 'BASIC' | 'PRO' | 'ENTERPRISE';
  entitlements: Entitlement[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'INVITED';
  lastLogin: string;
  mfaEnabled: boolean;
}

export enum TransactionStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export type CollectionType = 'PRODUCT' | 'SUBSCRIPTION' | 'DONATION' | 'ALL';

export interface Transaction {
  id: string;
  date: string;
  customerName: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: CollectionType;
  method: string;
  description: string;
  fraudScore: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  taxId: string;
  role: string;
  department: string;
  salary: number;
  allowances?: number;
  currency: string;
  status: 'ACTIVE' | 'INACTIVE';
  bank: string;
  region: 'NG' | 'UK' | 'US';
}

export interface LiquiditySource {
  id: string;
  name: string;
  type: CapitalType;
  currency: string;
  capacity: number;
  deployed: number;
  costOfCapital: number;
  status: string;
  priority: number;
  yieldRate: number;
}

export type CapitalType = 'EQUITY' | 'FLOAT' | 'DEBT';

export interface PayrollAudit {
  complianceScore: number;
  ghostEmployees: number;
  salaryVariance: number;
  taxLiabilityForecast: number;
  recommendations: string[];
}

export interface TreasuryForecast {
  runwayMonths: number;
  burnRate: number;
  suggestedAction: string;
  hedgingOpportunity: boolean;
}

export interface MarketPulse {
  pair: string;
  rate: number;
  change: number;
  volatility: 'STABLE' | 'MODERATE' | 'EXTREME';
}

export interface TradeOpportunity {
  id: string;
  pair: string;
  action: string;
  reasoning: string;
  expectedGain: string;
  riskFactor: string;
  confidence: number;
}

export interface PaymentLink {
  id: string;
  title: string;
  amount: number;
  url: string;
  active: boolean;
  clicks: number;
}

export interface Collection extends PaymentLink {
  type: CollectionType;
  description?: string;
  currency: string;
  frequency?: 'MONTHLY' | 'YEARLY';
  revenue: number;
}

export interface Dispute {
  id: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: 'OPEN' | 'WON' | 'LOST';
  dueDate: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  payload: any;
  status: string;
  timestamp: string;
  targetUrl: string;
}

export interface MarketRegion {
  id: string;
  name: string;
  code: string;
  currency: string;
  fxRate: number;
  status: 'ACTIVE' | 'INACTIVE';
  compliance: string;
  rails: string[];
}

export interface AuditLog {
  ts: string;
  user: string;
  action: string;
  target: string;
  ip: string;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalRequest {
  id: string;
  type: string;
  requester: string;
  details: string;
  timestamp: string;
  status: ApprovalStatus;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  amount?: number;
  currency?: string;
}

export type DesignTheme = 'NEON_CYBER' | 'MINIMAL_GLASS' | 'PREMIUM_LUXE';

export interface GeneratedPageData {
  title: string;
  headline: string;
  subheadline: string;
  cta: string;
  features: string[];
  theme: DesignTheme;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT';
  priority: 'P1' | 'P2' | 'P3';
  description: string;
  status: 'OPEN' | 'RESOLVED';
  timestamp: string;
}

export type FXProtocol = 'PAYFLOW_MESH' | 'STABLE_BRIDGE' | 'BANK_SWIFT';

export type Chain = 'BASE' | 'POLYGON' | 'ETHEREUM';

export type Asset = 'USDC' | 'USDT' | 'EURC';

export interface BridgeRoute {
  fromAsset: string;
  toAsset: Asset;
  toChain: Chain;
  amount: number;
}

export interface VelocityConfig {
  isEnabled: boolean;
  payoutPercentage: number;
  reservePercentage: number;
  reserveBalance: number;
  trustScore: number;
  lastAuditDate: string;
  trustLevel: string;
}

export interface ComplianceDocument {
  id: string;
  type: 'ID_CARD' | 'TAX_CERT' | 'INCORPORATION';
  status: 'VERIFIED' | 'PENDING' | 'FAILED';
  aiConfidence?: number;
  expiryDate?: string;
}

export type TrustLevel = 'LEVEL_1_LITE' | 'LEVEL_2_PRO' | 'LEVEL_3_ENTERPRISE';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  timestamp: string;
}

export interface Card {
  id: string;
  last4: string;
  holderName: string;
  expiry: string;
  cvc: string;
  limit: number;
  spent: number;
  currency: string;
  status: 'ACTIVE' | 'FROZEN';
  type: string;
  brand: string;
  smartCategory?: string;
}
