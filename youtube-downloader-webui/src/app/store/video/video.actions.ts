import { createAction, props } from '@ngrx/store';
import { DownloadVideo, Video } from '../state/video.model';

export enum VideoActionTypes {
  getVideoInfo = '[Video API] Get Youtube Video by URL',
  getVideoInfoSuccess = '[Video API] Get Video Success',
  getVideoInfoFail = '[Video API] Get Video Fail',
  downloadVideo = '[Video API] Download Video and Convert to a Audio',
  downloadVideoSuccess = '[Video API] Download Video Success',
  downloadVideoFail = '[Video API] Download Video Error',
}

export const getVideoInfo = createAction(
  VideoActionTypes.getVideoInfo,
  props<{ videoUrl: string }>()
);

export const getVideoInfoSuccess = createAction(
  VideoActionTypes.getVideoInfoSuccess,
  props<{ payload: Video }>()
);

export const getVideoInfoFail = createAction(
  VideoActionTypes.getVideoInfoFail,
  props<{ videoUrl: string; error: string }>()
);

export const downloadVideo = createAction(
  VideoActionTypes.downloadVideo,
  props<{ args: DownloadVideo }>()
);

export const downloadVideoSuccess = createAction(
  VideoActionTypes.downloadVideoSuccess,
  props<{ payload: Video }>()
);

export const downloadVideoFail = createAction(
  VideoActionTypes.downloadVideoFail,
  props<{ error: string }>()
);
