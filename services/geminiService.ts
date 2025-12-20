
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, Employee, LiquiditySource, PayrollAudit, TreasuryForecast, TradeOpportunity, MarketPulse } from "../types";

const MAX_RETRIES = 2;

/**
 * AI ORACLE RESILIENCE WRAPPER
 */
async function callAIWithRetry<T>(prompt: string, model: string, config: any, retries = MAX_RETRIES): Promise<T | null> {
  if (!process.env.API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_AI_RESPONSE");
    return JSON.parse(text) as T;
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('429') || error.message?.includes('fetch'))) {
      const delay = 2000 * (MAX_RETRIES - retries + 1);
      console.warn(`[AI_RETRY] Oracle busy. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      return callAIWithRetry(prompt, model, config, retries - 1);
    }
    console.error("[AI_ORACLE] Fatal Execution Error:", error);
    return null;
  }
}

export const analyzeTradeOpportunity = async (pulses: MarketPulse[]): Promise<TradeOpportunity[]> => {
  const prompt = `Analyze liquidity corridors. Data: ${JSON.stringify(pulses)}. Identify arbitrage or hedging. Return JSON array.`;
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          pair: { type: Type.STRING },
          action: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          expectedGain: { type: Type.STRING },
          riskFactor: { type: Type.STRING },
          confidence: { type: Type.NUMBER }
        },
        required: ["id", "pair", "action", "reasoning", "expectedGain"]
      }
    }
  };

  return await callAIWithRetry<TradeOpportunity[]>(prompt, "gemini-3-pro-preview", config) || [];
};

export const analyzeFinancials = async (transactions: Transaction[]): Promise<{
  summary: string;
  riskAssessment: string;
  growthTip: string;
}> => {
  const prompt = `Analyze financial health: ${JSON.stringify(transactions.slice(0, 50))}. Provide summary, riskAssessment, growthTip in JSON.`;
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            riskAssessment: { type: Type.STRING },
            growthTip: { type: Type.STRING },
        },
        required: ["summary", "riskAssessment", "growthTip"]
    }
  };

  const result = await callAIWithRetry<any>(prompt, "gemini-3-flash-preview", config);
  return result || { summary: "Oracle sync failed.", riskAssessment: "Unknown", growthTip: "Retry diagnostics." };
};

export const runPayrollAudit = async (employees: Employee[]): Promise<PayrollAudit> => {
  const prompt = `Audit payroll for ghost employees/anomalies: ${JSON.stringify(employees)}. Return complianceScore, ghostEmployees, salaryVariance, taxLiabilityForecast, recommendations in JSON.`;
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        complianceScore: { type: Type.NUMBER },
        ghostEmployees: { type: Type.NUMBER },
        salaryVariance: { type: Type.NUMBER },
        taxLiabilityForecast: { type: Type.NUMBER },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["complianceScore", "ghostEmployees", "salaryVariance", "recommendations"]
    }
  };

  const result = await callAIWithRetry<PayrollAudit>(prompt, "gemini-3-flash-preview", config);
  return result || { complianceScore: 0, ghostEmployees: 0, salaryVariance: 0, taxLiabilityForecast: 0, recommendations: ["System timeout."] };
};

export const forecastLiquidity = async (sources: LiquiditySource[]): Promise<TreasuryForecast> => {
  const prompt = `Forecast runway: ${JSON.stringify(sources)}. Predict runwayMonths, burnRate, suggestedAction, hedgingOpportunity in JSON.`;
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        runwayMonths: { type: Type.NUMBER },
        burnRate: { type: Type.NUMBER },
        suggestedAction: { type: Type.STRING },
        hedgingOpportunity: { type: Type.BOOLEAN }
      },
      required: ["runwayMonths", "suggestedAction"]
    }
  };

  const result = await callAIWithRetry<TreasuryForecast>(prompt, "gemini-3-flash-preview", config);
  return result || { runwayMonths: 12, burnRate: 0, suggestedAction: "Manual rebalance suggested.", hedgingOpportunity: true };
};
