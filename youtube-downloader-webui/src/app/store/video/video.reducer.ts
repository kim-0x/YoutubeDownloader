import { createReducer, on } from '@ngrx/store';
import { initialVideoState } from '../state/video.state';
import {
  downloadVideoFail,
  downloadVideoSuccess,
  getVideoInfo,
  getVideoInfoFail,
  getVideoInfoSuccess,
} from './video.actions';

export const videoReducer = createReducer(
  initialVideoState,
  on(getVideoInfo, (state) => ({ ...state })),
  on(getVideoInfoSuccess, (state, { payload }) => ({
    ...state,
    item: payload,
  })),
  on(getVideoInfoFail, (state, { videoUrl, error }) => ({
    ...state,
    item: {
      ...state.item,
      videoUrl,
    },
    error: error,
  })),
  on(downloadVideoSuccess, (state, { payload }) => ({
    ...state,
    item: { ...state.item, title: payload.title, videoUrl: payload.videoUrl },
  })),
  on(downloadVideoFail, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
