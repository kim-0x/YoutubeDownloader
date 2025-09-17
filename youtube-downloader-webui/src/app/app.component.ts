import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoFormComponent } from './video/form/video-form.component';
import { AudioPlayerComponent } from './audio/player/audio-player.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { SongService } from './service/song.service';
import { DownloadEventsService } from './service/download-events.service';
import { map, Subscription, withLatestFrom } from 'rxjs';
import { ReportService } from './service/report.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatListModule,
    MatIconModule,
    ScrollingModule,
    VideoFormComponent,
    AudioPlayerComponent,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _subscription = new Subscription();

  private readonly _songService = inject(SongService);
  private readonly _downloadEventsService = inject(DownloadEventsService);
  private readonly _reportService = inject(ReportService);
  private readonly _newSong$ = this._downloadEventsService.completed$.pipe(
    withLatestFrom(this._reportService.currentVideo$),
    map(([url, currentVideo]) => ({
      audioUrl: url,
      title: currentVideo.title,
    }))
  );

  readonly songs$ = this._songService.songs$;

  ngOnInit(): void {
    this._subscription.add(
      this._newSong$.subscribe(async (newSong) => {
        await this._songService.dispatchSongUpdate(newSong);
        this._songService.updateTitleSelection(newSong.title);
      })
    );
  }

  onClick(title: string | undefined) {
    this._songService.updateTitleSelection(title);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
