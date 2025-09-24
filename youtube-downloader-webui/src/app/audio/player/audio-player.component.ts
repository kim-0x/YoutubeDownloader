import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import { selectedSongSelector } from '../../store/song/song.selector';
import { SongDetail } from '../../store/state/song.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  imports: [MatIconModule],
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('player')
  player?: ElementRef<HTMLAudioElement>;

  private readonly _subscription = new Subscription();
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  private readonly _store = inject(Store<AppState>);
  private readonly _currentAudio$ = this._store
    .select(selectedSongSelector)
    .pipe(
      map((value: SongDetail) => ({
        audioUrl: this._sanitizer.bypassSecurityTrustResourceUrl(
          value.audioUrl
        ),
        title: value.title,
      }))
    );

  currentAudio: { audioUrl: SafeResourceUrl; title: string } | undefined;

  ngOnInit(): void {
    this._subscription.add(
      this._currentAudio$.subscribe((result) => {
        this.currentAudio = result;
        this._cd.detectChanges();
        this.player?.nativeElement.load();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
