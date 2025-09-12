import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
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
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('player')
  player?: ElementRef<HTMLAudioElement>;
  private _sanitizer = inject(DomSanitizer);
  private _subscription = new Subscription();

  private readonly _reportService = inject(ReportService);

  readonly currentVideo$ = this._reportService.currentVideo$;
  audioUrl?: SafeResourceUrl;

  ngOnInit(): void {
    this._subscription.add(
      this._reportService.completedMessage$.subscribe(async (url) => {
        this.audioUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
        if (this.audioUrl) {
          await this.verifyAudio();
          this.player?.nativeElement.load();
        } else {
          console.warn('audio file not ready yet.');
        }
      })
    );
  }

  async verifyAudio() {
    let retry = 0;
    while (
      !(
        this.player?.nativeElement.readyState ===
        HTMLMediaElement.HAVE_ENOUGH_DATA
      ) &&
      retry < 3
    ) {
      await this.sleep(1000);
      retry++;
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
