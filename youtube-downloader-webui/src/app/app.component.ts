import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProgressMessage, IReport } from './model/report.model';
import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { ReportService } from './service/report.service';
import { filter, firstValueFrom, Subscription } from 'rxjs';
import { DownloadService } from './service/download.service';
import { VideoService } from './service/video.service';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, PercentPipe, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  videoUrl = '';
  videoTitle = '';
  startAt = '';
  endAt = '';
  progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  errorMessage: string = '';
  outputAudioLink?: string;
  private readonly _reportService = inject(ReportService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _videoService = inject(VideoService);
  private readonly _subscription = new Subscription();

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
  }

  onUrlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.videoUrl = input.value;
    if (this.videoUrl) {
      this.getInfo();
    }
  }

  onTitleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.videoTitle = input.value;
  }

  onStartAtChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.startAt = input.value;
  }

  onEndAtChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.endAt = input.value;
  }

  async getInfo() {
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      const result = await firstValueFrom(
        this._videoService.getInfo(this.videoUrl)
      );

      this.videoTitle = result.title;
      this.startAt = '00:00:00';
      this.endAt = result.duration;
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
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }

    try {
      this.clearProgressMessages();
      const result = await firstValueFrom(
        this._downloadService.triggerDownload({
          videoUrl: this.videoUrl,
          title: this.videoTitle,
          startAt: this.startAt,
          endAt: this.endAt,
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
