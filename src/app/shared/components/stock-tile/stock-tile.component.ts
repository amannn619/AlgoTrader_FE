import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from '../../../core/models/stock.model';

@Component({
  selector: 'app-stock-tile',
  templateUrl: './stock-tile.component.html',
  styleUrls: ['./stock-tile.component.scss']
})
export class StockTileComponent {
  @Input() stock!: Stock;

  constructor(private router: Router) { }

  openDetail() {
    this.router.navigate(['/stock', this.stock.symbol]);
  }
}
