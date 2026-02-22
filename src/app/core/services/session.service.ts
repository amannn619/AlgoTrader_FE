import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SessionCredentials {
  apiKey: string;
  clientId: string;
  password: string;
  totp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl = `${environment.apiUrl}/session`;

  // Track if session is running locally to update UI immediately
  private isRunningSubject = new BehaviorSubject<boolean>(false);
  public isRunning$ = this.isRunningSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkStatus();
  }

  checkStatus() {
    this.http.get<{ running: boolean }>(`${this.baseUrl}/status`)
      .subscribe(res => this.isRunningSubject.next(res.running));
  }

  startSession(creds: SessionCredentials): Observable<any> {
    return this.http.post(`${this.baseUrl}/start`, creds).pipe(
      tap(() => this.isRunningSubject.next(true))
    );
  }

  stopSession(): Observable<any> {
    return this.http.post(`${this.baseUrl}/stop`, {}).pipe(
      tap(() => this.isRunningSubject.next(false))
    );
  }

  uploadBhav(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload-bhav`, formData).pipe(
      tap(() => this.isRunningSubject.next(false))
    );
  }
}