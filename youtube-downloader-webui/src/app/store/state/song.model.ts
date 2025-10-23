export interface SongItem {
  dateLabel: string;
  songDetails: Array<SongDetail>;
}

export interface SongDetail {
  id: number;
  title: string;
  audioUrl: string;
}
