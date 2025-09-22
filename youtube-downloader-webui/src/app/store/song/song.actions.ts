import { createAction, props } from '@ngrx/store';
import { SongItemState } from '../state/song.state';

export enum SongActionTypes {
  LoadSongs = '[Song API] Load Songs',
  LoadSongsSuccess = '[Song API] Songs Loaded Success',
  LoadSongsFail = '[Song API] Songs Loaded Error',
}

export const loadSongs = createAction(SongActionTypes.LoadSongs);

export const loadSongsSuccess = createAction(
  SongActionTypes.LoadSongsSuccess,
  props<{ payload: Array<SongItemState> }>()
);

export const loadSongsFail = createAction(
  SongActionTypes.LoadSongsFail,
  props<{ error: any }>()
);
