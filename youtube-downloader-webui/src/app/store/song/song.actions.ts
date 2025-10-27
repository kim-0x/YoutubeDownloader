import { createAction, props } from '@ngrx/store';
import { SongDetail, SongItem } from '../state/song.model';

export enum SongActionTypes {
  LoadSongs = '[Song API] Load Songs',
  LoadSongsSuccess = '[Song API] Songs Loaded Success',
  LoadSongsFail = '[Song API] Songs Loaded Error',
  SelectSong = '[Song List Component] Song Selection Change',
  SaveSong = '[Song API] Save a Song',
  SaveSongSuccess = '[Song API] Song Saved Success',
  SaveSongFail = '[Song API] Song Saved Error',
  DeleteSong = '[Song API] Delete a Song',
  DeleteSongSuccess = '[Song API] Song Deleted Success',
  DeleteSongFail = '[Song API] Song Deleted Error',
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

export const saveSong = createAction(
  SongActionTypes.SaveSong,
  props<{ args: SongDetail }>()
);

export const saveSongSuccess = createAction(
  SongActionTypes.SaveSongSuccess,
  props<{ payload: SongDetail }>()
);

export const saveSongFail = createAction(
  SongActionTypes.SaveSongFail,
  props<{ error: string }>()
);

export const deleteSong = createAction(
  SongActionTypes.DeleteSong,
  props<{ id: number }>()
);

export const deleteSongSuccess = createAction(
  SongActionTypes.DeleteSongSuccess,
  props<{ payload: any }>()
);

export const deleteSongFail = createAction(
  SongActionTypes.DeleteSongFail,
  props<{ error: string }>()
);
