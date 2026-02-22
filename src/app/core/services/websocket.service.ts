import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { SensexService } from './sensex.service';
import { StockService } from './stock.service';
import { TradeService } from './trade.service';
import { TriggerService } from './trigger.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private ws!: WebSocketSubject<any>;

  constructor(
    private sensexService: SensexService,
    private stockService: StockService,
    private tradeService: TradeService,
    private triggerService: TriggerService
  ) { }

  public connect(): void {
    this.ws = webSocket(environment.wsUrl);

    this.ws.subscribe(msg => {
      switch (msg.type) {
        case 'CONNECTED':
          console.log(msg.message);
          break;

        case 'SENSEXUPDATE':
          this.handleSensexUpdate(msg.payload);
          break;

        case 'STOCKUPDATE':
          this.handleStockUpdate(msg.payload);
          break;

        case 'TRIGGER':
          this.handleTrigger(msg.payload);
          break;

        case 'TRADE':
          this.handleTrade();
          break;
      }
    });

  }

  private handleSensexUpdate(payload: any) {
    this.sensexService.update(payload);
  }

  private handleStockUpdate(payload: any) {
    this.stockService.update(payload);
  }

  private handleTrigger(payload: any) {
    this.triggerService.processRealTimeTrigger(payload);
  }

  private handleTrade() {
    this.tradeService.addTrade();
  }
}
