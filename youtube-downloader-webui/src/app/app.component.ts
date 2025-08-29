import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';

const url = 'https://localhost:7085/hubs/notification';
interface IReport {
  type: 0 | 1 | 2 | 3; // 0: start, 1: progress, 2: complete, 3: error
  message: string;
  step?: number;
  totalSteps?: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('outputContainer') outputContainer!: ElementRef<HTMLDivElement>;
  title = 'downloader-client';
  url = '';
  log = '';

  constructor() {
    let connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
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
    this.url = input.value;
  }

  download() {
    if (!this.url) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
      fetch('https://localhost:7085/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: this.url }),
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
    if (report.type === 1) {
      this.log +=
        `Progress: ${report.step}/${report.totalSteps} - ${report.message}` +
        '<br/>';
    } else if (report.type === 0) {
      this.log += `Started: ${report.message}` + '<br/>';
    } else if (report.type === 2) {
      this.log += `Completed: ${report.message}` + '<br/>';
    } else if (report.type === 3) {
      this.log += `Error: ${report.message}` + '<br/>';
    } else {
      this.log += JSON.stringify(report) + '<br/>';
    }
    setTimeout(() => {
      this.outputContainer.nativeElement.scrollTop =
        this.outputContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
