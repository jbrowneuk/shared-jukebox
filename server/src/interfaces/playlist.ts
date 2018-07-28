import { TrackData } from 'jukebox-common';

export interface Playlist {
  getTracks(): TrackData[];
  getPlayState(): string;
  togglePlaystate(): string;
  addTrack(track: TrackData): void;
  removeTrack(track: TrackData): void;
}
