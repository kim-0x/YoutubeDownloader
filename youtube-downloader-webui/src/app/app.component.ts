import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProgressMessage, IReport } from './model/report.model';
import { NgFor, NgIf, PercentPipe } from '@angular/common';
import { ReportService } from './service/report.service';
import { filter, Subscription } from 'rxjs';

const DOWNLOAD_API_URL = 'https://localhost:7085/api/download';
const VIDEO_API_URL = 'https://localhost:7085/api/video';

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
      this.getTitle();
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

  getTitle() {
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
      fetch(`${VIDEO_API_URL}?videoUrl=${encodeURIComponent(this.videoUrl)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((data) => data.json())
        .then((data: { videoUrl: string; title: string; duration: string }) => {
          this.videoTitle = data.title;
          this.startAt = '00:00:00';
          this.endAt = data.duration;
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    } catch (err) {
      console.log('download error: ' + err);
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

  download() {
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
      this.clearProgressMessages();
      fetch(DOWNLOAD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl: this.videoUrl,
          title: this.videoTitle,
          startAt: this.startAt,
          endAt: this.endAt,
        }),
      })
        .then((data) => {
          console.log('Success', data);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    } catch (err) {
      console.log('download error: ' + err);
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
