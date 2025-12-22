import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transaction } from "../types";
import {
  BrainCircuit,
  CheckCircle2,
  MessageSquare,
  Mic,
  MicOff,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

/**
 * ✅ Fixes included
 * - Mic permission prompt runs ONLY on user click (required by browsers).
 * - Works on localhost; shows a clear message if you're on LAN IP (often NOT a secure context).
 * - SpeechRecognition types fixed (TS-safe) and gracefully falls back if unsupported.
 * - AI buttons call the backend via Vite proxy: POST /api/ai/insights (no hardcoded host).
 * - 401 issues handled with a clear message; sends x-umbrella-id by default.
 * - JSX click issues prevented: buttons have type="button" unless submit.
 */

/* ----------------------------- Web Speech types ---------------------------- */
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

type InsightAction = "TRADE" | "CONTACT" | "BREAKDOWN" | "ASSUMPTIONS" | null;

type Tab = "INSIGHTS" | "ORACLE";

type AIInsightsOk = {
  ok: true;
  text: string;
  status?: number;
  raw?: unknown;
};

type AIInsightsErr = {
  ok: false;
  error: string;
  status?: number;
  raw?: unknown;
};

type AIInsightsResponse = AIInsightsOk | AIInsightsErr;

function getSpeechRecognitionCtor(): any | null {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function isLocalhost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

async function postAIInsights(payload: {
  prompt: string;
  mode: "oracle" | "insights";
  context?: unknown;
}): Promise<AIInsightsResponse> {
  // ✅ Use Vite proxy: do NOT hardcode http://127.0.0.1:5051 here.
  const url = "/api/ai/insights";

  // Many backends reject requests without a tenant/org header.
  // Your earlier calls used x-umbrella-id (e.g. GLB-HQ). Keep that here to avoid 401.
  const umbrellaId =
    (import.meta as any)?.env?.VITE_UMBRELLA_ID ||
    localStorage.getItem("umbrellaId") ||
    "GLB-HQ";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-umbrella-id": umbrellaId,
      },
      body: JSON.stringify(payload),
    });

    const status = res.status;

    // Try json first, then text
    const contentType = res.headers.get("content-type") || "";
    const data =
      contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      const msg =
        (typeof data === "string" && data) ||
        (data && (data.error || data.message)) ||
        (status === 401
          ? "Unauthorized (401). Missing/invalid x-umbrella-id or backend auth."
          : `Request failed (HTTP ${status}).`);
      return { ok: false, error: String(msg), status, raw: data };
    }

    const text =
      (typeof data === "string" && data) ||
      (data && (data.text || data.response || data.result)) ||
      "";

    return { ok: true, text: String(text || ""), status, raw: data };
  } catch (e: any) {
    return { ok: false, error: e?.message ? String(e.message) : "Network error", raw: e };
  }
}

