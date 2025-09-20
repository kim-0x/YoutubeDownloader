export interface SongState {
  items: Map<string, any[]>;
  error: any;
}

export const initialSongState: SongState = {
  items: new Map([]),
  error: '',
};
