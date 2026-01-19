export interface Stock {
    symbol: string;
    currPrice: number;
    basePrice: number;
    lastDirection: "UP" | "DOWN" | "NEUTRAL";
    lastTriggerTime: number | null;
    triggersToday: number
}
