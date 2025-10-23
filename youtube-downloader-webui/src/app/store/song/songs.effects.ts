import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { loadSongs, SongActionTypes } from './song.actions';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const SONG_API_URL = `${environment.apiUrl}/song`;

@Injectable()
export class SongsEffects {
  private _action$ = inject(Actions);
  private _httpClient = inject(HttpClient);

  loadSongs$ = createEffect(() => {
    return this._action$.pipe(
      ofType(SongActionTypes.LoadSongs),
      exhaustMap(() =>
        this._httpClient.get(SONG_API_URL).pipe(
          map((songs) => ({
            type: SongActionTypes.LoadSongsSuccess,
            payload: this.flatResult(new Map(Object.entries(songs))),
          })),
          catchError((error) =>
            of({
              type: SongActionTypes.LoadSongsSuccess,
              error: error,
            })
          )
        )
      )
    );
  });

  saveSong$ = createEffect(() => {
    return this._action$.pipe(
      ofType(SongActionTypes.SaveSong),
      exhaustMap(({ args }) =>
        this._httpClient.post(SONG_API_URL, args).pipe(
          map(() => ({
            type: SongActionTypes.SaveSongSuccess,
            payload: args,
          })),
          catchError((exception) =>
            of({
              type: SongActionTypes.SaveSongFail,
              error: exception.error,
            })
          )
        )
      )
    );
  });

  reloadAfterSaveSongSuccess$ = createEffect(() => {
    return this._action$.pipe(
      ofType(SongActionTypes.SaveSongSuccess),
      map(() => loadSongs())
    );
  });

  private flatResult(
    payload: Map<string, Array<{ id: number; title: string; audioUrl: string }>>
  ) {
    return Array.from(payload).map(([key, value]) => {
      return {
        dateLabel: key,
        songDetails: value,
      };
    });
  }
}
