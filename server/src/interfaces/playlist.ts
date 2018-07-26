import { TrackData } from '../../../shared/models';

export interface Playlist {
  getTracks(): TrackData[];
  getPlayState(): string;
  togglePlaystate(): string;
  addTrack(track: TrackData): void;
  removeTrack(track: TrackData): void;
}
