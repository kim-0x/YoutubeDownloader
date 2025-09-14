import { AsyncPipe, NgIf, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ReportService } from '../../service/report.service';
import { MatButtonModule } from '@angular/material/button';

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
  private readonly _reportService = inject(ReportService);

  readonly progressMessage$ = this._reportService.latestProgress$;
  readonly errorMessage$ = this._reportService.errorMessage$;
  readonly completedMessage$ = this._reportService.completedMessage$;
}
