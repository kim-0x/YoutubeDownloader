import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, map, Subscription, withLatestFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../dialog/video-dialog.component';
import { DownloadService } from '../../service/download.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import { VideoActionTypes } from '../../store/video/video.actions';
import { videoInfoSelector } from '../../store/video/video.selector';
import { Video } from '../../store/state/video.model';
import { DownloadEventsService } from '../../service/download-events.service';
import { SongActionTypes } from '../../store/song/song.actions';

@Component({
  selector: 'app-video-form',
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class VideoFormComponent implements OnInit, OnDestroy {
  private readonly _downloadService = inject(DownloadService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _subscription = new Subscription();
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _store = inject(Store<AppState>);
  private readonly _downloadEventsService = inject(DownloadEventsService);
  private readonly _newSong$ = this._downloadEventsService.completed$.pipe(
    withLatestFrom(this._store.select(videoInfoSelector)),
    map(([url, currentVideo]) => ({
      audioUrl: url,
      title: currentVideo.title,
    }))
  );

  readonly downloadForm: FormGroup = this._formBuilder.group({
    videoUrl: [''],
    title: [''],
    startAt: [''],
    endAt: [''],
  });

  ngOnInit(): void {
    this._subscription.add(
      this.downloadForm
        .get('videoUrl')
        ?.valueChanges.pipe(debounceTime(150))
        .subscribe((url) => {
          if (url) this.getInfo(url);
        })
    );

    this._subscription.add(
      this._store.select(videoInfoSelector).subscribe((value: Video) => {
        this.downloadForm.patchValue({
          title: value.title,
          startAt: '00:00:00',
          endAt: value.duration,
        });
      })
    );

    this._subscription.add(
      this._newSong$.subscribe((newSong) => {
        this._store.dispatch({ type: SongActionTypes.SaveSong, args: newSong });
      })
    );
  }

  getInfo(videoUrl: string) {
    if (!videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    this._store.dispatch({
      type: VideoActionTypes.getVideoInfo,
      videoUrl,
    });
  }

  async download() {
    const { videoUrl, title, startAt, endAt } = this.downloadForm.value;

    if (!videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      await this._downloadService.triggerDownload({
        videoUrl,
        title,
        startAt,
        endAt,
      });
      this._dialog.open(VideoDialogComponent);
    } catch (err) {
      console.error('Download error: ' + err);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
