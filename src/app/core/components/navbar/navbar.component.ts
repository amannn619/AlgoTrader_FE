import { Stock } from './../../models/stock.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StateService } from './../../services/state.service';
import { Component, DestroyRef } from '@angular/core';
import { SessionDialogComponent } from 'src/app/shared/components/session-dialog/session-dialog.component';
import { SessionService } from '../../services/session.service';
import { SensexService } from '../../services/sensex.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from 'src/app/shared/components/upload-dialog/upload-dialog.component';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  sensex$ = this.sensexService.sensex$;
  isRunning$ = this.sessionService.isRunning$;

  constructor(
    private sessionService: SessionService,
    private sensexService: SensexService,
    private stockService: StockService,
    private stateService: StateService,
    private dialog: MatDialog,
    private destoryRef: DestroyRef
  ) { }

  ngOnInit(): void {
    this.stateService.getState()
      .pipe(takeUntilDestroyed(this.destoryRef))
      .subscribe(state => {
        this.sensexService.update(state?.sensex);
        this.stockService.initializeStocks(state?.stocks);
      })
  }

  openStartSession() {
    const dialogRef = this.dialog.open(SessionDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sessionService.startSession(result).subscribe({
          next: () => console.log('Session Started'),
          error: (err) => alert('Failed: ' + err.error?.message)
        });
      }
    });
  }

  stopSession() {
    if (confirm('Are you sure you want to stop the market session?')) {
      this.sessionService.stopSession().subscribe();
    }
  }

  openUpload() {
    this.dialog.open(UploadDialogComponent, { width: '450px' });
  }
}
