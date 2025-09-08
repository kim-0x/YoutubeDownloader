import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ReportService } from './report.service';

const HUB_URL = 'https://localhost:7085/hubs/notification';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private _connection: signalR.HubConnection;
  private readonly _reportService = inject(ReportService);

  constructor() {
    this._connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    this._connection.on('status', (message) => console.log(message));
    this._connection.on('download', (report) =>
      this._reportService.addReport(report)
    );
  }

  public async start(): Promise<void> {
    try {
      await this._connection.start();
      console.log('Connected to hub.');
    } catch (err) {
      console.log(err);
    }
  }
}

// Factory function to initialize SignalR connection in app config
export function signalRInitializer() {
  const signalRService = inject(SignalRService);
  return signalRService.start();
}
