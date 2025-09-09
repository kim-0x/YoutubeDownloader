import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProgressMessage, IReport } from '../model/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly _progress$: Subject<IProgressMessage[]> = new Subject<
    IProgressMessage[]
  >();
  private readonly _errorMessage$: Subject<string> = new Subject<string>();
  private readonly _completedMessage$: Subject<string> = new Subject<string>();
  private _currentStep: number = 0;

  private _progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();

  public progress$ = this._progress$.asObservable();
  public errorMessage$ = this._errorMessage$.asObservable();
  public completedMessage$ = this._completedMessage$.asObservable();

  public addReport(report: IReport) {
    if (report.type === 'start') {
      this._currentStep = 0;
      this._progressMessage.clear();
      this._errorMessage$.next('');
      this._completedMessage$.next('');
    } else if (report.type === 'progress') {
      this.addProgress(report);
    } else if (report.type === 'completed') {
      this._completedMessage$.next(report.message);
    } else if (report.type === 'error') {
      this._errorMessage$.next(report.message);
    }
  }

  private updateProgress(value: { step: number; progress: IProgressMessage }) {
    this._progressMessage.set(value.step, value.progress);
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
}
