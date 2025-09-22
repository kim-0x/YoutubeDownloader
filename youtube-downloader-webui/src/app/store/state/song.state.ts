import { SongDetail, SongItem } from './song.model';

export interface SongState {
  items: Array<SongItem>;
  selected: SongDetail;
  error: any;
}

export const initialSongState: SongState = {
  items: [],
  error: '',
  selected: { title: '', audioUrl: '' },
};
