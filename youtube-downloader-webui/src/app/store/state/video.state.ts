import { RunningTask, Video } from './video.model';

export interface VideoState {
  item: Video & RunningTask;
  error: any;
}

export const initialVideoState: VideoState = {
  item: {
    videoUrl: '',
    title: '',
    duration: '',
    taskId: '',
    message: '',
  },
  error: '',
};
