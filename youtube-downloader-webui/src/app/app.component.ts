import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoFormComponent } from './video/form/video-form.component';
import { AudioPlayerComponent } from './audio/player/audio-player.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SongListComponent } from './song/list/song-list.component';
import { Store } from '@ngrx/store';
import { SongActionTypes } from './store/song/song.actions';
import { CommonModule } from '@angular/common';

import { songItemsSelector } from './store/song/song.selector';
import { AppState } from './store/state';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatListModule,
    MatIconModule,
    ScrollingModule,
    VideoFormComponent,
    AudioPlayerComponent,
    SongListComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _store = inject(Store<AppState>);
  protected songs$ = this._store.select(songItemsSelector);

  ngOnInit(): void {
    this._store.dispatch({ type: SongActionTypes.LoadSongs });
  }

  handleSelectionChange(title: string) {
    this._store.dispatch({ type: SongActionTypes.SelectSong, title });
  }
}
