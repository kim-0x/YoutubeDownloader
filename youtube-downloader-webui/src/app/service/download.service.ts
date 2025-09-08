import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProgressMessage, IReport } from '../model/report.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private readonly _report$: Subject<IReport> = new Subject<IReport>();
  private readonly _progress$: Subject<Map<number, IProgressMessage>> =
    new Subject<Map<number, IProgressMessage>>();
  private _currentStep: number = 0;

  private _progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();

  public report$ = this._report$.asObservable();
  public progress$ = this._progress$.asObservable();

  public addReport(report: IReport) {
    this._report$.next(report);
    if (report.type === 'progress') {
      this.addProgress(report);
    } else if (report.type === 'start') {
      this._currentStep = 0;
      this._progressMessage.clear();
    }
  }

  private updateProgress(value: { step: number; progress: IProgressMessage }) {
    this._progressMessage.set(value.step, value.progress);
    this._progress$.next(new Map(this._progressMessage));
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
}
