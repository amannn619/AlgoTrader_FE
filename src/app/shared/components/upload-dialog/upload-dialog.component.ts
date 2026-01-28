import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {
  nseFile: File | null = null;
  bseFile: File | null = null;
  uploading = false;

  constructor(private sessionService: SessionService, private dialogRef: MatDialogRef<UploadDialogComponent>) { }

  onFileSelected(event: any, type: 'nse' | 'bse') {
    if (event.target.files.length > 0) {
      if (type === 'nse') this.nseFile = event.target.files[0];
      else this.bseFile = event.target.files[0];
    }
  }

  upload() {
    this.uploading = true;
    const formData = new FormData();
    if (this.nseFile) formData.append('nse', this.nseFile);
    if (this.bseFile) formData.append('bse', this.bseFile);

    this.sessionService.uploadBhav(formData).subscribe({
      next: () => {
        this.uploading = false;
        this.dialogRef.close(true);
        alert('Files uploaded successfully!');
      },
      error: () => {
        this.uploading = false;
        alert('Upload failed.');
      }
    });
  }
}
