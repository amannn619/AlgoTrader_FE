import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/core/models/stock.model';
import { StockService } from 'src/app/core/services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stocks$!: Observable<Record<string, Stock>>

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stocks$ = this.stockService.stocks$;
  }

  trackBySymbol(index: number, item: any) {
    return item.key; // stock symbol
  }
}
