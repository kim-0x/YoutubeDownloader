import { createAction, props } from '@ngrx/store';
import { Video } from '../state/video.model';

export enum VideoActionTypes {
  getVideoInfo = '[Video Component] Get Youtube Video by URL',
  getVideoInfoSuccess = '[Video API] Get Video Success',
  getVideoInfoFail = '[Video API] Get Video Fail',
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
