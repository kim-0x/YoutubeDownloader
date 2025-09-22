import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { VideoActionTypes } from './video.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { Video } from '../state/video.model';

const VIDEO_API_URL = 'https://localhost:7085/api/video';

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
}
