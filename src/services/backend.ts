
import {
  MarketRegion,
  Employee,
  Card,
  Collection,
  Transaction,
  WebhookEvent,
  TradeOpportunity,
  ApprovalRequest,
  ApprovalStatus,
  RemittanceRecord,
} from "../types";

/**
 * IMPORTANT
 * - In dev, Vite proxies /api -> your Node server (5051)
 * - In prod, the same Node server serves dist/ and also exposes /api
 * So the frontend should talk to the backend via *relative* /api URLs.
 */
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "/api";
const MAX_RETRIES = 2;

async function requestWithRetry<T>(fn: () => Promise<Response>, fallback: T, retries = MAX_RETRIES, delay = 1000): Promise<T> {
    try {
        const response = await fn();
        if (response.status === 401) return fallback;
        if (!response.ok) return fallback;
        return await response.json() as T;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return requestWithRetry(fn, fallback, retries - 1, delay * 2);
        }
        return fallback;
    }
}

function withUmbrella(headers: Record<string, string> = {}) {
  // Keep the original behavior, but allow overriding from env if needed.
  const umbrellaId = (import.meta as any).env?.VITE_UMBRELLA_ID || "GLB-HQ";
  return { ...headers, "x-umbrella-id": umbrellaId };
}

export const BackendService = {
  /** Returns true when the backend answers. Useful for Settings “Backend Offline” UI. */
  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Human-friendly base URL (what users should see) */
  apiDisplayUrl(): string {
    // If API_BASE is relative, show the dev server target the user expects.
    if (API_BASE.startsWith("/")) return "http://127.0.0.1:5051";
    return API_BASE.replace(/\/?api\/?$/, "");
  },

  async syncAll(): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/sync-all`, {
        headers: withUmbrella()
    }), null);
  },

  async getRegions(): Promise<MarketRegion[]> {
    return requestWithRetry<MarketRegion[]>(() => fetch(`${API_BASE}/regions`, {
        headers: withUmbrella()
    }), []);
  },

  async getNodes(): Promise<any[]> {
    return requestWithRetry<any[]>(() => fetch(`${API_BASE}/nodes`, {
        headers: withUmbrella()
    }), []);
  },

  async toggleRegionStatus(id: string): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/regions/${id}/toggle`, {
        // server.ts uses PATCH
        method: 'PATCH',
        headers: withUmbrella()
    }), { success: false });
  },

  async recordTransaction(tx: Partial<Transaction>): Promise<any> {
    // server.ts expects /transactions/update
    return requestWithRetry(() => fetch(`${API_BASE}/transactions/update`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(tx)
    }), { success: false });
  },

  async getBalanceSheet(): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/reports/balance-sheet`, {
        headers: withUmbrella()
    }), null);
  },

  async getApprovals(): Promise<ApprovalRequest[]> {
    return requestWithRetry<ApprovalRequest[]>(() => fetch(`${API_BASE}/approvals`, {
        headers: withUmbrella()
    }), []);
  },

  async processApproval(id: string, status: ApprovalStatus): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/approvals/${id}`, {
        method: 'PATCH',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status })
    }), { success: false });
  },

  async bindMirrorNode(data: { bank: string, accountNo: string, routing: string, protocol: string, currency: string }): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/nodes/bind`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    }), { success: false });
  },

  async executeBridge(data: any): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/bridge/execute`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    }), { success: false });
  },

  async bindStrategicPartner(bank: string, cap: string): Promise<any> {
    // server.ts route
    return requestWithRetry(() => fetch(`${API_BASE}/strategic/bind`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ bank, cap })
    }), { success: false });
  },

  async executeFXTrade(opportunity: TradeOpportunity, metadata?: any): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/trades/execute`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ ...opportunity, ...metadata })
    }), { success: false });
  },

  async executeRemittance(data: Partial<RemittanceRecord>): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/remittance`, {
        method: 'POST',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
    }), { success: false });
  },

  async getRemittances(): Promise<RemittanceRecord[]> {
    return requestWithRetry<RemittanceRecord[]>(() => fetch(`${API_BASE}/remittance`, {
        headers: withUmbrella()
    }), []);
  },

  async updateRemittanceStatus(id: string, status: string): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/remittance/${id}/status`, {
        method: 'PATCH',
        headers: withUmbrella({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status })
    }), { success: false });
  }
};
