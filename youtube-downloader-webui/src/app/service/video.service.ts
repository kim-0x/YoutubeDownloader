import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

const VIDEO_API_URL = 'https://localhost:7085/api/video';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly _httpClient = inject(HttpClient);

  public getInfo(videoUrl: string) {
    return this._httpClient.get<{ title: string; duration: string }>(
      `${VIDEO_API_URL}?videoUrl=${encodeURIComponent(videoUrl)}`
    );
  }
}
