import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { IProgressMessage, IReport } from './model/report.model';
import { NgFor, NgIf, PercentPipe } from '@angular/common';

const HUB_URL = 'https://localhost:7085/hubs/notification';
const API_URL = 'https://localhost:7085/api/download';

@Component({
  selector: 'app-root',
  imports: [NgFor, NgIf, PercentPipe, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  videoUrl = '';
  currentStep: number = 0;
  progressMessage: Map<number, IProgressMessage> = new Map<
    number,
    IProgressMessage
  >();
  status: string = '';

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

  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.videoUrl = input.value;
  }

  get progressMessageKeys(): number[] {
    return Array.from(this.progressMessage.keys()).sort();
  }

  private clearProgressMessages() {
    this.currentStep = 0;
    this.progressMessage.clear();
    this.status = '';
  }

  download() {
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
      this.clearProgressMessages();
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: this.videoUrl }),
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
      this.status = report.message;
    }
  }
}
