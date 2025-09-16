import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoFormComponent } from './video/form/video-form.component';
import { AudioPlayerComponent } from './audio/player/audio-player.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgIf } from '@angular/common';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, Subscription } from 'rxjs';
import { SongItem, SongService } from './service/song.service';

class SongDataSource extends DataSource<SongItem | undefined> {
  private readonly _subscription = new Subscription();
  private _songService = inject(SongService);

  constructor() {
    super();
    this._subscription.add(this._songService.songs$.subscribe());
  }

  override connect(
    _: CollectionViewer
  ): Observable<readonly (SongItem | undefined)[]> {
    return this._songService.songs$;
  }

  override disconnect(_: CollectionViewer): void {
    this._subscription.unsubscribe();
  }
}

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly ds = new SongDataSource();
  private readonly _songService = inject(SongService);

  onClick(title: string | undefined) {
    this._songService.updateTitleSelection(title);
  }
}
