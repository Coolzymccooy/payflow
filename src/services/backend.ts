export class BackendService {
    // In-memory simulation database
    private static transactions: any[] = [];
    private static RATE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

    static async executeRemittance(payload: any) {
        // Simulate API latency
        await new Promise(r => setTimeout(r, 1500));

        const transactionId = 'RMT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const transaction = {
            id: transactionId,
            ...payload,
            status: 'PROCESSING', // Starts as processing
            createdAt: new Date().toISOString(),
            settlementType: 'MIRROR_PROTOCOL_ATOMIC'
        };

        this.transactions.push(transaction);

        // Simulate async settlement process in background
        setTimeout(() => {
            transaction.status = 'SETTLED';
        }, 5000);

        return {
            success: true,
            remittance: transaction
        };
    }

    static async trackRemittance(id: string, phone: string) {
        // Find transaction (In production this would query DB)
        // For demo, we might need persistence or just allow retrieval of the active session
        // Since this is client-side mock for now, we can't easily persist across refreshes without LocalStorage or a real backend.
        // Let's implement LocalStorage persistence for the MVP demo.
        
        const stored = localStorage.getItem('payflow_transactions');
        const db = stored ? JSON.parse(stored) : [];
        const tx = db.find((t: any) => t.id === id); // Simple check, phone auth simulated

        if (tx) {
             return { success: true, remittance: tx };
        }
        return { success: false, error: 'NOT_FOUND' };
    }
    
    // Save to local storage for "persistence" in this demo phase
    static persistLocally(tx: any) {
        const stored = localStorage.getItem('payflow_transactions');
        const db = stored ? JSON.parse(stored) : [];
        db.push(tx);
        localStorage.setItem('payflow_transactions', JSON.stringify(db));
    }
}
