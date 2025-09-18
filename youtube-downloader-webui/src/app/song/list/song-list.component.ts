import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { map, Subscription, withLatestFrom } from 'rxjs';
import { DownloadEventsService } from '../../service/download-events.service';
import { SongService } from '../../service/song.service';
import { DownloadService } from '../../service/download.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss',
  imports: [NgIf, AsyncPipe, ScrollingModule, MatIconModule, MatDivider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent {
  private readonly _subscription = new Subscription();

  private readonly _songService = inject(SongService);
  private readonly _downloadEventsService = inject(DownloadEventsService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _newSong$ = this._downloadEventsService.completed$.pipe(
    withLatestFrom(this._downloadService.currentVideo$),
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

  onClick(title: string) {
    this._songService.updateTitleSelection(title);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
