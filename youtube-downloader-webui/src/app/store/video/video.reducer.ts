import { createReducer, on } from '@ngrx/store';
import { initialVideoState } from '../state/video.state';
import {
  cancelDownload,
  cancelDownloadFail,
  cancelDownloadSuccess,
  downloadVideo,
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
    item: { ...state.item, ...payload },
  })),
  on(getVideoInfoFail, (state, { videoUrl, error }) => ({
    ...state,
    item: {
      ...state.item,
      videoUrl,
    },
    error: error,
  })),
  on(downloadVideo, (state) => ({
    ...state,
    item: {
      ...state.item,
      taskId: '',
      message: '',
    },
  })),
  on(downloadVideoSuccess, (state, { payload }) => ({
    ...state,
    item: {
      ...state.item,
      ...payload,
    },
  })),
  on(downloadVideoFail, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(cancelDownload, (state) => ({ ...state })),
  on(cancelDownloadSuccess, (state, { payload }) => ({
    ...state,
    item: {
      ...state.item,
      ...payload,
    },
  })),
  on(cancelDownloadFail, (state, { error }) => ({
    ...state,
    error: error,
  }))
);
