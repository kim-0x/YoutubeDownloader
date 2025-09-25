export interface SongItem {
  dateLabel: string;
  songDetails: Array<SongDetail>;
}

export interface SongDetail {
  title: string;
  audioUrl: string;
}
