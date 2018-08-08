import * as http from 'http';
import * as io from 'socket.io';

import { ClientData, TrackData, ServerEvents, MusicClientEvents, WebClientEvents, PlayState } from 'jukebox-common';
import { SpotifyApi } from './interfaces/spotify-api';
import { Playlist } from './interfaces/playlist';

const currentlySupportedApiVersion = 2;

export class SocketServer {
  private server: io.Server;

  constructor(
    private webServer: http.Server,
    private spotifyClient: SpotifyApi,
    private playlistClient: Playlist
  ) {}

  public initialize(): void {
    this.server = io(this.webServer);
    this.server.on('connection', (socket: io.Socket) =>
      this.handleConnection(socket)
    );
  }

  /**
   * Sets up all event handlers and related variables when a client joins the server.
   *
   * @param socket Socket server instance
   */
  private handleConnection(socket: io.Socket): void {

    // As soon as a client joins, request information on it
    socket.emit(
      ServerEvents.RequestClientInfo,
      null,
      (data: ClientData) => {
        if (
          !data ||
          !data.supportedApiVersion ||
          data.supportedApiVersion < currentlySupportedApiVersion
        ) {
          socket.emit(
            ServerEvents.ClientOutdated,
            currentlySupportedApiVersion
          );
        }
      }
    );

    socket.on(
      WebClientEvents.SearchQuery,
      (searchTerm: string, callback: Function) =>
        this.handleSearchQuery(searchTerm, callback)
    );

    socket.on(
      WebClientEvents.SongRequest,
      (trackInfo: TrackData, callback: Function) =>
        this.handleSongRequest(trackInfo, callback)
    );

    socket.on(WebClientEvents.RequestPlaylist, (_, callback: Function) =>
      this.handlePlaylistRequest(callback)
    );

    socket.on(WebClientEvents.RequestPlaystate, (_, callback: Function) =>
      this.handlePlaystateRequest(callback)
    );

    socket.on(WebClientEvents.ChangePlaystate, (newState: string) => this.togglePlaystate(socket, newState));

    socket.on(MusicClientEvents.DequeueTrack, (uri: string) => this.handleDequeueTrack(uri));
  }

  private handleSearchQuery(
    searchTerm: string,
    callback: Function
  ): void {
    if (!searchTerm || !callback || typeof callback !== 'function') {
      return;
    }

    const typedSearchTerm = `${searchTerm}`;
    if (typedSearchTerm.length === 0) {
      callback(null);
    }

    this.spotifyClient
      .search(typedSearchTerm)
      .then((result: TrackData) => callback(result))
      .catch((err: any) => {
        console.error(err);
        callback(null);
      });
  }

  private handleSongRequest(
    trackInfo: TrackData,
    callback: Function
  ): void {
    if (!trackInfo || !trackInfo.songId) {
      return;
    }

    const saferTrackInfo: TrackData = {
      title: trackInfo.title || 'Unknown track',
      album: trackInfo.album || 'Unknown album',
      artist: trackInfo.artist || 'Unknown artist',
      songId: trackInfo.songId,
      lengthMs: trackInfo.lengthMs || 0
    };

    this.playlistClient.addTrack(saferTrackInfo);
    this.server.emit(ServerEvents.QueuedTrack, saferTrackInfo);

    if (callback && typeof callback === 'function') {
      callback(saferTrackInfo);
    }
  }

  private handlePlaylistRequest(callback: Function): void {
    if (!callback || typeof callback !== 'function') {
      return;
    }

    callback(this.playlistClient.getTracks());
  }

  private handlePlaystateRequest(callback: Function): void {
    if (!callback || typeof callback !== 'function') {
      return;
    }

    callback(this.playlistClient.getPlayState());
  }

  private togglePlaystate(socket: io.Socket, newState: string): void {
    const currentState = this.playlistClient.getPlayState();

    console.log('New state:', newState);
    console.log('current state:', currentState);

    if (newState === 'toggle') {
      console.log('Toggling');
      this.playlistClient.togglePlaystate();
    } else {
      this.playlistClient.setPlaystate(PlayState.Playing); // TODO
    }

    const requestedPlaystate = this.playlistClient.getPlayState();
    console.log('Setting state:', requestedPlaystate);
    socket.broadcast.emit(MusicClientEvents.SetPlaystate, requestedPlaystate);

    // Propagate the playstate changed event to all clients // TODO: this doesn't sync very well
    this.server.emit(ServerEvents.PlaystateChanged, this.playlistClient.getPlayState());
  }

  private handleDequeueTrack(uri: string): void {
    // TODO: sync with playlist client
    const data = this.playlistClient.findTrackWithId(uri);
    if (data) {
      this.playlistClient.removeTrack(data);
    }

    this.server.emit(ServerEvents.DequeuedTrack, uri);
  }
}
