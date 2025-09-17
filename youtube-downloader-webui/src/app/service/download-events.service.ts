import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProgressMessage, IReport } from '../model/report.model';

@Injectable({ providedIn: 'root' })
export class DownloadEventsService {
  private readonly _error$: Subject<string> = new Subject<string>();
  private readonly _completed$: Subject<string> = new Subject<string>();
  private readonly _progress$: Subject<IProgressMessage> =
    new Subject<IProgressMessage>();
  private readonly _start$: Subject<void> = new Subject<void>();

  private _progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  private _currentStep: number = 0;

  public error$ = this._error$.asObservable();
  public completed$ = this._completed$.asObservable();
  public progress$ = this._progress$.asObservable();
  public start$ = this._start$.asObservable();

  updateCompletedMessage(arg: string) {
    this._completed$.next(arg);
  }

  updateErrorMessage(arg: string) {
    this._error$.next(arg);
  }

  public dispatchEvent(report: IReport) {
    switch (report.type) {
      case 'start':
        this.init();
        break;
      case 'progress':
        this.addProgress(report);
        break;
      case 'completed':
        this._completed$.next(report.message);
        break;
      default:
        this._error$.next(report.message);
        break;
    }
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

  private updateProgress(value: { step: number; progress: IProgressMessage }) {
    this._progressMessage.set(value.step, value.progress);
    this._progress$.next(value.progress);
  }

  private init() {
    this._currentStep = 0;
    this._progressMessage.clear();
    this._error$.next('');
    this._start$.next();
  }
}