export const AIInsights: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState<Tab>("INSIGHTS");

  // Oracle text + AI
  const [oracleQuery, setOracleQuery] = useState("");
  const [oracleResponse, setOracleResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Voice UX
  const [micState, setMicState] = useState<"idle" | "requesting" | "listening" | "blocked" | "unsupported">("idle");
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);

  // Action modal
  const [activeAction, setActiveAction] = useState<InsightAction>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const txContext = useMemo(() => {
    // Keep context small to avoid huge payloads / timeouts
    const small = transactions?.slice?.(0, 50) ?? [];
    return {
      transactions: small,
      totals: {
        count: small.length,
      },
    };
  }, [transactions]);

  // Cleanup recognition + stream on unmount
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop?.();
      } catch {}
      try {
        liveStreamRef.current?.getTracks?.().forEach((t) => t.stop());
      } catch {}
    };
  }, []);

  const requestMicPermission = useCallback(async () => {
    setVoiceHint(null);

    // 🔒 LAN IP on http is usually not secure => mic prompt often blocked
    const hostname = window.location.hostname;
    if (!window.isSecureContext && !isLocalhost(hostname)) {
      setMicState("blocked");
      setVoiceHint(
        "Microphone requires a secure context. Use http://localhost:5173 OR run HTTPS for LAN testing."
      );
      return false;
    }

    try {
      setMicState("requesting");
      // Must be called from a user gesture (button click)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveStreamRef.current = stream;

      // Immediately stop tracks (we only needed permission)
      stream.getTracks().forEach((t) => t.stop());
      liveStreamRef.current = null;

      setMicState("idle");
      return true;
    } catch (err: any) {
      setMicState("blocked");
      const msg =
        err?.name === "NotAllowedError"
          ? "Permission denied. Allow microphone access in the browser site settings."
          : err?.name === "NotFoundError"
          ? "No microphone found on this device."
          : err?.message
          ? String(err.message)
          : "Microphone permission failed.";
      setVoiceHint(msg);
      return false;
    }
  }, []);

  const startOracleVoice = useCallback(async () => {
    setVoiceHint(null);

    const ctor = getSpeechRecognitionCtor();
    if (!ctor) {
      // If SpeechRecognition isn't available, you can still do mic permission only.
      setMicState("unsupported");
      setVoiceHint(
        "Speech recognition isn’t supported in this browser. Try Chrome/Edge. (Mic permission can still be granted.)"
      );
      // Still prompt mic permission so user sees the browser prompt
      await requestMicPermission();
      return;
    }

    // Ensure permission prompt happens from click
    const permitted = await requestMicPermission();
    if (!permitted) return;

    try {
      // Stop any existing session
      try {
        recognitionRef.current?.stop?.();
      } catch {}

      const rec = new ctor();
      recognitionRef.current = rec;

      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-GB";

      let finalText = "";

      rec.onstart = () => {
        setMicState("listening");
        setVoiceHint("Listening… speak now.");
      };

      rec.onerror = (ev: any) => {
        setMicState("idle");
        const code = ev?.error ? String(ev.error) : "speech_error";
        setVoiceHint(
          code === "not-allowed"
            ? "Speech permission blocked. Allow mic + speech permissions in browser settings."
            : `Speech error: ${code}`
        );
      };

      rec.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const chunk = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) finalText += chunk;
          else interim += chunk;
        }
        const next = (finalText || interim).trim();
        if (next) setOracleQuery(next);
      };

      rec.onend = () => {
        setMicState("idle");
        setVoiceHint(null);
      };

      rec.start();
    } catch (e: any) {
      setMicState("idle");
      setVoiceHint(e?.message ? String(e.message) : "Could not start voice recognition.");
    }
  }, [requestMicPermission]);

  const stopOracleVoice = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setMicState("idle");
    setVoiceHint(null);
  }, []);

  const handleAskOracle = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!oracleQuery.trim() || isThinking) return;

      setIsThinking(true);
      setOracleResponse(null);

      const result = await postAIInsights({
        prompt: oracleQuery.trim(),
        mode: "oracle",
        context: txContext,
      });

      if (result.ok) {
        setOracleResponse(result.text || "✅ Done.");
      } else {
  const err =
    (result as { ok: false; error?: string; status?: number }).error ??
    "Unknown error";

  const status = (result as { ok: false; error?: string; status?: number }).status;

  setOracleResponse(
    `⚠️ AI request failed: ${err}${status ? ` (HTTP ${status})` : ""}`
  );
}

      setIsThinking(false);
    },
    [oracleQuery, isThinking, txContext]
  );

  const runInsights = useCallback(async () => {
    if (isThinking) return;
    setIsThinking(true);
    setOracleResponse(null);

    const result = await postAIInsights({
      prompt: "Generate key Payflow Remit insights and anomalies from the recent transactions.",
      mode: "insights",
      context: txContext,
    });

    if (result.ok) setOracleResponse(result.text || "✅ Insights ready.");
     else {
  const err =
    (result as { ok: false; error?: string; status?: number }).error ??
    "Unknown error";

  const status = (result as { ok: false; error?: string; status?: number }).status;

  setOracleResponse(
    `⚠️ AI request failed: ${err}${status ? ` (HTTP ${status})` : ""}`
  );
}

    setIsThinking(false);
    setActiveTab("ORACLE");
  }, [isThinking, txContext]);

  const triggerAction = useCallback(async (type: InsightAction) => {
    setActiveAction(type);
    setActionSuccess(false);
    setIsProcessingAction(true);

    const promptMap: Record<Exclude<InsightAction, null>, string> = {
      TRADE: "Create a trade recommendation based on current remit flows and spread opportunities.",
      CONTACT: "Draft a customer contact message for a delayed transfer with empathy and clarity.",
      BREAKDOWN: "Break down the last 20 transactions: anomalies, likely causes, and next actions.",
      ASSUMPTIONS: "List assumptions made in recent insights and what data would validate them.",
    };

    const result = await postAIInsights({
      prompt: promptMap[type as Exclude<InsightAction, null>] || "Provide the requested action output.",
      mode: "insights",
      context: txContext,
    });

    setIsProcessingAction(false);

    if (result.ok) {
      setOracleResponse(result.text || "✅ Done.");
      setActionSuccess(true);
    } else {
  const err =
    (result as { ok: false; error?: string; status?: number }).error ??
    "Unknown error";

  const status = (result as { ok: false; error?: string; status?: number }).status;

  setOracleResponse(
    `⚠️ AI request failed: ${err}${status ? ` (HTTP ${status})` : ""}`
  );;
    }
  }, [txContext]);

  const closeActionModal = useCallback(() => {
    setActiveAction(null);
    setIsProcessingAction(false);
    setActionSuccess(false);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-brand-700" />
          <div className="font-semibold tracking-wide">AI Insights</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("INSIGHTS")}
            className={`px-3 py-2 rounded-md text-xs font-bold tracking-widest ${
              activeTab === "INSIGHTS" ? "bg-brand-900 text-white" : "bg-white border border-brand-200 text-brand-800"
            }`}
          >
            INSIGHTS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ORACLE")}
            className={`px-3 py-2 rounded-md text-xs font-bold tracking-widest ${
              activeTab === "ORACLE" ? "bg-brand-900 text-white" : "bg-white border border-brand-200 text-brand-800"
            }`}
          >
            ORACLE
          </button>
        </div>
      </div>

      {/* Tabs */}
      {activeTab === "INSIGHTS" ? (
        <div className="bg-white border border-brand-100 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-brand-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                One-click Insights
              </div>
              <div className="text-xs text-brand-600 mt-1">
                Uses your Vite proxy <span className="font-mono">/api/ai/insights</span> (DEV_API_TARGET should point to{" "}
                <span className="font-mono">http://127.0.0.1:5051</span>)
              </div>
            </div>

            <button
              type="button"
              onClick={runInsights}
              disabled={isThinking}
              className="px-3 py-2 rounded-md bg-brand-900 text-white text-xs font-bold tracking-widest disabled:opacity-60"
            >
              {isThinking ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> RUNNING
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Search className="w-4 h-4" /> RUN
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={() => triggerAction("BREAKDOWN")}
              className="text-left p-4 rounded-xl border border-brand-100 hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                <BrainCircuit className="w-4 h-4" /> Transaction Breakdown
              </div>
              <div className="text-xs text-brand-600 mt-1">Explain patterns and anomalies from recent activity.</div>
            </button>

            <button
              type="button"
              onClick={() => triggerAction("CONTACT")}
              className="text-left p-4 rounded-xl border border-brand-100 hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                <MessageSquare className="w-4 h-4" /> Customer Contact Draft
              </div>
              <div className="text-xs text-brand-600 mt-1">Generate a clear, empathetic customer message.</div>
            </button>

            <button
              type="button"
              onClick={() => triggerAction("TRADE")}
              className="text-left p-4 rounded-xl border border-brand-100 hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                <ShieldAlert className="w-4 h-4" /> Trade Recommendation
              </div>
              <div className="text-xs text-brand-600 mt-1">Find opportunities from spreads + flows.</div>
            </button>

            <button
              type="button"
              onClick={() => triggerAction("ASSUMPTIONS")}
              className="text-left p-4 rounded-xl border border-brand-100 hover:border-brand-300 transition"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                <Sparkles className="w-4 h-4" /> Assumptions Audit
              </div>
              <div className="text-xs text-brand-600 mt-1">List assumptions + what data confirms them.</div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-brand-100 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-brand-900">Oracle</div>
              <div className="text-xs text-brand-600 mt-1">
                Ask anything about transfers, anomalies, and operations. Voice input supported where available.
              </div>
            </div>

            {/* Oracle Voice */}
            <div className="flex items-center gap-2">
              {micState === "listening" ? (
                <button
                  type="button"
                  onClick={stopOracleVoice}
                  className="px-3 py-2 rounded-md bg-red-600 text-white text-xs font-bold tracking-widest"
                >
                  <span className="inline-flex items-center gap-2">
                    <MicOff className="w-4 h-4" /> STOP
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startOracleVoice}
                  className="px-3 py-2 rounded-md bg-brand-900 text-white text-xs font-bold tracking-widest"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mic className="w-4 h-4" /> ORACLE VOICE
                  </span>
                </button>
              )}
            </div>
          </div>

          {voiceHint && (
            <div className="mt-3 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3">
              {voiceHint}
            </div>
          )}

          <form onSubmit={handleAskOracle} className="mt-4">
            <div className="flex gap-2">
              <input
                value={oracleQuery}
                onChange={(e) => setOracleQuery(e.target.value)}
                placeholder="Ask the Oracle…"
                className="flex-1 px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button
                type="submit"
                disabled={isThinking || !oracleQuery.trim()}
                className="px-4 py-3 rounded-lg bg-brand-900 text-white font-bold text-xs tracking-widest disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <Send className="w-4 h-4" /> SEND
                </span>
              </button>
            </div>
          </form>

          {oracleResponse && (
            <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-950 whitespace-pre-wrap">
              {oracleResponse}
            </div>
          )}
        </div>
      )}

      {/* Action Modal */}
      {activeAction && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-brand-100 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-brand-100">
              <div className="font-semibold text-brand-900 text-sm">Action: {activeAction}</div>
              <button type="button" onClick={closeActionModal} className="p-2 rounded-md hover:bg-brand-50">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              {isProcessingAction ? (
                <div className="text-sm text-brand-700 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Processing…
                </div>
              ) : actionSuccess ? (
                <div className="text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Done. Check Oracle output.
                </div>
              ) : (
                <div className="text-sm text-brand-700">Ready.</div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => triggerAction(activeAction)}
                  disabled={isProcessingAction}
                  className="px-4 py-2 rounded-md bg-brand-900 text-white text-xs font-bold tracking-widest disabled:opacity-60"
                >
                  RUN
                </button>
                <button
                  type="button"
                  onClick={closeActionModal}
                  className="px-4 py-2 rounded-md border border-brand-200 text-brand-900 text-xs font-bold tracking-widest"
                >
                  CLOSE
                </button>
              </div>

              <div className="mt-3 text-[11px] text-brand-500">
                If you see <span className="font-mono">401</span> in DevTools, the backend is rejecting auth/tenant headers.
                This client sends <span className="font-mono">x-umbrella-id</span> automatically (default:{" "}
                <span className="font-mono">GLB-HQ</span>).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
