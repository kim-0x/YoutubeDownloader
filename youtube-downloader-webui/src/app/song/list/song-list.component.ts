import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, Subscription, take, withLatestFrom } from 'rxjs';
import { DownloadEventsService } from '../../service/download-events.service';
import { SongItem, SongService } from '../../service/song.service';
import { DownloadService } from '../../service/download.service';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss',
  imports: [
    NgIf,
    AsyncPipe,
    ScrollingModule,
    MatIconModule,
    MatDivider,
    MatRippleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedSong = output<string>();
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

  ngAfterViewInit(): void {
    this._subscription.add(
      this._songService.songs$
        .pipe(
          filter((s) => s.length > 0),
          take(1)
        )
        .subscribe((songs: SongItem[]) => {
          const song = songs.find((s) => s.type === 'song');
          if (song) {
            this._songService.updateTitleSelection(song.text);
          }
        })
    );
  }

  onClick(title: string) {
    this._songService.updateTitleSelection(title);
    this.selectedSong.emit(title);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
