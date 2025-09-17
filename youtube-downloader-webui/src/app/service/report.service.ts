import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { IDownloadRequest } from '../model/report.model';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly _downloadService = inject(DownloadService);

  private _currentVideo$: Subject<IDownloadRequest> =
    new Subject<IDownloadRequest>();

  public currentVideo$ = this._currentVideo$.asObservable();

  public async dispatchDownload(downloadRequest: IDownloadRequest) {
    try {
      await firstValueFrom(
        this._downloadService.triggerDownload(downloadRequest)
      );
      this._currentVideo$.next(downloadRequest);
    } catch (error) {
      console.error('Download error: ' + error);
    }
  }
}
