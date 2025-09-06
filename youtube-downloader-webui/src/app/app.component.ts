import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { IProgressMessage, IReport } from './model/report.model';
import { NgFor, NgIf, PercentPipe } from '@angular/common';

const HUB_URL = 'https://localhost:7085/hubs/notification';
const DOWNLOAD_API_URL = 'https://localhost:7085/api/download';
const VIDEO_API_URL = 'https://localhost:7085/api/video';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, PercentPipe, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  videoUrl = '';
  videoTitle = '';
  currentStep: number = 0;
  progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  status: string = '';
  outputAudioLink?: string;

  constructor() {
    let connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connection.on('status', (msg) => console.log(msg));
    connection.on('download', (report: IReport) => this.addResult(report));
    try {
      connection.start();
      console.log('Connected to hub.');
    } catch (err) {
      console.log(err);
    }
  }

  ngOnInit(): void {}

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
        .then((data: { videoUrl: string; title: string }) => {
          this.videoTitle = data.title;
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
    this.currentStep = 0;
    this.progressMessage.clear();
    this.status = '';
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
    if (report.type === 'progress') {
      if (report.step) {
        this.currentStep = report.step;
        this.progressMessage.set(report.step, {
          message: report.message,
        });
      } else {
        var msg = this.progressMessage.get(this.currentStep);
        if (msg) {
          msg.percentage = Number(report.message);
          this.progressMessage.set(this.currentStep, msg);
        }
      }
    } else {
      if (report.type === 'completed') {
        this.outputAudioLink = report.message;
      } else {
        this.status = report.message;
      }
    }
  }
}
