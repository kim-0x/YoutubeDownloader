import { SongState } from './song.state';
import { VideoState } from './video.state';

export interface AppState {
  song: SongState;
  video: VideoState;
}

export const songFeatureKey = 'song';
export const videoFeatureKey = 'video';
