import { SongState } from './song.state';

export interface AppState {
  song: SongState;
}

export const songFeatureKey = 'song';
