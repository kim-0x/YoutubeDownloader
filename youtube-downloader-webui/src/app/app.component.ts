import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoFormComponent } from './video/form/video-form.component';
import { AudioPlayerComponent } from './audio/player/audio-player.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { SongService } from './service/song.service';

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
export class AppComponent {
  private readonly _songService = inject(SongService);

  readonly songs$ = this._songService.songs$;

  onClick(title: string | undefined) {
    this._songService.updateTitleSelection(title);
  }
}
