import { Sensex } from './../models/sensex.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stock } from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private baseUrl = `${environment.apiUrl}/state`;

  constructor(private http: HttpClient) { }

  getState(): Observable<{ sensex: Sensex, stocks: Stock[] }> {
    return this.http.get<{ sensex: Sensex, stocks: Stock[] }>(`${this.baseUrl}`);
  }
}
