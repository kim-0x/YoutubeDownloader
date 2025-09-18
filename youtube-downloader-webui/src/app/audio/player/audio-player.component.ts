import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map, merge, Subscription, withLatestFrom } from 'rxjs';
import { SongService } from '../../service/song.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DownloadEventsService } from '../../service/download-events.service';
import { DownloadService } from '../../service/download.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  imports: [MatCardModule],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('player')
  player?: ElementRef<HTMLAudioElement>;

  private readonly _subscription = new Subscription();
  private _sanitizer = inject(DomSanitizer);

  private readonly _downloadService = inject(DownloadService);
  private readonly _downloadEventsService = inject(DownloadEventsService);
  private readonly _songService = inject(SongService);
  private readonly _currentAudio$ = this._downloadEventsService.completed$.pipe(
    withLatestFrom(this._downloadService.currentVideo$),
    map(([url, currentVideo]) => ({
      audioUrl: this._sanitizer.bypassSecurityTrustResourceUrl(url),
      title: currentVideo.title,
    }))
  );

  currentAudio: { audioUrl: SafeResourceUrl; title: string } | undefined;

  ngOnInit(): void {
    this._subscription.add(
      merge(this._currentAudio$, this._songService.currentSong$).subscribe(
        (result) => {
          this.currentAudio = result;
          this.player?.nativeElement.load();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
