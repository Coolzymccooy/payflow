
import React, { useState } from 'react';
import { Transaction } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { Terminal, TrendingUp, AlertTriangle, Lightbulb, Activity, ArrowRight } from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
}


const PROMPT = ">>> ";

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    summary: string;
    riskAssessment: string;
    growthTip: string;
  } | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeFinancials(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-100 pb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-action-500" />
            System Intelligence
          </h2>
          <p className="text-brand-500 text-sm mt-1">Heuristic analysis of transaction ledger.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-action-500 hover:bg-action-600 text-white px-4 py-2 rounded-sm text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-sm"
        >
          {loading ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              RUN DIAGNOSTICS
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="bg-brand-50 border border-dashed border-brand-200 rounded-sm p-12 text-center">
          <Terminal className="w-8 h-8 mx-auto mb-4 text-brand-300" />
          <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wide mb-2">Awaiting Input</h3>
          <p className="text-brand-500 text-sm font-mono max-w-md mx-auto mb-6">
            {PROMPT}SYSTEM READY.<br />
            {PROMPT}INITIATE SCAN TO DETECT PATTERNS & RISK VECTORS.
          </p>
        </div>
      )}

      {loading && (
        <div className="bg-brand-950 text-action-500 p-6 rounded-sm font-mono text-sm space-y-2 h-64 overflow-hidden relative shadow-inner">
          <p>&gt;&gt;&gt;ESTABLISHING UPLINK TO GEMINI-3-FLASH...</p>
          <p className="opacity-70 text-action-600">{PROMPT}PARSING LEDGER DATA ({transactions.length} ENTRIES)...</p>
          <p className="opacity-50 text-action-900">{PROMPT}CALCULATING RISK VECTORS...</p>
          <p className="opacity-30 text-action-900">{PROMPT}GENERATING GROWTH HEURISTICS...</p>
          <div className="absolute bottom-4 left-6 animate-pulse text-action-500">_</div>
        </div>
      )}

      {analysis && !loading && (
        <div className="grid grid-cols-1 gap-4 font-mono text-sm">
          {/* Summary Section */}
          <div className="bg-white p-5 rounded-sm border border-brand-100 shadow-sm border-t-4 border-t-brand-200">
            <div className="flex items-center gap-2 mb-3 border-b border-brand-100 pb-2">
              <TrendingUp className="w-4 h-4 text-brand-900" />
              <h3 className="font-bold text-brand-900 uppercase">Executive Summary</h3>
            </div>
            <p className="text-brand-700 leading-relaxed">{analysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Risk Section - Rule 3.1 Warning Color used sparingly */}
            <div className="bg-white p-5 rounded-sm border border-brand-100 border-t-4 border-t-data-rose hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-3 border-b border-brand-100 pb-2">
                <AlertTriangle className="w-4 h-4 text-data-rose" />
                <h3 className="font-bold text-brand-900 uppercase">Risk Vectors</h3>
              </div>
              <p className="text-brand-700 leading-relaxed">{analysis.riskAssessment}</p>
            </div>

            {/* Growth Section - Rule 3.1 Reward Color */}
            <div className="bg-white p-5 rounded-sm border border-brand-100 border-t-4 border-t-data-emerald hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-2 mb-3 border-b border-brand-100 pb-2">
                <Lightbulb className="w-4 h-4 text-data-emerald" />
                <h3 className="font-bold text-brand-900 uppercase">Growth Heuristic</h3>
              </div>
              <p className="text-brand-700 leading-relaxed">{analysis.growthTip}</p>
            </div>
          </div>
          
          <div className="text-right text-[10px] text-brand-400 uppercase tracking-widest mt-2 border-t border-brand-100 pt-2">
            Generated by Gemini-3-Flash // {new Date().toISOString()}
          </div>
        </div>
      )}
    </div>
  );
};
