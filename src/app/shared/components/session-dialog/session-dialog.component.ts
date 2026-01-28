import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss']
})
export class SessionDialogComponent {
  data = {
    clientId: 'A768340',
    password: '8430',
    apiKey: 'omT0j1lA',
    totp: ''
  };
  constructor(public dialogRef: MatDialogRef<SessionDialogComponent>) { }
}
