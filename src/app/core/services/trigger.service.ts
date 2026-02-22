import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trigger } from '../models/trigger.model';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  private baseUrl = `${environment.apiUrl}/triggers`;

  private realTimeTriggerSubject = new Subject<Trigger>();
  public realTimeTrigger$ = this.realTimeTriggerSubject.asObservable();

  private latestTriggersSubject = new BehaviorSubject<Trigger[]>([]);
  public latestTriggers$ = this.latestTriggersSubject.asObservable();
  private latestTriggerTotal = new BehaviorSubject<number>(0);
  public latestTriggerTotal$ = this.latestTriggerTotal.asObservable();

  constructor(private http: HttpClient) { }

  getAllTriggers(page: number, limit: number, actions: string[], symbols: string[]): Observable<{
    items: Trigger[];
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
      items: Trigger[];
      total: number;
    }>(`${this.baseUrl}`, { params });
  }

  getTriggers(symbol: string, page: number, limit: number, actions: string[]): Observable<{
    items: Trigger[];
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
      items: Trigger[];
      total: number;
    }>(`${this.baseUrl}/${symbol}`, { params });
  }

  getLatestTriggers(page: number, limit: number, actions: string[]): Observable<{
    items: Trigger[];
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
      items: Trigger[];
      total: number;
    }>(`${this.baseUrl}/latestTriggers`, { params })
      .pipe(tap(res => {
        // Initialize the store with data from server
        this.latestTriggerTotal.next(res.total);
        this.latestTriggersSubject.next(res.items);
      }));
  }

  processRealTimeTrigger(newTrigger: Trigger) {
    this.realTimeTriggerSubject.next(newTrigger);

    const currentList = this.latestTriggersSubject.value;
    const exists = currentList.some(t => t.symbol === newTrigger.symbol);

    if (exists) {
      // STRATEGY: Find and Replace. Keep the index same.
      const updatedList = currentList.map(t => {
        if (t.symbol === newTrigger.symbol) {
          return newTrigger;
        }
        return t;
      });
      console.log("Updating: ", newTrigger.symbol, newTrigger.action)
      this.latestTriggersSubject.next(updatedList);
    }
  }
}
