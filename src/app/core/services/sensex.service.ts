import { Injectable } from '@angular/core';
import { Sensex } from '../models/sensex.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SensexService {

  private sensexSubject = new BehaviorSubject<Sensex>({
    currPrice: 0,
    basePrice: 0,
    lastDirection: "NEUTRAL",
    lastTriggerTime: 0,
  });

  public sensex$: Observable<Sensex> = this.sensexSubject.asObservable();


  public update(sensex: Partial<Sensex>) {
    const current = this.sensexSubject.value;
    this.sensexSubject.next({
      ...current,
      currPrice: sensex.currPrice ?? current.currPrice,
      basePrice: sensex.basePrice ?? current.basePrice,
      lastDirection: sensex.lastDirection ?? current.lastDirection,
      lastTriggerTime: sensex.lastTriggerTime ?? current.lastTriggerTime,
    });
  }

  // public updateBasePrice(sensex: Partial<Sensex>) {
  //   const current = this.sensexSubject.value;
  //   this.sensexSubject.next({
  //     ...current,
  //     basePrice: sensex.basePrice ?? current.basePrice,
  //     lastDirection: sensex.lastDirection ?? current.lastDirection,
  //     lastTriggerTime: sensex.lastTriggerTime ?? current.lastTriggerTime,
  //   });
  // }

  // public updateCurrentPrice(price: number) {
  //   const current = this.sensexSubject.value;
  //   this.sensexSubject.next({
  //     ...current,
  //     currentPrice: price,
  //   });
  // }

  public getSensex(): Sensex {
    return this.sensexSubject.value;
  }
}
