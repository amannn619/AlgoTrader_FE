import { Component, DestroyRef, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import { MASTER_STOCKS, StockConfig } from 'src/app/core/config/master-stocks';
import { Sensex } from 'src/app/core/models/sensex.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableAction, TableColumn } from 'src/app/core/models/table-column';
import { Trade } from 'src/app/core/models/trade.model';
import { Trigger } from 'src/app/core/models/trigger.model';
import { SensexService } from 'src/app/core/services/sensex.service';
import { StockService } from 'src/app/core/services/stock.service';
import { TradeService } from 'src/app/core/services/trade.service';
import { TriggerService } from 'src/app/core/services/trigger.service';
import { Stock } from 'src/app/core/models/stock.model';
import { MatDialog } from '@angular/material/dialog';
import { SensexHistoryComponent } from 'src/app/shared/components/sensex-history/sensex-history.component';

@Component({
  selector: 'app-all-actions',
  templateUrl: './all-actions.component.html',
  styleUrls: ['./all-actions.component.scss']
})
export class AllActionsComponent implements OnInit {

  // Data
  trades: Trade[] = [];
  triggers: Trigger[] = [];
  stocks$!: Observable<Stock[]>;
  latestTriggers$ = this.triggerService.latestTriggers$;
  latestTriggerTotal$ = this.triggerService.latestTriggerTotal$;

  totalTrades = 0;
  totalTriggers = 0;
  // totalLatestTriggers = 0;
  sensexData$: Observable<Sensex[]>;

  // Filters
  selectedSymbols: string[] = []; // For dropdown
  selectedTradeActions: string[] = [];
  selectedTriggerActions: string[] = ["BUY", "SELL"];

  allStocks: StockConfig[] = MASTER_STOCKS;
  filteredStocks: StockConfig[] = MASTER_STOCKS;
  stockSearchText: string = '';

  // Table Config
  sensexColumns: TableColumn<Sensex>[] = [];
  tradeColumns: TableColumn<Trade>[] = [];
  triggerColumns: TableColumn<Trigger>[] = [];
  stockColumns: TableColumn<Stock>[] = [];
  stockActions: TableAction<Stock>[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;

  constructor(
    private router: Router,
    private stockService: StockService,
    private tradeService: TradeService,
    private triggerService: TriggerService,
    private sensexService: SensexService,
    private destroyRef: DestroyRef,
    private dialog: MatDialog
  ) {

    this.stocks$ = this.stockService.stocks$.pipe(
      map(stocksDictionary => Object.values(stocksDictionary))
    );

    this.sensexData$ = this.sensexService.sensex$.pipe(
      map(sensex => [sensex])
    );

    this.stockColumns = [
      { key: 'name', label: 'Index', cell: (s) => `${s.symbol} (${(((s.currPrice - s.basePrice) / s.basePrice) * 100).toFixed(2)}%)`, width: '100px' },
      { key: 'currPrice', label: 'Price', cell: (s) => `${s.currPrice.toFixed(2)}`, width: '100px' },
      { key: 'basePrice', label: 'Base Price', cell: (s) => s.basePrice.toFixed(2), width: '100px' },
      { key: 'lastDirection', label: 'Direction', width: '100px' },
      { key: 'timestamp', label: 'Last Updated', cell: (s) => s.lastTriggerTime ? new Date(s.lastTriggerTime).toLocaleString() : '-', width: '120px' }
    ];
    this.stockActions = [
      {
        icon: "visibility",
        tooltip: "View All Actions",
        color: "primary",
        onClick: (s) => this.redirectToStockDetail(s)
      }
    ]

    this.sensexColumns = [
      { key: 'name', label: 'Index', cell: (s) => `SENSEX (${(((s.currPrice - s.basePrice) / s.basePrice) * 100).toFixed(2)}%)`, width: '100px' },
      { key: 'currPrice', label: 'Price', cell: (s) => `${s.currPrice.toFixed(2)}`, width: '100px' },
      { key: 'basePrice', label: 'Base Price', cell: (s) => s.basePrice.toFixed(2), width: '100px' },
      { key: 'lastDirection', label: 'Direction', width: '100px' },
      { key: 'timestamp', label: 'Last Updated', cell: (s) => s.lastTriggerTime ? new Date(s.lastTriggerTime).toLocaleString() : '-', width: '120px' }
    ];

    this.tradeColumns = [
      { key: 'symbol', label: 'Symbol', width: '80px' },
      { key: 'action', label: 'Action', width: '80px' },
      { key: 'price', label: 'Price', cell: t => t.price.toFixed(2), width: '80px' },
      { key: 'quantity', label: 'Qty', width: '60px' },
      { key: 'pnl', label: 'PnL', cell: t => t.pnl ? t.pnl.toFixed(2) : '-', width: '80px' },
      { key: 'timestamp', label: 'Time', cell: t => new Date(t.timestamp).toLocaleString(), width: '140px' }
    ];

    this.triggerColumns = [
      { key: 'symbol', label: 'Symbol', width: '80px' },
      { key: 'action', label: 'Action', width: '80px' },
      { key: 'stockPrice', label: 'Stock Price', cell: t => t.stockPrice.toFixed(2), width: '80px' },
      { key: 'lastStockPrice', label: 'Base Stock Price', cell: t => t.lastStockPrice.toFixed(2), width: '90px' },
      { key: 'stockDirection', label: 'Stock Direction', cell: t => t.stockDirection, width: '80px' },
      { key: 'sensexDirection', label: 'Sensex Direction', cell: t => t.sensexDirection, width: '80px' },
      { key: 'timestamp', label: 'Time', cell: t => t.timestamp ? new Date(t.timestamp).toLocaleString() : "-", width: '140px' }
    ];
  }

  ngOnInit(): void {
    this.loadTrades(0, 10);
    this.loadTriggers(0, 10);
    this.loadLatestTriggers(0, 10);

    this.triggerService.realTimeTrigger$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newTrigger => {
        this.handleNewLog(newTrigger);
      });
  }

  redirectToStockDetail(stock: Stock) {
    this.router.navigate([`stock/${stock.symbol}`])
  }

  handleNewLog(trigger: Trigger) {
    const actionMatch = this.selectedTriggerActions.length === 0 ||
      this.selectedTriggerActions.includes(trigger.action);

    const symbolMatch = this.selectedSymbols.length === 0 ||
      this.selectedSymbols.includes(trigger.symbol);

    if (actionMatch && symbolMatch) {
      this.totalTriggers++;
      if (this.pageIndex == 0) {
        this.triggers = [trigger, ...this.triggers].splice(0, this.pageSize);
      }
    }
  }

  filterStocks() {
    if (!this.stockSearchText) {
      this.filteredStocks = this.allStocks;
      return;
    }

    const search = this.stockSearchText.toLowerCase();
    this.filteredStocks = this.allStocks.filter(s =>
      s.symbol.toLowerCase().includes(search) ||
      s.name.toLowerCase().includes(search)
    );
  }

  onDropdownClose() {
    this.stockSearchText = '';
    this.filterStocks();
  }

  loadTrades(page: number, limit: number) {
    this.tradeService.getAllTrades(page, limit, this.selectedTradeActions, this.selectedSymbols)
      .subscribe(res => {
        this.trades = res.items;
        this.totalTrades = res.total;
      });
  }

  loadTriggers(page: number, limit: number) {
    this.triggerService.getAllTriggers(page, limit, this.selectedTriggerActions, this.selectedSymbols)
      .subscribe(res => {
        this.triggers = res.items;
        this.totalTriggers = res.total;
      });
  }

  loadLatestTriggers(page: number, limit: number) {
    this.triggerService.getLatestTriggers(page, limit, []).subscribe();
  }

  // --- Event Handlers ---
  onFilterChange(type: 'trade' | 'trigger') {
    if (type === 'trade') this.loadTrades(0, 10);
    else this.loadTriggers(0, 10);
  }

  onTradePage(e: PageEvent) {
    this.loadTrades(e.pageIndex, e.pageSize);
  }

  onTriggerPage(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadTriggers(e.pageIndex, e.pageSize);
  }

  onLatestTriggerPage(e: PageEvent) {
    this.loadLatestTriggers(e.pageIndex, e.pageSize);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  openSensexHistory() {
    this.dialog.open(SensexHistoryComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false
    });
  }

  rowClass(row: any) {
    if (row.action === 'BUY') return 'row-buy';
    if (row.action === 'SELL') return 'row-sell';
    return 'row-hold';
  }

  sensexRowClass(row: any) {
    if (row.lastDirection === 'UP') return 'row-buy';
    if (row.lastDirection === 'DOWN') return 'row-sell';
    return 'row-hold';
  }
}