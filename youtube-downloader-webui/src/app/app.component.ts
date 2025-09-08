import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProgressMessage, IReport } from './model/report.model';
import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { ReportService } from './service/report.service';
import { filter, firstValueFrom, Subscription } from 'rxjs';
import { DownloadService } from './service/download.service';
import { VideoService } from './service/video.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, PercentPipe, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  // input -> read&write
  downloadForm: FormGroup;
  // output -> read
  progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  errorMessage: string = '';
  outputAudioLink?: string;
  // service
  private readonly _reportService = inject(ReportService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _videoService = inject(VideoService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _subscription = new Subscription();

  constructor() {
    this.downloadForm = this._formBuilder.group({
      videoUrl: [''],
      title: [''],
      startAt: [''],
      endAt: [''],
    });
  }

  ngOnInit(): void {
    this._subscription.add(
      this._reportService.stage$
        .pipe(filter((report) => report.type !== 'progress'))
        .subscribe(this.addResult.bind(this))
    );

    this._subscription.add(
      this._reportService.progress$.subscribe((progress) => {
        this.progressMessage = progress;
      })
    );

    this._subscription.add(
      this.downloadForm.get('videoUrl')?.valueChanges.subscribe((url) => {
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

  get progressMessageKeys(): number[] {
    return Array.from(this.progressMessage.keys()).sort();
  }

  private clearProgressMessages() {
    this.progressMessage.clear();
    this.errorMessage = '';
    this.outputAudioLink = undefined;
  }

  async download() {
    const { videoUrl, title, startAt, endAt } = this.downloadForm.value;

    if (!videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      this.clearProgressMessages();
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

  private addResult(report: IReport) {
    if (report.type === 'completed') {
      this.outputAudioLink = report.message;
    } else if (report.type === 'error') {
      this.errorMessage = report.message;
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
