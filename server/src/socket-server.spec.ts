import * as http from 'http';
import * as io from 'socket.io';
import { IMock, It, Mock, Times } from 'typemoq';

import { ServerEvents, ClientData, TrackData, PlayState, MusicClientEvents } from 'jukebox-common';
import { SpotifyApi } from './interfaces/spotify-api';

import { SocketServer } from './socket-server';
import { Playlist } from './interfaces/playlist';

/**
 * Unit tests for the {@link SocketServer} class
 *
 * The entirety of the SocketServer’s API is private, but should be relatively
 * unit testable. For now, I abuse the fact JavaScript can access private
 * internals, but this should probably be refactored in the future.
 */
describe('Socket server', () => {
  let mockWebServer: IMock<http.Server>;
  let mockSpotify: IMock<SpotifyApi>;
  let mockPlaylist: IMock<Playlist>;
  let mockSocket: IMock<io.Socket>;

  function initializeTestResources() {
    mockWebServer = Mock.ofType<http.Server>();
    mockSpotify = Mock.ofType<SpotifyApi>();
    mockPlaylist = Mock.ofType<Playlist>();
    mockSocket = Mock.ofType<io.Socket>();
  }

  describe('Connection handling', () => {
    beforeEach(() => initializeTestResources());

    it('should emit RequestClientInfo event when handleConnection is called', () => {
      const server = new SocketServer(
        mockWebServer.object,
        mockSpotify.object,
        mockPlaylist.object
      );
      const untypedServer = server as any;

      untypedServer.handleConnection(mockSocket.object);

      mockSocket.verify(
        s =>
          s.emit(
            It.isValue(ServerEvents.RequestClientInfo),
            It.isAny(),
            It.isAny()
          ),
        Times.once()
      );
    });

    it('should emit ClientOutdated if response to RequestClientInfo event returns an outdated client', () => {
      const server = new SocketServer(
        mockWebServer.object,
        mockSpotify.object,
        mockPlaylist.object
      );
      const untypedServer = server as any;

      let cbfunc: Function;

      mockSocket
        .setup(s =>
          s.emit(
            It.isValue(ServerEvents.RequestClientInfo),
            It.isAny(),
            It.isAny()
          )
        )
        .callback(
          (eventName: string, blank: any, cb: Function) => (cbfunc = cb)
        );

      untypedServer.handleConnection(mockSocket.object);

      const mockClientData: ClientData = {
        name: 'test',
        supportedApiVersion: -1
      };

      cbfunc(mockClientData);

      mockSocket.verify(
        s => s.emit(It.isValue(ServerEvents.ClientOutdated), It.isAny()),
        Times.once()
      );
    });
  });

  describe('Track queueing', () => {
    const mockTrack: TrackData = {
      title: 'mock track',
      album: 'mock album',
      artist: 'amazing',
      songId: 'mocktrack001',
      lengthMs: 10247680
    };

    beforeEach(() => initializeTestResources());

    it('should request the client plays music if a track is added and playlist was empty', () => {
      const server = new SocketServer(
        mockWebServer.object,
        mockSpotify.object,
        mockPlaylist.object
      );
      const untypedServer = server as any;
      untypedServer.server = mockSocket.object;

      const trackList = [];
      mockPlaylist.setup(p => p.getPlayState()).returns(() => PlayState.Stopped);
      mockPlaylist.setup(p => p.getTracks()).returns(() => trackList);
      mockPlaylist.setup(p => p.addTrack(It.isAny())).callback((item: any) => trackList.push(item));

      untypedServer.handleSongRequest(mockTrack);

      mockSocket.verify(s => s.emit(It.isValue(ServerEvents.QueuedTrack), It.isObjectWith(mockTrack)), Times.once());
      mockSocket.verify(s => s.emit(It.isValue(MusicClientEvents.SetPlaystate), It.isValue(PlayState.Playing)), Times.once());
    });

    it('should not change play state if a track is added and there are already tracks in the playlist', () => {
      const server = new SocketServer(
        mockWebServer.object,
        mockSpotify.object,
        mockPlaylist.object
      );
      const untypedServer = server as any;
      untypedServer.server = mockSocket.object;

      const trackList = [mockTrack];
      mockPlaylist.setup(p => p.getPlayState()).returns(() => PlayState.Stopped);
      mockPlaylist.setup(p => p.getTracks()).returns(() => trackList);
      mockPlaylist.setup(p => p.addTrack(It.isAny())).callback((item: any) => trackList.push(item));

      untypedServer.handleSongRequest(mockTrack);

      mockSocket.verify(s => s.emit(It.isValue(ServerEvents.QueuedTrack), It.isObjectWith(mockTrack)), Times.once());
      mockSocket.verify(s => s.emit(It.isValue(MusicClientEvents.SetPlaystate), It.isAny()), Times.never());
    });
  });
});
