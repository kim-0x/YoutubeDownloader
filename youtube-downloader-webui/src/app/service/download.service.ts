import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDownloadRequest } from '../model/report.model';

const DOWNLOAD_API_URL = 'https://localhost:7085/api/download';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly _httpClient = inject(HttpClient);

  public triggerDownload(request: IDownloadRequest) {
    return this._httpClient.post<{ message: string }>(
      DOWNLOAD_API_URL,
      request
    );
  }
}
