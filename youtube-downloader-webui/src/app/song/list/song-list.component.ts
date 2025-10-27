import { ScrollingModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state';
import {
  firstOrDefaultSongSelector,
  selectedSongTitleSelector,
  songItemsSelector,
} from '../../store/song/song.selector';
import { SongActionTypes } from '../../store/song/song.actions';
import { filter, Subscription, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrl: './song-list.component.scss',
  imports: [
    NgIf,
    AsyncPipe,
    ScrollingModule,
    MatButtonModule,
    MatIconModule,
    MatDivider,
    MatRippleModule,
    NgForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _store = inject(Store<AppState>);
  readonly songs$ = this._store.select(songItemsSelector);
  readonly firstOrDefaultSong$ = this._store.select(firstOrDefaultSongSelector);

  private readonly _subscription = new Subscription();

  readonly selectedSongTitle$ = this._store.select(selectedSongTitleSelector);

  ngOnInit(): void {
    this._store.dispatch({ type: SongActionTypes.LoadSongs });
  }

  ngAfterViewInit(): void {
    this._subscription.add(
      this.firstOrDefaultSong$
        .pipe(
          filter((x) => x.title !== ''),
          take(1)
        )
        .subscribe(({ title }) => {
          this._store.dispatch({ type: SongActionTypes.SelectSong, title });
        })
    );
  }

  selectSong(title: string) {
    this._store.dispatch({ type: SongActionTypes.SelectSong, title });
  }

  deleteSong(event: Event, id: number) {
    event.stopPropagation();
    this._store.dispatch({ type: SongActionTypes.DeleteSong, id });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
