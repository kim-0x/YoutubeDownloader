import { Video } from './video.model';

export interface VideoState {
  item: Video;
  error: any;
}

export const initialVideoState: VideoState = {
  item: {
    videoUrl: '',
    title: '',
    duration: '',
  },
  error: '',
};
