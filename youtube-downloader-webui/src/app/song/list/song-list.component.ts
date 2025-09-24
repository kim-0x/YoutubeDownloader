import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import {
  selectedSongTitleSelector,
  songItemsSelector,
} from '../../store/song/song.selector';
import { SongActionTypes } from '../../store/song/song.actions';

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
    NgForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent implements OnInit {
  private readonly _store = inject(Store<AppState>);
  readonly songs$ = this._store.select(songItemsSelector);

  readonly selectedSongTitle$ = this._store.select(selectedSongTitleSelector);

  ngOnInit(): void {
    this._store.dispatch({ type: SongActionTypes.LoadSongs });
  }

  onClick(title: string) {
    this._store.dispatch({ type: SongActionTypes.SelectSong, title });
  }
}
