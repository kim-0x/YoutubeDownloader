import { createReducer, on } from '@ngrx/store';
import { loadSongs, loadSongsFail, loadSongsSuccess } from './song.actions';
import { initialSongState } from '../state/song.state';

export const songReducer = createReducer(
  initialSongState,
  on(loadSongs, (state) => ({ ...state })),
  on(loadSongsSuccess, (state, { payload }) => ({
    ...state,
    items: payload,
  })),
  on(loadSongsFail, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
