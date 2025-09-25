import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { SongState } from '../state/song.state';
import { SongDetail, SongItem } from '../state/song.model';

export const songSelector = (appState: AppState) => appState.song;

export const songItemsSelector = createSelector(
  songSelector,
  (song: SongState) => song.items
);

export const selectedSongSelector = createSelector(
  songSelector,
  (song: SongState) => song.selected
);

export const firstOrDefaultSongSelector = createSelector(
  songItemsSelector,
  (items: SongItem[]) => {
    let detail: SongDetail = { title: '', audioUrl: '' };

    if (items.length > 0 && items[0].songDetails.length > 0) {
      detail.title = items[0].songDetails[0].title;
      detail.audioUrl = items[0].songDetails[0].audioUrl;
    }

    return detail;
  }
);

export const selectedSongTitleSelector = createSelector(
  songSelector,
  (song: SongState) => song.selected.title
);
