import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventingService {
  private readonly _errorMessage$: Subject<string> = new Subject<string>();
  private readonly _completedMessage$: Subject<string> = new Subject<string>();

  public errorMessage$ = this._errorMessage$.asObservable();
  public completedMessage$ = this._completedMessage$.asObservable();

  updateCompletedMessage(arg: string) {
    this._completedMessage$.next(arg);
  }

  updateErrorMessage(arg: string) {
    this._errorMessage$.next(arg);
  }
}
