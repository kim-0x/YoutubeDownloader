import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { tap } from 'rxjs';
import { ReportService } from '../../service/report.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  imports: [MatCardModule, AsyncPipe],
})
export class AudioPlayerComponent {
  @ViewChild('player')
  player?: ElementRef<HTMLAudioElement>;

  private readonly _reportService = inject(ReportService);

  readonly currentAudio$ = this._reportService.currentAudio$.pipe(
    tap(() => this.player?.nativeElement.load())
  );
}
