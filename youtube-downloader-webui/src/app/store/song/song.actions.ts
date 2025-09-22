import { createAction, props } from '@ngrx/store';
import { SongItem } from '../state/song.model';

export enum SongActionTypes {
  LoadSongs = '[Song API] Load Songs',
  LoadSongsSuccess = '[Song API] Songs Loaded Success',
  LoadSongsFail = '[Song API] Songs Loaded Error',
  SelectSong = '[Song List Component] Song Selection Change',
}

export const loadSongs = createAction(SongActionTypes.LoadSongs);

export const loadSongsSuccess = createAction(
  SongActionTypes.LoadSongsSuccess,
  props<{ payload: Array<SongItem> }>()
);

export const loadSongsFail = createAction(
  SongActionTypes.LoadSongsFail,
  props<{ error: any }>()
);

export const selectSong = createAction(
  SongActionTypes.SelectSong,
  props<{ title: string }>()
);
