import React, { useState } from "react";

type Props = {
  umbrellaId: string;              // e.g. "GLB-HQ"
  defaultPrompt?: string;
  context?: any;
};

export default function DashboardAiInsightsCard({
  umbrellaId,
  defaultPrompt = "Give me 5 actionable insights for today's treasury position. Be concise.",
  context = {},
}: Props) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-umbrella-id": umbrellaId,
        },
        body: JSON.stringify({ prompt, context }),
      });

     const raw = await res.text();          // <-- always works
     let data: any;

      try {
      data = JSON.parse(raw);
}    catch {
     throw new Error(`NON_JSON_RESPONSE (${res.status}): ${raw.slice(0, 200)}`);
}


      if (!res.ok) throw new Error(data?.message || data?.error || "Request failed");

      setAiText(data?.text || "");
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold tracking-wide text-slate-500">
            AI INSIGHTS
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-900">
            Treasury recommendations
          </div>
        </div>

        <button
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {loading ? "RUNNING..." : "RUN"}
        </button>
      </div>

      <div className="mt-3">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
          placeholder="Ask Payflow AI..."
        />
      </div>

      {err ? <div className="mt-3 text-sm text-red-600">{err}</div> : null}

      <div className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-800">
        {aiText ? aiText : "Run AI to see insights here..."}
      </div>
    </div>
  );
}
