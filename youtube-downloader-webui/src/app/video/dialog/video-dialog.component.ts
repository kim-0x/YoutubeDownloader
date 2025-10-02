import { AsyncPipe, NgIf, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { DownloadEventsService } from '../../service/download-events.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import { taskIdSelector } from '../../store/video/video.selector';
import { VideoActionTypes } from '../../store/video/video.actions';
import { map, merge, startWith } from 'rxjs';

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
  private readonly _store = inject(Store<AppState>);

  readonly progressMessage$ = this._downloadEventsService.progress$;
  readonly errorMessage$ = this._downloadEventsService.error$;
  readonly completedMessage$ = this._downloadEventsService.completed$;
  readonly cancelMessage$ = this._downloadEventsService.cancel$;
  readonly taskId$ = this._store.select(taskIdSelector);

  readonly canCancel$ = merge(this.cancelMessage$, this.completedMessage$).pipe(
    map(() => false),
    startWith(true)
  );

  readonly canClose$ = merge(
    this.canCancel$.pipe(map((value) => !value)),
    this.errorMessage$.pipe(map(() => true))
  );

  handleCancel(taskId: string) {
    this._store.dispatch({ type: VideoActionTypes.cancelDownload, taskId });
  }
}
