import { Injectable } from '@angular/core';
import { Stock } from '../models/stock.model';
import { Trade } from '../models/trade.model';
import { Trigger } from '../models/trigger.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StockService {

  private stocks: Record<string, Stock> = {};

  private stocksSubject = new BehaviorSubject<Record<string, Stock>>({});

  public stocks$: Observable<Record<string, Stock>> = this.stocksSubject.asObservable();



  public getStocks(): Record<string, Stock> {
    return this.stocks;
  }

  getStock$(symbol: string): Observable<Stock | undefined> {
    return this.stocks$.pipe(
      map(stocks => stocks[symbol])
    );
  }

  public update(stock: Stock) {
    this.stocks = {
      ...this.stocks,
      [stock.symbol]: {
        ...(this.stocks[stock.symbol] ?? { symbol: stock.symbol }),
        ...stock
      }
    };

    this.stocksSubject.next(this.stocks);
  }
}
