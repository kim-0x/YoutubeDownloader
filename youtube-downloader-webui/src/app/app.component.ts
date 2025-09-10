import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgFor, NgIf, PercentPipe } from '@angular/common';
import { ReportService } from './service/report.service';
import { debounceTime, firstValueFrom, Subscription } from 'rxjs';
import { DownloadService } from './service/download.service';
import { VideoService } from './service/video.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    NgFor,
    NgIf,
    PercentPipe,
    AsyncPipe,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _reportService = inject(ReportService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _videoService = inject(VideoService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _subscription = new Subscription();

  readonly downloadForm: FormGroup = this._formBuilder.group({
    videoUrl: [''],
    title: [''],
    startAt: [''],
    endAt: [''],
  });

  readonly progressMessage$ = this._reportService.progress$;
  readonly errorMessage$ = this._reportService.errorMessage$;
  readonly outputAudioLink$ = this._reportService.completedMessage$;

  ngOnInit(): void {
    this._subscription.add(
      this.downloadForm
        .get('videoUrl')
        ?.valueChanges.pipe(debounceTime(150))
        .subscribe((url) => {
          if (url) this.getInfo(url);
        })
    );
  }

  async getInfo(url: string) {
    if (!url) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const result = await firstValueFrom(this._videoService.getInfo(url));
      this.downloadForm.patchValue({
        title: result.title,
        startAt: '00:00:00',
        endAt: result.duration,
      });
    } catch (err) {
      console.error('Get video info error: ' + err);
    }
  }

  async download() {
    const { videoUrl, title, startAt, endAt } = this.downloadForm.value;

    if (!videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const result = await firstValueFrom(
        this._downloadService.triggerDownload({
          videoUrl,
          title,
          startAt,
          endAt,
        })
      );
      console.log('Download initiated, ' + result.message);
    } catch (err) {
      console.error('Download error: ' + err);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
