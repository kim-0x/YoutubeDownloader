import { createSelector } from '@ngrx/store';
import { AppState } from '../state';
import { VideoState } from '../state/video.state';

export const videoSelector = (appState: AppState) => appState.video;

export const videoInfoSelector = createSelector(
  videoSelector,
  (state: VideoState) => state.item
);
