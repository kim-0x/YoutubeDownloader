import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { SongActionTypes } from './song.actions';
import { HttpClient } from '@angular/common/http';

const SONG_API_URL = 'https://localhost:7085/api/song';

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
            payload: new Map(Object.entries(songs)),
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
}
