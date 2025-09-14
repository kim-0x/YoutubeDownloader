import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoFormComponent } from './video/form/video-form.component';
import { MatCardModule } from '@angular/material/card';
import { ReportService } from './service/report.service';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VideoFormComponent, MatCardModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('player')
  player?: ElementRef<HTMLAudioElement>;
  private _sanitizer = inject(DomSanitizer);
  private _subscription = new Subscription();

  private readonly _reportService = inject(ReportService);
  private readonly _changeDetection = inject(ChangeDetectorRef);

  readonly currentVideo$ = this._reportService.currentVideo$;
  audioUrl?: SafeResourceUrl;

  ngAfterViewInit(): void {
    this._subscription.add(
      this._reportService.completedMessage$.subscribe((url) => {
        this.audioUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
        this.player?.nativeElement.load();
        this._changeDetection.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
