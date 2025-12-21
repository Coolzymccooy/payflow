import {
  Transaction,
  Employee,
  LiquiditySource,
  PayrollAudit,
  TreasuryForecast,
  TradeOpportunity,
  MarketPulse,
} from "../types";

const MAX_RETRIES = 2;
const API_BASE = (import.meta as any).env?.VITE_API_BASE || "/api";
const UMBRELLA_ID = (import.meta as any).env?.VITE_UMBRELLA_ID || "GLB-HQ";

type AiInsightsOk = { success: true; text: string };
type AiInsightsErr = { error: string; message?: string };

async function postInsights(prompt: string): Promise<AiInsightsOk | AiInsightsErr> {
  const res = await fetch(`${API_BASE}/ai/insights`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-umbrella-id": UMBRELLA_ID,
    },
    body: JSON.stringify({ prompt }),
  });
  return (await res.json()) as AiInsightsOk | AiInsightsErr;
}

async function callAITextWithRetry(prompt: string, retries = MAX_RETRIES): Promise<string | null> {
  try {
    const data = await postInsights(prompt);
    if ((data as AiInsightsOk).success) return (data as AiInsightsOk).text ?? "";
    return null;
  } catch (err: any) {
    if (retries > 0) {
      const delay = 1000 * (MAX_RETRIES - retries + 1);
      await new Promise((r) => setTimeout(r, delay));
      return callAITextWithRetry(prompt, retries - 1);
    }
    console.error("[AI_ORACLE_FAULT]", err);
    return null;
  }
}

async function callAIJsonWithRetry<T>(prompt: string, fallback: T, retries = MAX_RETRIES): Promise<T> {
  const text = await callAITextWithRetry(prompt, retries);
  if (!text) return fallback;

  try {
    return JSON.parse(text) as T;
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1)) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

export const analyzeAnomalies = async (transactions: Transaction[]) => {
  const prompt =
    `Analyze these transactions for unusual patterns: ${JSON.stringify(transactions.slice(0, 30))}. ` +
    `Identify 1 significant anomaly. Return STRICT JSON only: ` +
    `{ "alert": string, "confidence": number, "correlation": string[], "actions": string[] }.`;
  return callAIJsonWithRetry<any>(prompt, null);
};

export const getCashFlowForecast = async (nav: number, transactions: Transaction[]) => {
  const prompt =
    `Forecast 30-day cash flow for Treasury NAV $${nav} based on: ${JSON.stringify(transactions.slice(0, 20))}. ` +
    `Return STRICT JSON only: { "expectedInflow": number, "expectedOutflow": number, "confidence": number, "drivers": string[], "risks": string[] }.`;
  return callAIJsonWithRetry<any>(prompt, null);
};

export const askOracle = async (query: string, context: any) => {
  const prompt =
    `User Query: "${query}". Context Data: ${JSON.stringify(context)}.
` +
    `ACT AS PAYFLOW ORACLE. Provide a structured response.
` +
    `If data is requested, provide a markdown table.
` +
    `Always include a "💡 Insight" section.
` +
    `Keep it technical and executive.`;
  const text = await callAITextWithRetry(prompt);
  return text || "The Oracle is currently unavailable. Please retry.";
};

export const analyzeTradeOpportunity = async (pulses: MarketPulse[]): Promise<TradeOpportunity[]> => {
  const prompt =
    `Perform institutional corridor analysis: ${JSON.stringify(pulses)}. ` +
    `Identify 2 signals. Return STRICT JSON only: ` +
    `[ { "id": string, "pair": string, "action": string, "reasoning": string, "expectedGain": string, "riskFactor": string, "confidence": number } ].`;
  return callAIJsonWithRetry<TradeOpportunity[]>(prompt, []);
};

export const analyzeFinancials = async (transactions: Transaction[]) => {
  const prompt =
    `Perform financial audit: ${JSON.stringify(transactions.slice(0, 50))}. ` +
    `Return STRICT JSON only: { "summary": string, "riskAssessment": string, "growthTip": string }.`;
  return callAIJsonWithRetry<any>(prompt, null);
};

export const runPayrollAudit = async (employees: Employee[]): Promise<PayrollAudit> => {
  const prompt =
    `Audit payroll: ${JSON.stringify(employees)}. Detect anomalies. ` +
    `Return STRICT JSON only: { "complianceScore": number, "ghostEmployees": number, "salaryVariance": number, "taxLiabilityForecast": number, "recommendations": string[] }.`;
  return callAIJsonWithRetry<PayrollAudit>(prompt, {
    complianceScore: 100,
    ghostEmployees: 0,
    salaryVariance: 0,
    taxLiabilityForecast: 0,
    recommendations: [],
  });
};

export const forecastLiquidity = async (sources: LiquiditySource[]): Promise<TreasuryForecast> => {
  const prompt =
    `Forecast entity runway: ${JSON.stringify(sources)}. ` +
    `Return STRICT JSON only: { "runwayMonths": number, "burnRate": number, "suggestedAction": string, "hedgingOpportunity": boolean }.`;
  return callAIJsonWithRetry<TreasuryForecast>(prompt, {
    runwayMonths: 12,
    burnRate: 10000,
    suggestedAction: "Hold",
    hedgingOpportunity: false,
  });
};
