import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { SongState } from '../state/song.state';

export const songSelector = (appState: AppState) => appState.song;

export const songItemsSelector = createSelector(
  songSelector,
  (song: SongState) => song.items
);

export const selectedSongSelector = createSelector(
  songSelector,
  (song: SongState) => song.selected
);

export const selectedSongTitleSelector = createSelector(
  songSelector,
  (song: SongState) => song.selected.title
);
