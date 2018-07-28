import * as http from 'http';
import * as io from 'socket.io';
import * as Haikunator from 'haikunator';

import { ClientData, TrackData, User, ServerEvents, MusicClientEvents, WebClientEvents } from 'jukebox-common';
import { SpotifyApi } from './interfaces/spotify-api';
import { Playlist } from './interfaces/playlist';

const currentlySupportedApiVersion = 1;
const haikunator = new Haikunator();

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
    let userInfo: User;

    // As soon as a client joins, request information on it
    socket.emit(
      ServerEvents.RequestClientInfo,
      undefined,
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
      WebClientEvents.ClientSentLogin,
      (user: User, callback: Function) => {
        userInfo = this.handleClientLogin(user, callback);
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
        this.handleSongRequest(trackInfo, userInfo, callback)
    );

    socket.on(WebClientEvents.RequestPlaylist, (_, callback: Function) =>
      this.handlePlaylistRequest(callback)
    );

    socket.on(WebClientEvents.RequestPlaystate, (_, callback: Function) =>
      this.handlePlaystateRequest(callback)
    );

    socket.on(WebClientEvents.ChangePlaystate, () => this.togglePlaystate(socket));
  }

  private handleClientLogin(user: User, callback: Function): User {
    let safeUsername;
    if (!user.name || user.name === '') {
      safeUsername = haikunator.haikunate({ tokenLength: 0, delimiter: ' ' });
    } else {
      safeUsername = user.name;
    }

    const userInfo: User = {
      name: safeUsername
    };

    if (callback && typeof callback === 'function') {
      callback(userInfo);
    }

    return userInfo;
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
    userInfo: User,
    callback: Function
  ): void {
    if (!trackInfo) {
      return;
    }

    const username = userInfo.name || 'unknown';
    const saferTrackInfo: TrackData = {
      title: trackInfo.title,
      album: trackInfo.album,
      artist: trackInfo.artist,
      songId: trackInfo.songId,
      requestedBy: username
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

  private togglePlaystate(socket: io.Socket): void {
    const requestedPlaystate = this.playlistClient.togglePlaystate(); // Kinda debug, depends more on the client
    socket.broadcast.emit(MusicClientEvents.SetPlaystate, requestedPlaystate);

    // Debug (for front-end visuals)
    socket.emit(ServerEvents.PlaystateChanged, requestedPlaystate);
  }
}
