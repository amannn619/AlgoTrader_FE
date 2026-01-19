import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Stock } from 'src/app/core/models/stock.model';
import { TableColumn } from 'src/app/core/models/table-column';
import { Trade } from 'src/app/core/models/trade.model';
import { Trigger } from 'src/app/core/models/trigger.model';
import { StockService } from 'src/app/core/services/stock.service';
import { TradeService } from 'src/app/core/services/trade.service';
import { TriggerService } from 'src/app/core/services/trigger.service';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  symbol!: string;
  stock?: Stock;

  // trades$!: Observable<Trade[]>;
  // triggers$!: Observable<Trigger[]>;

  trades: Trade[] = [];
  triggers: Trigger[] = [];
  totalTrades: number = 0;
  totalTriggers: number = 0;

  tradeColumns: TableColumn<Trade>[];
  triggerColumns: TableColumn<Trigger>[];

  selectedTradeActions: string[] = [];
  selectedTriggerActions: string[] = [];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stockService: StockService,
    private tradeService: TradeService,
    private triggerService: TriggerService
  ) {
    this.tradeColumns = [
      {
        key: 'action',
        label: 'Action',
        width: '90px'
      },
      {
        key: 'price',
        label: 'Price',
        width: '100px',
        cell: t => t.price.toFixed(2)
      },
      {
        key: 'quantity',
        label: 'Qty',
        width: '60px'
      },
      {
        key: 'pnl',
        label: 'PnL',
        width: '60px',
        cell: t => t.pnl ? t.pnl?.toFixed(2) : "N/A",
      },
      {
        key: 'timestamp',
        label: 'Time',
        cell: t => new Date(t.timestamp).toLocaleTimeString(),
        width: '60px'
      }
    ];

    this.triggerColumns = [
      {
        key: 'action',
        label: 'Action',
        width: '90px'
      },
      {
        key: 'stockPrice',
        label: 'Stock',
        cell: t => t.stockPrice.toFixed(2),
        width: '90px'
      },
      {
        key: 'sensexPrice',
        label: 'Sensex',
        cell: t => t.sensexPrice.toFixed(2),
        width: '90px'
      },
      {
        key: 'lastStockPrice',
        label: 'Prev Stock',
        cell: t => t.lastStockPrice.toFixed(2),
        width: '90px'
      },
      {
        key: 'lastSensexPrice',
        label: 'Prev Sensex',
        cell: t => t.lastSensexPrice.toFixed(2),
        width: '90px'
      },
      {
        key: 'timestamp',
        label: 'Time',
        cell: t => new Date(t.timestamp).toLocaleTimeString(),
        width: '9px'
      }
    ];

  }

  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.stockService
      .getStock$(this.symbol)
      .subscribe(stock => {
        if (stock) {
          this.stock = stock;
        }
      });


    this.getTiggerData(0, 5)
    this.getTradeData(0, 5)

    this.tradeService.reloadTrade$.subscribe(() => {
      console.log("reloading trade")
      this.getTradeData(0, 5);
    })
    this.triggerService.reloadTrigger$.subscribe(() => {
      console.log("reloading trigger")

      // this.getTiggerData(0, 5);
    })
  }

  onActionChange(table: string) {
    if (table == "trade") {
      this.getTradeData(0, 5);
    }
    else {
      this.getTiggerData(0, 5);
    }
  }


  onTradePageChange(event: PageEvent) {
    console.log(event)
    this.getTradeData(event.pageIndex, event.pageSize);
  }

  onTriggerPageChange(event: PageEvent) {
    this.getTiggerData(event.pageIndex, event.pageSize);

  }

  getTradeData(pageIndex: number, pageSize: number) {
    this.tradeService.getTrades(
      this.symbol,
      pageIndex,
      pageSize,
      this.selectedTradeActions
    ).subscribe(trades => {
      this.trades = trades.items;
      this.totalTrades = trades.total;
    });
  }

  getTiggerData(pageIndex: number, pageSize: number) {
    this.triggerService.getTriggers(
      this.symbol,
      pageIndex,
      pageSize,
      this.selectedTriggerActions
    ).subscribe(triggers => {
      this.triggers = triggers.items;
      this.totalTriggers = triggers.total;
    });
  }

  rowClass(trade: any) {
    switch (trade.action) {
      case 'BUY':
        return 'row-buy';
      case 'SELL':
        return 'row-sell';
      default:
        return 'row-hold';
    }
  };


  goBack() {
    this.router.navigate(['/']);
  }
}
