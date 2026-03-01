import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  show() {
    this.isLoadingSubject.next(true);
    this.activeRequests++;
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.isLoadingSubject.next(false);
    }
    console.log(this.activeRequests)
  }
}