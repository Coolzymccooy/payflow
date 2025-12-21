# Payflow OS - Institutional Terminal

Payflow OS is a high-performance, AI-native operating system for global commerce, treasury management, and workforce governance.

## 🚀 Deployment Guide

### 1. Prerequisites
- **Node.js**: v18+
- **API Key**: A valid Gemini API Key (Gemini 2.5/3 series)

### 2. Environment Setup
The application requires the API key to be available via `process.env.API_KEY`. 

```bash
# Unix/macOS
export API_KEY=your_key_here

# Windows
set API_KEY=your_key_here
```

### 3. Execution
The system operates on a bimodal architecture:

**A. Backend (Persistence & Logic):**
```bash
npm install express cors
node server.ts
```

**B. Frontend (UI/UX):**
Serve the root directory using a development server (e.g., `vite` or `live-server`).
```bash
npm install
npm run dev
```

## 🏗️ Technical Architecture

- **Core**: React 19 (ESM)
- **Styling**: Tailwind CSS (Industrial Role-based palette)
- **Intelligence**: Gemini-3-Flash / Pro (Oracle Reasoning)
- **Infrastructure**: Distributed HSM-inspired signing logic
- **Charts**: Recharts (High-fidelity telemetry)

## 🛡️ Security Protocols
- **AES-256-GCM**: All session data is simulated as encrypted via local hardware enclaves.
- **Bilateral Handshakes**: Cross-border trades require multi-sig authorization via the Governance Console.
- **Oracle Verification**: Documents uploaded to the Compliance Sentinel are parsed via Gemini Vision for authenticity.

---
© 2025 TIWATON GLOBAL INC. // SECURE_MESH_v4.1