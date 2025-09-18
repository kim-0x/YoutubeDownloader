import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDownloadRequest } from '../model/report.model';
import { firstValueFrom, Subject } from 'rxjs';

const DOWNLOAD_API_URL = 'https://localhost:7085/api/download';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private _currentVideo$: Subject<IDownloadRequest> =
    new Subject<IDownloadRequest>();

  public readonly currentVideo$ = this._currentVideo$.asObservable();

  private readonly _httpClient = inject(HttpClient);

  public async triggerDownload(request: IDownloadRequest) {
    try {
      const _ = await firstValueFrom(
        this._httpClient.post<{ message: string }>(DOWNLOAD_API_URL, request)
      );

      this._currentVideo$.next(request);
    } catch (error) {
      console.error('Download error: ' + error);
    }
  }
}
