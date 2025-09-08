import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IReport } from '../model/report.model';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private readonly _report$: Subject<IReport> = new Subject<IReport>();

  public report$ = this._report$.asObservable();

  public addReport(report: IReport) {
    this._report$.next(report);
  }
}
