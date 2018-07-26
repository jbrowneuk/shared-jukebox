import { Playlist } from './interfaces/playlist';
import { TrackData } from '../../shared/models';

enum PlayState {
  Paused = 'PAUSED',
  Playing = 'PLAYING',
  Stopped = 'STOPPED'
}

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

  getPlayState(): string {
    return this.playstate;
  }

  togglePlaystate(): string {
    if (this.playlist.length > 0) {
      this.playstate = this.playstate === PlayState.Playing ? PlayState.Paused : PlayState.Playing;
    } else {
      this.playstate = PlayState.Stopped;
    }

    return this.playstate;
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
}
