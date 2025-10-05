import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { VideoActionTypes } from './video.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { RunningTask, Video } from '../state/video.model';
import { environment } from '../../../environments/environment';

const VIDEO_API_URL = `${environment.apiUrl}/video`;
const DOWNLOAD_API_URL = `${environment.apiUrl}/download`;

@Injectable()
export class VideoEffects {
  private readonly _action$ = inject(Actions);
  private readonly _httpClient = inject(HttpClient);

  getVideoInfo = createEffect(() => {
    return this._action$.pipe(
      ofType(VideoActionTypes.getVideoInfo),
      switchMap(({ videoUrl }) =>
        this._httpClient
          .get<Video>(
            `${VIDEO_API_URL}?videoUrl=${encodeURIComponent(videoUrl)}`
          )
          .pipe(
            map((value: Video) => ({
              type: VideoActionTypes.getVideoInfoSuccess,
              payload: value,
            })),
            catchError((exception) =>
              of({
                type: VideoActionTypes.getVideoInfoFail,
                videoUrl,
                error: exception.error,
              })
            )
          )
      )
    );
  });

  downloadVideo = createEffect(() => {
    return this._action$.pipe(
      ofType(VideoActionTypes.downloadVideo),
      switchMap(({ args }) =>
        this._httpClient.post<RunningTask>(DOWNLOAD_API_URL, args).pipe(
          map((response) => ({
            type: VideoActionTypes.downloadVideoSuccess,
            payload: {
              videoUrl: args.videoUrl,
              title: args.title,
              taskId: response.taskId,
              message: response.message,
            },
          })),
          catchError((exception) =>
            of({
              type: VideoActionTypes.downloadVideoFail,
              error: exception.error,
            })
          )
        )
      )
    );
  });

  cancelDownload = createEffect(() => {
    return this._action$.pipe(
      ofType(VideoActionTypes.cancelDownload),
      switchMap(({ taskId }) =>
        this._httpClient
          .post<RunningTask>(`${DOWNLOAD_API_URL}/${taskId}/cancel`, {})
          .pipe(
            map((response) => ({
              type: VideoActionTypes.cancelDownloadSuccess,
              payload: {
                taskId: response.taskId,
                message: response.message,
              },
            })),
            catchError((exception) =>
              of({
                type: VideoActionTypes.cancelDownloadFail,
                error: exception.error,
              })
            )
          )
      )
    );
  });
}
