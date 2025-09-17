import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { merge, Subscription } from 'rxjs';
import { ReportService } from '../../service/report.service';
import { SongService } from '../../service/song.service';
import { SafeResourceUrl } from '@angular/platform-browser';

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

  private readonly _reportService = inject(ReportService);
  private readonly _songService = inject(SongService);
  private readonly _cd: ChangeDetectorRef = inject(ChangeDetectorRef);

  currentAudio: { audioUrl: SafeResourceUrl; title: string } | undefined;

  ngOnInit(): void {
    this._subscription.add(
      merge(
        this._reportService.currentAudio$,
        this._songService.currentSong$
      ).subscribe((result) => {
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
