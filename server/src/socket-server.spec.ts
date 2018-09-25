import * as http from 'http';
import * as io from 'socket.io';
import { IMock, It, Mock, Times } from 'typemoq';

import { ServerEvents, ClientData } from 'jukebox-common';
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
    beforeEach(() => {
      initializeTestResources();
    });

    it('should emit RequestClientInfo event when handleConnection is called', () => {
      const server = new SocketServer(mockWebServer.object, mockSpotify.object, mockPlaylist.object);
      const untypedServer = server as any;

      untypedServer.handleConnection(mockSocket.object);

      mockSocket.verify(s => s.emit(It.isValue(ServerEvents.RequestClientInfo), It.isAny(), It.isAny()), Times.once());
    });

    it('should emit ClientOutdated if response to RequestClientInfo event returns an outdated client', () => {
      const server = new SocketServer(mockWebServer.object, mockSpotify.object, mockPlaylist.object);
      const untypedServer = server as any;

      let cbfunc: Function;

      mockSocket.setup(s => s.emit(It.isValue(ServerEvents.RequestClientInfo), It.isAny(), It.isAny()))
        .callback((eventName: string, blank: any, cb: Function) => cbfunc = cb);

      untypedServer.handleConnection(mockSocket.object);

      const mockClientData: ClientData = { name: 'test', supportedApiVersion: -1 };

      cbfunc(mockClientData);

      mockSocket.verify(s => s.emit(It.isValue(ServerEvents.ClientOutdated), It.isAny()), Times.once());
    });
  });
});
