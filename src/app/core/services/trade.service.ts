import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Trade } from '../models/trade.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private baseUrl = `${environment.apiUrl}/trades`;
  private tradesExecuted: number = 0

  private reloadSubject: Subject<void> = new Subject();
  public reloadTrade$: Observable<void> = this.reloadSubject.asObservable()

  constructor(private http: HttpClient) { }

  getAllTrades(page: number, limit: number, actions: string[], symbols: string[]): Observable<{
    items: Trade[];
    total: number;
  }> {

    const params: any = {
      page,
      limit
    };

    if (actions.length) {
      params.actions = actions.join(',');
    }

    if (symbols.length) {
      params.symbols = symbols.join(',');
    }

    return this.http.get<{
      items: Trade[];
      total: number;
    }>(`${this.baseUrl}`, { params });
  }

  getTrades(symbol: string, page: number, limit: number, actions: string[]): Observable<{
    items: Trade[];
    total: number;
  }> {

    const params: any = {
      page,
      limit
    };

    if (actions.length) {
      params.actions = actions.join(',');
    }

    return this.http.get<{
      items: Trade[];
      total: number;
    }>(`${this.baseUrl}/${symbol}`, { params });
  }

  addTrade() {
    this.tradesExecuted += 1;
    if (this.tradesExecuted >= 3) {
      this.tradesExecuted = 0;
      this.reloadSubject.next()
    }
  }


}
