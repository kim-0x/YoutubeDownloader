import { createReducer, on } from '@ngrx/store';
import {
  loadSongs,
  loadSongsFail,
  loadSongsSuccess,
  selectSong,
} from './song.actions';
import { initialSongState } from '../state/song.state';
import { SongItem } from '../state/song.model';

function findSongDetail(items: Array<SongItem>, title: string) {
  const songDetials = items.flatMap((x) => x.songDetails);
  if (songDetials.length === 0)
    return {
      title: '',
      audioUrl: '',
    };

  const result = songDetials.find((x) => x.title === title);
  return {
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
  }))
);
