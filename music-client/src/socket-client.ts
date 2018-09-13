import * as io from 'socket.io-client';

import {
  ServerEvents,
  WebClientEvents,
  MusicClientEvents,
  ClientData,
  TrackData,
  PlayState
} from 'jukebox-common';

import { MopidyClient, MopidyEvents } from './mopidy-client';

export class SocketClient {
  private socket: SocketIOClient.Socket;

  constructor(private serverUrl: string, private client: MopidyClient) {}

  public initialize(): void {
    this.socket = io(this.serverUrl);
    this.socket.on('connect', () => this.onConnected());
    this.socket.on('disconnect', () => this.onDisconnected());
    this.socket.on(
      ServerEvents.RequestClientInfo,
      (_: any, callback: Function) => this.onRequestedClientInfo(callback)
    );
    this.socket.on(ServerEvents.QueuedTrack, (track: TrackData) =>
      this.onQueuedTrack(track)
    );
    this.socket.on(MusicClientEvents.SetPlaystate, (state: PlayState) =>
      this.onReceivedPlayState(state)
    );

    this.client.on(MopidyEvents.TrackComplete, (uri: string) => {
      this.socket.emit(MusicClientEvents.DequeueTrack, uri);
    });

    this.client.on(MopidyEvents.PlayStateChanged, (state: PlayState) => {
      this.socket.emit(MusicClientEvents.ChangedPlayState, state);
    });

    this.client.on(MusicClientEvents.SkipTrack, () => this.skipTrack());
  }

  private onConnected(): void {
    console.log('Connected');

    this.socket.emit(
      WebClientEvents.RequestPlaylist,
      null,
      (tracks: TrackData[]) => this.handlePlaylistResponse(tracks)
    );
  }

  private onDisconnected(): void {
    console.log('Disconnected');
    this.client.clearTracks();
  }

  private onRequestedClientInfo(callback: Function): void {
    const clientInfo: ClientData = {
      name: 'jukebox-player',
      supportedApiVersion: 2
    };

    callback(clientInfo);
  }

  private onQueuedTrack(track: TrackData): void {
    if (!track || !track.songId) {
      return;
    }

    console.log(`Got a song with the id '${track.songId}`);

    // Push to mopidy
    this.client.queueTrack(track.songId);
  }

  private onReceivedPlayState(newState: PlayState): void {
    console.log('play state request:', newState);
    this.client.setPlayState(newState);
  }

  private handlePlaylistResponse(tracks: TrackData[]): void {
    // Push to mopidy
    const promises = tracks.map(track => this.client.queueTrack(track.songId));

    promises
      .reduce((prev, current) => {
        console.log('Adding a track');
        return prev.then(() => current);
      }, Promise.resolve())
      .then(() => console.log('Added current playlist'));

    // this.socket.emit(WebClientEvents.RequestPlaystate, null, (tracks: TrackData[]) => {});
  }

  private skipTrack(): void {
    console.log('Asking mopidy to skip current track');
    this.client.skipTrack();
  }
}
