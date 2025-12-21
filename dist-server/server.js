import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
/**
 * PAYFLOW OS - LIQUIDITY ORCHESTRATOR v3.9
 * ---------------------------------------
 * Core Logic: Global Market Sync & Persistence
 */
process.on("uncaughtException", (e) => console.error("UNCAUGHT_EXCEPTION", e));
process.on("unhandledRejection", (e) => console.error("UNHANDLED_REJECTION", e));
process.on("exit", (code) => console.log("PROCESS_EXIT", code));
const isProd = process.env.NODE_ENV === "production";
// In production, bind to 0.0.0.0 so it’s reachable externally (Render/Azure/etc)
// In dev, keep it local.
const HOST = process.env.HOST || (isProd ? "0.0.0.0" : "127.0.0.1");
const PORT = Number(process.env.PORT || 5051);
//const HOST = process.env.HOST || "127.0.0.1";
//const PORT = Number(process.env.PORT || 5051);
const app = express();
/** Middleware */
app.use(cors());
app.use(express.json());
/** --- PERSISTENT DB SIMULATION --- */
let db = {
    regions: [
        {
            id: "REG-NG",
            name: "Nigeria (West Africa)",
            code: "NG",
            currency: "NGN",
            fxRate: 1485.5,
            status: "ACTIVE",
            compliance: "VERIFIED",
            rails: ["Bank", "Mobile Money"],
        },
        {
            id: "REG-UK",
            name: "United Kingdom",
            code: "UK",
            currency: "GBP",
            fxRate: 0.79,
            status: "ACTIVE",
            compliance: "VERIFIED",
            rails: ["Bank", "Card"],
        },
        {
            id: "REG-US",
            name: "United States",
            code: "US",
            currency: "USD",
            fxRate: 1.0,
            status: "ACTIVE",
            compliance: "VERIFIED",
            rails: ["Bank", "Wire"],
        },
    ],
    approvals: [
        {
            id: "APP-102",
            type: "BANK_ACCOUNT",
            requester: "Sarah Smith",
            details: "Link Chase Business (****8821) for USD Payouts",
            timestamp: new Date().toISOString(),
            status: "PENDING",
            severity: "MEDIUM",
        },
    ],
    partnerships: [],
    transactions: [],
    collections: [],
    employees: [],
    wallets: [
        { umbrellaId: "GLB-HQ", currency: "USD", balance: 1842500.0 },
        { umbrellaId: "GLB-HQ", currency: "NGN", balance: 45000000.0 },
    ],
    webhookEvents: [],
};
/** --- MIDDLEWARE --- */
const authenticate = (req, res, next) => {
    try {
        const umbrellaId = req.headers["x-umbrella-id"];
        if (!umbrellaId)
            return res.status(401).json({ error: "AUTH_REQUIRED" });
        req.scope = { umbrellaId };
        return next();
    }
    catch {
        return res.status(401).json({ error: "AUTH_FAILED" });
    }
};
/** --- ROUTES --- */
// Health
app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
});
// Regions
app.get("/api/regions", authenticate, (_req, res) => res.json(db.regions));
app.post("/api/regions", authenticate, (req, res) => {
    const newRegion = {
        id: `REG-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        ...req.body,
        status: "ACTIVE",
        fxRate: 1.0 + Math.random(),
    };
    db.regions.push(newRegion);
    res.json(db.regions);
});
app.patch("/api/regions/:id/toggle", authenticate, (req, res) => {
    const { id } = req.params;
    const region = db.regions.find((r) => r.id === id);
    if (region)
        region.status = region.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    res.json({ success: true, region });
});
app.post("/api/regions/:id/rails", authenticate, (req, res) => {
    const { id } = req.params;
    const { railName } = req.body;
    const region = db.regions.find((r) => r.id === id);
    if (region && railName && !region.rails.includes(railName))
        region.rails.push(railName);
    res.json(db.regions);
});
app.delete("/api/regions/:id/rails/:rail", authenticate, (req, res) => {
    const { id, rail } = req.params;
    const region = db.regions.find((r) => r.id === id);
    if (region)
        region.rails = region.rails.filter((r) => r !== rail);
    res.json({ success: true });
});
// Approvals
app.get("/api/approvals", authenticate, (_req, res) => res.json(db.approvals));
app.post("/api/approvals/request", authenticate, (req, res) => {
    const newReq = {
        id: `APP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        ...req.body,
        timestamp: new Date().toISOString(),
        status: "PENDING",
    };
    db.approvals.push(newReq);
    res.json({ success: true, request: newReq });
});
app.patch("/api/approvals/:id", authenticate, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const index = db.approvals.findIndex((a) => a.id === id);
    if (index === -1)
        return res.status(404).json({ error: "NOT_FOUND" });
    db.approvals[index].status = status;
    res.json({ success: true, approval: db.approvals[index] });
});
// Collections / Transactions / Trades
app.get("/api/collections", authenticate, (_req, res) => res.json(db.collections));
app.post("/api/collections", authenticate, (req, res) => {
    db.collections = req.body.collections;
    res.json({ success: true });
});
app.post("/api/transactions/update", authenticate, (req, res) => {
    db.transactions.unshift(req.body);
    res.json({ success: true });
});
app.post("/api/trades/execute", authenticate, (req, res) => {
    const event = {
        id: `EV-${Date.now()}`,
        type: "trade.executed",
        payload: req.body,
        status: "DELIVERED",
        timestamp: new Date().toISOString(),
        targetUrl: "https://webhook.site",
    };
    db.webhookEvents.unshift(event);
    res.json({ success: true, delta: 120.5, event });
});
app.get("/api/webhooks", authenticate, (_req, res) => res.json(db.webhookEvents));
// Employees
app.get("/api/employees", authenticate, (_req, res) => res.json(db.employees));
// Partnerships
app.post("/api/strategic/bind", authenticate, (req, res) => {
    const partnership = {
        id: `PART-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        ...req.body,
        timestamp: new Date().toISOString(),
        status: "ACTIVE",
    };
    db.partnerships.unshift(partnership);
    res.json({ success: true, partnership });
});
// AI Insights
// AI Insights
app.post("/api/ai/insights", authenticate, async (req, res) => {
    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey)
            return res.status(500).json({ error: "MISSING_API_KEY" });
        const { prompt } = req.body || {};
        if (!prompt)
            return res.status(400).json({ error: "PROMPT_REQUIRED" });
        const ai = new GoogleGenAI({ apiKey });
        const result = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const text = result.candidates?.[0]?.content?.parts
            ?.map((p) => p?.text ?? "")
            .join("")
            .trim() || "";
        return res.json({ success: true, text });
    }
    catch (err) {
        console.error("AI INSIGHTS ERROR:", err);
        return res.status(500).json({
            error: "AI_INSIGHTS_FAILED",
            message: err?.message || "Unknown error",
        });
    }
});
// --- Serve frontend build when dist exists (production-like behavior) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// We serve the Vite build output from <projectRoot>/dist.
// Using process.cwd() keeps this correct both in dev (tsx server.ts) and
// in production (node dist-server/server.js).
const projectRoot = process.cwd();
const distPath = path.resolve(projectRoot, "dist");
console.log("STATIC_CHECK", { distPath, distExists: fs.existsSync(distPath) });
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // SPA fallback (Express 5 safe) — do NOT catch /api/*
    app.get(/^(?!\/api\/).*/, (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
    });
}
else {
    console.warn("⚠️ dist/ not found at:", distPath);
    console.warn("Run `npm run build` to generate dist/ for production serving.");
}
/** --- SERVER (robust) --- */
const server = http.createServer(app);
function logBoot() {
    console.log("ABOUT_TO_LISTEN", {
        HOST,
        PORT,
        envHOST: process.env.HOST,
        envPORT: process.env.PORT,
        node: process.version,
        cwd: process.cwd(),
    });
}
server.on("error", (err) => {
    console.error("SERVER_LISTEN_ERROR", {
        code: err?.code,
        message: err?.message,
        host: HOST,
        port: PORT,
    });
});
logBoot();
server.listen(PORT, HOST, () => {
    console.log("SERVER_LISTENING_CONFIRMED", server.address());
    console.log(`API health: http://${HOST}:${PORT}/api/health`);
});
//# sourceMappingURL=server.js.map