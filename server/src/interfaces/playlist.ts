import { TrackData, PlayState } from 'jukebox-common';

export interface Playlist {
  getTracks(): TrackData[];
  getPlayState(): PlayState;
  setPlaystate(playstate: PlayState): void;
  togglePlaystate(): void;
  addTrack(track: TrackData): void;
  removeTrack(track: TrackData): void;
  findTrackWithId(id: string): TrackData;
}
