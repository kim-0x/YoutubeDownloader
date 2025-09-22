import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { SongState } from '../state/song.state';

export const songSelector = (appState: AppState) => appState.song;

export const songItemsSelector = createSelector(
  songSelector,
  (song: SongState) => song.items
);
