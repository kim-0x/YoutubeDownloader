export interface IReport {
  type: 'error' | 'start' | 'progress' | 'completed';
  message: string;
  step?: number;
  totalSteps?: number;
}

export interface IProgressMessage {
  message: string;
  percentage?: number;
}

export interface IDownloadRequest {
  videoUrl: string;
  title: string;
  startAt: string;
  endAt: string;
}
