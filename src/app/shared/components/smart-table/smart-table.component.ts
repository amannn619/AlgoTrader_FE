import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subscription, isObservable } from 'rxjs';
import { TableAction, TableColumn } from 'src/app/core/models/table-column';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent<T> implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() data!: T[] | null;
  @Input() columns: TableColumn<T>[] = [];
  @Input() actions: TableAction<T>[] = [];
  @Input() enablePagination = true;
  @Input() pageSize = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 25];
  @Input() totalCount = 0;
  @Input() rowClassFn?: (row: T) => string;

  @Output() pageChange = new EventEmitter<PageEvent>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.displayedColumns = this.columns.map(c => c.key as string);

      if (this.actions.length) {
        this.displayedColumns.push('actions');
      }
    }

    if (changes['data']) {
      this.dataSource.data = this.data ?? [];
      this.updatePaginatorLength();
    }
  }

  ngAfterViewInit(): void {
    if (this.enablePagination) {
      this.paginator.page.subscribe(event => {
        this.pageChange.emit(event);
      });
    }
  }

  private updatePaginatorLength() {
    if (!this.enablePagination || !this.paginator) return;

    this.paginator.length = this.totalCount;
  }


  getCellValue(row: T, column: TableColumn<T>) {
    return column.cell ? column.cell(row) : (row as any)[column.key];
  }
}
