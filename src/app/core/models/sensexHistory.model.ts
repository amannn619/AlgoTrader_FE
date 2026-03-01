export interface SensexHistory {
    currPrice: number;
    basePrice: number;
    lastDirection: string;
    lastTriggerTime: number | null;
    timeStamp: number
}