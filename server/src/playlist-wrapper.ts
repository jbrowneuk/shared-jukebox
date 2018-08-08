import { Playlist } from './interfaces/playlist';
import { TrackData, PlayState } from 'jukebox-common';

export class PlaylistWrapper implements Playlist {

  private playlist: TrackData[];
  private playstate: PlayState;

  constructor() {
    this.playlist = [];
    this.playstate = PlayState.Stopped;
  }

  getTracks(): TrackData[] {
    return this.playlist;
  }

  getPlayState(): PlayState {
    return this.playstate;
  }

  togglePlaystate(): void {
    if (this.playlist.length > 0) {
      this.playstate = this.playstate === PlayState.Playing ? PlayState.Paused : PlayState.Playing;
    } else {
      this.playstate = PlayState.Stopped;
    }
  }

  setPlaystate(playstate: string): void {
    const sanitizedDebugIdx = playstate.substring(0, 1).toUpperCase() + playstate.substring(1).toLowerCase;
    this.playstate = PlayState[sanitizedDebugIdx];
    console.log(`Set playstate to ${this.playstate}`);
  }

  addTrack(track: TrackData): void {
    this.playlist.push(track);
  }

  removeTrack(track: TrackData): void {
    const indexToRemove = this.playlist.findIndex(t => t.songId === track.songId);
    if (indexToRemove < 0) {
      return;
    }

    this.playlist.splice(indexToRemove, 1);
  }

  findTrackWithId(id: string): TrackData {
    return this.playlist.find(item => item.songId === id);
  }
}
