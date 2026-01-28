import { Component } from '@angular/core';
import { SessionDialogComponent } from 'src/app/shared/components/session-dialog/session-dialog.component';
import { SessionService } from '../../services/session.service';
import { SensexService } from '../../services/sensex.service';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from 'src/app/shared/components/upload-dialog/upload-dialog.component';

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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // SessionService already checks status on init
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
