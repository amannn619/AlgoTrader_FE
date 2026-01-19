export interface Trigger {
    action: "BUY" | "SELL" | "HOLD";
    stockPrice: number;
    sensexPrice: number;
    lastStockPrice: number;
    lastSensexPrice: number;
    timestamp: number;
}

