
import { IMock, Mock, It, Times } from 'typemoq';

import { SocketService } from './socket.service';
import { PlaylistService } from './playlist.service';
import { WebClientEvents } from '../../node_modules/jukebox-common';

describe('PlaylistService', () => {
  let mockSocketService: IMock<SocketService>;

  beforeEach(() => {
    mockSocketService = Mock.ofType<SocketService>();
  });

  it('should be created', () => {
    const service = new PlaylistService(mockSocketService.object);

    expect(service).toBeTruthy();
    expect(service.tracks).toEqual([]);
  });

  it('should request playlist and state on construction', () => {
    mockSocketService.setup(s => s.emit(It.isAny(), It.isAny(), It.isAny()));

    const service = new PlaylistService(mockSocketService.object);
    expect(service).toBeTruthy();

    mockSocketService.verify(s => s.emit(It.isValue(WebClientEvents.RequestPlaylist), It.isValue(null), It.isAny()), Times.once());
    mockSocketService.verify(s => s.emit(It.isValue(WebClientEvents.RequestPlaystate), It.isValue(null), It.isAny()), Times.once());
  });
});
