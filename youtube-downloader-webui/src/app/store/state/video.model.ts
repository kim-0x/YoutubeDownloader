export interface Video {
  videoUrl: string;
  title: string;
  duration: string;
}

export interface DownloadVideo {
  videoUrl: string;
  title: string;
  startAt: string;
  endAt: string;
}
