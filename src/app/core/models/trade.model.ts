export interface Trade {
    symbol: string;
    action: "BUY" | "SELL";
    price: number;
    qty: number;
    pnl: number
    timestamp: number;
}
