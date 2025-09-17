import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Subject, withLatestFrom } from 'rxjs';
import {
  IDownloadRequest,
  IProgressMessage,
  IReport,
} from '../model/report.model';
import { DownloadService } from './download.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EventingService } from './eventing.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly _downloadService = inject(DownloadService);

  private readonly _progress$: Subject<IProgressMessage[]> = new Subject<
    IProgressMessage[]
  >();
  private readonly _latestProgress$: Subject<IProgressMessage> =
    new Subject<IProgressMessage>();
  private readonly _errorMessage$: Subject<string> = new Subject<string>();
  private readonly _completedMessage$: Subject<string> = new Subject<string>();
  private _currentStep: number = 0;
  private _sanitizer = inject(DomSanitizer);
  private _eventingService = inject(EventingService);

  private _progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  private _currentVideo$: Subject<IDownloadRequest> =
    new Subject<IDownloadRequest>();

  public progress$ = this._progress$.asObservable();
  public latestProgress$ = this._latestProgress$.asObservable();
  public errorMessage$ = this._errorMessage$.asObservable();
  public completedMessage$ = this._completedMessage$.asObservable();
  public currentVideo$ = this._currentVideo$.asObservable();
  public currentAudio$ = this._completedMessage$.pipe(
    withLatestFrom(this._currentVideo$),
    map(([url, currentVideo]) => ({
      audioUrl: this._sanitizer.bypassSecurityTrustResourceUrl(url),
      title: currentVideo.title,
    }))
  );

  public addReport(report: IReport) {
    switch (report.type) {
      case 'start':
        this.init();
        break;
      case 'progress':
        this.addProgress(report);
        break;
      case 'completed':
        this._completedMessage$.next(report.message);
        this._eventingService.updateCompletedMessage(report.message);
        break;
      default:
        this._errorMessage$.next(report.message);
        this._eventingService.updateErrorMessage(report.message);
        break;
    }
  }

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

  private updateProgress(value: { step: number; progress: IProgressMessage }) {
    this._progressMessage.set(value.step, value.progress);
    this._latestProgress$.next(value.progress);
    this._progress$.next(this.mapToArray(this._progressMessage));
  }

  private mapToArray(progressMessage: Map<number, IProgressMessage>) {
    let result = [];
    const sortedKeys = Array.from(progressMessage.keys()).sort();
    for (let key of sortedKeys) {
      const value = progressMessage.get(key);
      if (value) result.push(value);
    }
    return result;
  }

  private addProgress(report: IReport) {
    if (report.step) {
      this._currentStep = report.step;
      this.updateProgress({
        step: report.step,
        progress: { message: report.message },
      });
    } else {
      var msg = this._progressMessage.get(this._currentStep);
      if (msg) {
        msg.percentage = Number(report.message);
        this.updateProgress({ step: this._currentStep, progress: msg });
      }
    }
  }

  private init() {
    this._currentStep = 0;
    this._progressMessage.clear();
    this._errorMessage$.next('');
  }
}
