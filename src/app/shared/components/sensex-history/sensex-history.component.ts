import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TriggerService } from 'src/app/core/services/trigger.service';
import { SensexHistory } from 'src/app/core/models/sensexHistory.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-sensex-history',
  templateUrl: './sensex-history.component.html',
  styleUrls: ['./sensex-history.component.scss']
})
export class SensexHistoryComponent {
  historyData: SensexHistory[] = [];
  historyDataCount: number = 0;
  historyColumns = [
    { key: 'basePrice', label: 'Previous', width: '100px' },
    { key: 'currPrice', label: 'New Price', width: '100px' },
    {
      key: 'change',
      label: '% Change',
      cell: (row: any) => {
        const percent = (((row.currPrice - row.basePrice) / row.basePrice) * 100).toFixed(2);
        return `${percent}%`;
      },
      width: '100px'
    },
    { key: 'lastDirection', label: 'Direction', width: '100px' },
    {
      key: 'timestamp',
      label: 'Time',
      cell: (row: any) => new Date(row.timestamp).toLocaleString(),
      width: '150px'
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<SensexHistoryComponent>,
    public triggerService: TriggerService,
    private destroyRef: DestroyRef
  ) { }

  ngOnInit() {
    this.fetchHistory(0, 5);
  }

  fetchHistory(pageNumber: number, pageSize: number) {
    this.triggerService.getSensexTriggers(pageNumber, pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(resp => {
        this.historyData = resp.items;
        this.historyDataCount = resp.total;
      })
  }

  onPageChange(e: PageEvent) {
    this.fetchHistory(e.pageIndex, e.pageSize);
  }

  close() {
    this.dialogRef.close();
  }

  sensexRowClass(row: any) {
    if (row.lastDirection === 'UP') return 'row-buy';
    if (row.lastDirection === 'DOWN') return 'row-sell';
    return 'row-hold';
  }
}
