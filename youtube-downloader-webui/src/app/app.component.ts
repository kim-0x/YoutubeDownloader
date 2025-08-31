import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { IReport, formatReport } from './model/report.model';

const HUB_URL = 'https://localhost:7085/hubs/notification';
const API_URL = 'https://localhost:7085/api/download';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('outputContainer') outputContainer!: ElementRef<HTMLDivElement>;

  videoUrl = '';
  log = '';

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

  download() {
    if (!this.videoUrl) {
      alert('Please enter a valid URL.');
      return;
    }
    try {
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
    this.log += formatReport(report);
    setTimeout(() => {
      this.outputContainer.nativeElement.scrollTop =
        this.outputContainer.nativeElement.scrollHeight;
    }, 100);
  }
}
