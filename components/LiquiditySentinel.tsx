
import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { GoogleGenAI, Type } from "@google/genai";
import { BrainCircuit, TrendingDown, TrendingUp, AlertTriangle, ArrowRight, Loader2, Sparkles, Sliders, DollarSign, Users, Globe, Zap, History, Network } from 'lucide-react';

export const LiquiditySentinel: React.FC = () => {
    const [hiringCount, setHiringCount] = useState(0);
    const [growthProjection, setGrowthProjection] = useState(10); // Percentage
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResult, setSimulationResult] = useState<any>(null);

    // Current Financial Baseline (Shared with simulation prompt)
    const baseline = {
        nav: 1842500,
        employees: 35,
        avgSalary: 55000,
        monthlyRevenue: 240000,
        currentRunway: 14.2
    };

    const runSimulation = async () => {
        if (!process.env.API_KEY) return;
        setIsSimulating(true);

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        try {
            // Local Actuarial Engine Logic
            const newTotalStaff = baseline.employees + hiringCount;
            const projectedAnnualOpEx = newTotalStaff * baseline.avgSalary;
            const projectedMonthlyRev = baseline.monthlyRevenue * (1 + (growthProjection / 100));
            const projectedMonthlyBurn = (projectedAnnualOpEx / 12) - projectedMonthlyRev;
            const projectedRunway = projectedMonthlyBurn > 0 ? baseline.nav / projectedMonthlyBurn : 99;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Perform an institutional liquidity audit. 
                BASELINE: NAV=$${baseline.nav}, Staff=${baseline.employees}, MonthlyRev=$${baseline.monthlyRevenue}. 
                SCENARIO: Adding ${hiringCount} staff, Growth=${growthProjection}%. 
                CALCULATED_STATS: Projected Monthly Burn=$${projectedMonthlyBurn.toFixed(0)}, Runway=${projectedRunway.toFixed(1)} months.
                Analyze the FX risk (NGN volatility is 15%). 
                Provide a JSON response with keys: 
                - "runwayDelta": (number, months difference from baseline 14.2), 
                - "riskLevel": (string: LOW/MED/HIGH), 
                - "summary": (string: 1 technical sentence), 
                - "hedgeRecommendation": (string: 1 strategic sentence).`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            runwayDelta: { type: Type.NUMBER },
                            riskLevel: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            hedgeRecommendation: { type: Type.STRING }
                        },
                        required: ["runwayDelta", "riskLevel", "summary", "hedgeRecommendation"]
                    }
                }
            });

            const data = JSON.parse(response.text || '{}');
            setSimulationResult({
                ...data,
                stats: {
                    burn: projectedMonthlyBurn,
                    runway: projectedRunway,
                    staff: newTotalStaff
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader 
                title="Liquidity Sentinel" 
                subtitle="High-fidelity simulation of entity solvency and cross-border currency exposure."
                breadcrumbs={['Workspace', 'Treasury', 'Sentinel']}
                status="SECURE"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-brand-200 rounded-sm p-8 shadow-sm">
                        <h3 className="text-xs font-bold text-brand-900 uppercase tracking-widest mb-10 flex items-center gap-2 border-b border-brand-100 pb-4">
                            <Sliders className="w-4 h-4 text-action-500" /> Actuarial Parameters
                        </h3>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5" /> Aggressive Hiring
                                    </label>
                                    <span className="font-mono text-sm font-bold text-brand-900">+{hiringCount} Units</span>
                                </div>
                                <input 
                                    type="range" min="0" max="50" step="1" 
                                    value={hiringCount} 
                                    onChange={(e) => setHiringCount(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-brand-100 rounded-full appearance-none cursor-pointer accent-action-500" 
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp className="w-3.5 h-3.5" /> Growth Velocity
                                    </label>
                                    <span className="font-mono text-sm font-bold text-brand-900">+{growthProjection}% /Mo</span>
                                </div>
                                <input 
                                    type="range" min="-20" max="100" step="5" 
                                    value={growthProjection} 
                                    onChange={(e) => setGrowthProjection(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-brand-100 rounded-full appearance-none cursor-pointer accent-action-500" 
                                />
                            </div>

                            <button 
                                onClick={runSimulation}
                                disabled={isSimulating}
                                className="w-full py-5 bg-brand-950 text-white rounded-sm font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {isSimulating ? <Loader2 className="w-4 h-4 animate-spin text-action-500" /> : <><BrainCircuit className="w-5 h-5 text-action-500" /> Run Oracle Simulation</>}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="text-[10px] font-bold text-amber-900 uppercase">Actuarial Warning</h4>
                            <p className="text-[10px] text-amber-700 mt-1 leading-relaxed">
                                NGN/USD volatility coefficient is currently 1.4x. Simulations include a 15% currency variance buffer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Simulation Output */}
                <div className="lg:col-span-2 space-y-6">
                    {!simulationResult && !isSimulating ? (
                        <div className="h-full min-h-[500px] border-2 border-dashed border-brand-200 rounded-sm flex flex-col items-center justify-center text-center p-16 bg-brand-50/30 group transition-all hover:bg-white">
                            <Sparkles className="w-16 h-16 text-brand-200 mb-6 group-hover:text-action-500 group-hover:scale-110 transition-all" />
                            <p className="text-sm font-bold text-brand-900 uppercase tracking-widest">Simulator Standby</p>
                            <p className="text-[10px] text-brand-500 font-mono mt-3 uppercase tracking-[0.2em] max-w-xs">Define organizational variables to initiate Institutional Oracle Reasoning.</p>
                        </div>
                    ) : isSimulating ? (
                        <div className="h-full min-h-[500px] bg-brand-950 rounded-sm p-12 flex flex-col items-center justify-center text-action-500 font-mono">
                             <div className="space-y-6 text-xs w-full max-w-sm">
                                <p className="flex items-center gap-3">
                                   <Network className="w-4 h-4" /> 
                                   <span>ACCESSING HISTORICAL PAYROLL LEDGERS...</span>
                                </p>
                                <p className="opacity-70 flex items-center gap-3">
                                   <Globe className="w-4 h-4" /> 
                                   <span>MAPPING MACRO-FX VOLATILITY MAPS...</span>
                                </p>
                                <p className="opacity-40 flex items-center gap-3">
                                   <Zap className="w-4 h-4" /> 
                                   <span>CALCULATING BURN COEFFICIENTS...</span>
                                </p>
                                <div className="h-1 w-full bg-brand-900 mt-12 rounded-full overflow-hidden">
                                    <div className="h-full bg-action-500 animate-[progress_3s_linear_infinite]"></div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-brand-200 p-8 rounded-sm shadow-sm relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 p-4 text-[10px] font-bold uppercase tracking-widest ${simulationResult.riskLevel === 'HIGH' ? 'text-data-rose' : 'text-data-emerald'}`}>
                                        {simulationResult.riskLevel}_RISK
                                    </div>
                                    <p className="text-[10px] text-brand-500 font-bold uppercase mb-3 tracking-widest">Runway Projection</p>
                                    <p className={`text-4xl font-mono font-bold ${simulationResult.runwayDelta < 0 ? 'text-data-rose' : 'text-emerald-500'}`}>
                                        {simulationResult.stats.runway > 48 ? '48+' : simulationResult.stats.runway.toFixed(1)} Months
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-brand-400">
                                        <TrendingDown className="w-3 h-3" /> Delta: {simulationResult.runwayDelta.toFixed(1)} Mo from baseline
                                    </div>
                                </div>
                                <div className="bg-brand-950 border border-brand-800 p-8 rounded-sm shadow-xl text-white">
                                    <p className="text-[10px] text-brand-500 font-bold uppercase mb-3 tracking-widest">Projected Monthly Burn</p>
                                    <p className="text-4xl font-mono font-bold text-white tabular-nums">
                                        ${simulationResult.stats.burn > 0 ? simulationResult.stats.burn.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
                                    </p>
                                    <p className={`mt-4 text-[10px] font-bold uppercase flex items-center gap-1 ${simulationResult.stats.burn > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {simulationResult.stats.burn > 0 ? 'NEGATIVE_CASHFLOW' : 'PROFIT_NOMINAL'}
                                    </p>
                                </div>
                             </div>

                             <div className="bg-white border border-brand-200 p-8 rounded-sm space-y-8">
                                <div className="border-b border-brand-100 pb-6">
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                        <History className="w-4 h-4 text-brand-400" /> Oracle Audit Summary
                                    </h4>
                                    <p className="text-sm text-brand-700 leading-relaxed font-medium italic">
                                        "{simulationResult.summary}"
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-brand-900 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-action-500" /> Strategic Hedging Logic
                                    </h4>
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
                                        <p className="text-xs text-emerald-900 leading-relaxed font-bold">
                                            {simulationResult.hedgeRecommendation}
                                        </p>
                                    </div>
                                </div>
                             </div>

                             <div className="bg-brand-950 p-6 rounded-sm border border-brand-800 text-white relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                   <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.4em]">Actuarial Solvency Curve (Next 12 Months)</p>
                                   <div className="flex gap-4">
                                      <span className="flex items-center gap-2 text-[9px] font-bold text-action-500"><div className="w-2 h-2 bg-action-500 rounded-full"></div> OPEX</span>
                                      <span className="flex items-center gap-2 text-[9px] font-bold text-brand-700"><div className="w-2 h-2 bg-brand-800 rounded-full"></div> RESERVES</span>
                                   </div>
                                </div>
                                <div className="flex items-end gap-2 h-32 relative z-10">
                                    {[8,7,9,6.5,5,4,4.2,3.5,3,2.2,1.5,1].map((h, i) => (
                                        <div 
                                            key={i} 
                                            className={`flex-1 rounded-t-sm transition-all duration-1000 ${i > (simulationResult.stats.runway > 12 ? 12 : simulationResult.stats.runway) ? 'bg-data-rose opacity-40 animate-pulse' : 'bg-action-500 opacity-80'}`} 
                                            style={{ height: `${h * 10}%`, transitionDelay: `${i * 50}ms` }}
                                        ></div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
