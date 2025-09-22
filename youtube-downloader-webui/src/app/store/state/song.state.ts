export interface SongState {
  items: Array<SongItemState>;
  selected: SongDetailState;
  error: any;
}

export const initialSongState: SongState = {
  items: [],
  error: '',
  selected: { title: '', audioUrl: '' },
};

export interface SongItemState {
  dateLabel: string;
  songDetails: Array<SongDetailState>;
}

export interface SongDetailState {
  title: string;
  audioUrl: string;
}
