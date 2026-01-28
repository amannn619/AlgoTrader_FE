import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trigger } from '../models/trigger.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  private baseUrl = 'http://localhost:3000/api/triggers';
  private tiggerExecuted: number = 0

  private reloadSubject: Subject<void> = new Subject();
  public reloadTrigger$: Observable<void> = this.reloadSubject.asObservable()

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

  addTrigger() {
    this.tiggerExecuted += 1;
    if (this.tiggerExecuted >= 10) {
      this.tiggerExecuted = 0;
      this.reloadSubject.next()
    }
  }
}
