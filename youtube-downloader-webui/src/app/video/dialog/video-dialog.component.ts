import { AsyncPipe, NgIf, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DownloadEventsService } from '../../service/download-events.service';

@Component({
  templateUrl: './video-dialog.component.html',
  styleUrl: './video-dialog.component.scss',
  imports: [
    MatDialogModule,
    MatProgressBar,
    MatButtonModule,
    NgIf,
    PercentPipe,
    AsyncPipe,
  ],
})
export class VideoDialogComponent {
  private readonly _downloadEventsService = inject(DownloadEventsService);

  readonly progressMessage$ = this._downloadEventsService.progress$;
  readonly errorMessage$ = this._downloadEventsService.error$;
  readonly completedMessage$ = this._downloadEventsService.completed$;
}
