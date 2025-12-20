
import { MarketRegion, Employee, Card, Collection, Transaction, WebhookEvent, TradeOpportunity, ApprovalRequest, ApprovalStatus } from "../types";

const API_BASE = "http://localhost:5000/api";
const MAX_RETRIES = 2;

/**
 * RESILIENCE ENGINE v4.0
 * Ultra-defensive wrapper to prevent UI crashes.
 */
async function requestWithRetry<T>(fn: () => Promise<Response>, fallback: T, retries = MAX_RETRIES, delay = 1000): Promise<T> {
    try {
        const response = await fn();
        
        if (response.status === 429) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return requestWithRetry(fn, fallback, retries - 1, delay * 2);
            }
            return fallback;
        }

        if (!response.ok) return fallback;

        const data = await response.json();
        return data as T;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return requestWithRetry(fn, fallback, retries - 1, delay * 2);
        }
        console.warn("[BACKEND_ORCHESTRATOR] Server unreachable. Operating in Local Mode.");
        return fallback;
    }
}

export const BackendService = {
  async init() {
    // Session initialization
  },

  // --- REGIONS & GLOBAL SYNC ---
  async getRegions(): Promise<MarketRegion[]> {
    return requestWithRetry<MarketRegion[]>(() => fetch(`${API_BASE}/regions`, {
        headers: { 'x-umbrella-id': 'GLB-HQ' }
    }), []);
  },

  async addNewRegion(region: Partial<MarketRegion>): Promise<MarketRegion[]> {
    return requestWithRetry<MarketRegion[]>(() => fetch(`${API_BASE}/regions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify(region)
    }), []);
  },

  async toggleRegionStatus(id: string): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/regions/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'x-umbrella-id': 'GLB-HQ' }
    }), { success: false });
  },

  async addRailToRegion(regionId: string, railName: string): Promise<MarketRegion[]> {
    return requestWithRetry<MarketRegion[]>(() => fetch(`${API_BASE}/regions/${regionId}/rails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify({ railName })
    }), []);
  },

  // --- GOVERNANCE ENGINE ---
  async getApprovals(): Promise<ApprovalRequest[]> {
    return requestWithRetry<ApprovalRequest[]>(() => fetch(`${API_BASE}/approvals`, {
        headers: { 'x-umbrella-id': 'GLB-HQ' }
    }), []);
  },

  async requestApproval(data: Partial<ApprovalRequest>): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/approvals/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify(data)
    }), { success: false });
  },

  async processApproval(id: string, status: ApprovalStatus): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/approvals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify({ status })
    }), { success: false });
  },

  // --- PERSISTENCE LAYER ---
  async getCollections(): Promise<Collection[]> {
    return requestWithRetry<Collection[]>(() => fetch(`${API_BASE}/collections`, {
        headers: { 'x-umbrella-id': 'GLB-HQ' }
    }), []);
  },

  async saveCollections(collections: Collection[]): Promise<void> {
    fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify({ collections })
    }).catch(() => {}); // Fire and forget
  },

  async getEmployees(): Promise<Employee[]> {
    return requestWithRetry<Employee[]>(() => fetch(`${API_BASE}/employees`, {
        headers: { 'x-umbrella-id': 'GLB-HQ' }
    }), []);
  },

  async updateTransaction(tx: Transaction): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/transactions/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify(tx)
    }), { success: false });
  },

  async executeFXTrade(opportunity: TradeOpportunity): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/trades/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify(opportunity)
    }), { success: false });
  },

  async bindStrategicPartner(bankName: string, capacity: string): Promise<any> {
    return requestWithRetry(() => fetch(`${API_BASE}/strategic/bind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-umbrella-id': 'GLB-HQ' },
        body: JSON.stringify({ bankName, capacity })
    }), { success: false });
  }
};
