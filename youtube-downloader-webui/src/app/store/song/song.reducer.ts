import { createReducer, on } from '@ngrx/store';
import {
  loadSongs,
  loadSongsFail,
  loadSongsSuccess,
  saveSongFail,
  saveSongSuccess,
  selectSong,
} from './song.actions';
import { initialSongState } from '../state/song.state';
import { SongItem } from '../state/song.model';

function findSongDetail(items: Array<SongItem>, title: string) {
  const songDetails = items.flatMap((x) => x.songDetails);
  if (songDetails.length === 0)
    return {
      id: 0,
      title: '',
      audioUrl: '',
    };

  const result = songDetails.find((x) => x.title === title);
  return {
    id: result ? result.id : 0,
    title: result ? result.title : '',
    audioUrl: result ? result.audioUrl : '',
  };
}

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
  })),
  on(selectSong, (state, { title }) => ({
    ...state,
    selected: findSongDetail(state.items, title),
  })),
  on(saveSongSuccess, (state, { payload }) => ({
    ...state,
    selected: {
      id: payload.id,
      title: payload.title,
      audioUrl: payload.audioUrl,
    },
  })),
  on(saveSongFail, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
