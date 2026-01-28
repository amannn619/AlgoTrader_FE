import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MASTER_STOCKS, StockConfig } from 'src/app/core/config/master-stocks';
import { Stock } from 'src/app/core/models/stock.model';
import { TableColumn } from 'src/app/core/models/table-column';
import { Trade } from 'src/app/core/models/trade.model';
import { Trigger } from 'src/app/core/models/trigger.model';
import { StockService } from 'src/app/core/services/stock.service';
import { TradeService } from 'src/app/core/services/trade.service';
import { TriggerService } from 'src/app/core/services/trigger.service';

@Component({
  selector: 'app-all-actions',
  templateUrl: './all-actions.component.html',
  styleUrls: ['./all-actions.component.scss']
})
export class AllActionsComponent implements OnInit {

  // Data
  trades: Trade[] = [];
  triggers: Trigger[] = [];
  totalTrades = 0;
  totalTriggers = 0;

  // Filters
  selectedSymbols: string[] = []; // For dropdown
  selectedTradeActions: string[] = [];
  selectedTriggerActions: string[] = [];

  allStocks: StockConfig[] = MASTER_STOCKS;
  filteredStocks: StockConfig[] = MASTER_STOCKS;
  stockSearchText: string = '';

  // Table Config
  tradeColumns: TableColumn<Trade>[] = [];
  triggerColumns: TableColumn<Trigger>[] = [];

  constructor(
    private router: Router,
    private stockService: StockService,
    private tradeService: TradeService,
    private triggerService: TriggerService
  ) {

    // 1. Define Columns (Adding 'Symbol' column)
    this.tradeColumns = [
      { key: 'symbol', label: 'Symbol', width: '80px' }, // New Column
      { key: 'action', label: 'Action', width: '80px' },
      { key: 'price', label: 'Price', cell: t => t.price.toFixed(2), width: '80px' },
      { key: 'quantity', label: 'Qty', width: '60px' },
      { key: 'pnl', label: 'PnL', cell: t => t.pnl ? t.pnl.toFixed(2) : '-', width: '80px' },
      { key: 'timestamp', label: 'Time', cell: t => new Date(t.timestamp).toLocaleString(), width: '140px' }
    ];

    this.triggerColumns = [
      { key: 'symbol', label: 'Symbol', width: '80px' }, // New Column
      { key: 'action', label: 'Action', width: '80px' },
      { key: 'stockPrice', label: 'Stock', cell: t => t.stockPrice.toFixed(2), width: '80px' },
      { key: 'sensexPrice', label: 'Sensex', cell: t => t.sensexPrice.toFixed(2), width: '80px' },
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
      { key: 'timestamp', label: 'Time', cell: t => new Date(t.timestamp).toLocaleString(), width: '140px' }
    ];
  }

  ngOnInit(): void {
    this.loadTrades(0, 10);
    this.loadTriggers(0, 10);
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

  // --- Loaders ---
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

  // --- Event Handlers ---
  onFilterChange(type: 'trade' | 'trigger') {
    if (type === 'trade') this.loadTrades(0, 10);
    else this.loadTriggers(0, 10);
  }

  onTradePage(e: PageEvent) {
    this.loadTrades(e.pageIndex, e.pageSize);
  }

  onTriggerPage(e: PageEvent) {
    this.loadTriggers(e.pageIndex, e.pageSize);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Row Styles
  rowClass(row: any) {
    if (row.action === 'BUY') return 'row-buy';
    if (row.action === 'SELL') return 'row-sell';
    return 'row-hold';
  }
}