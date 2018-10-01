import { IMock, Mock } from 'typemoq';
import { MopidyClient } from './mopidy-client';
import { SocketClient } from './socket-client';

describe('Socket client', () => {
  let musicClientMock: IMock<MopidyClient>;

  beforeEach(() => {
    musicClientMock = Mock.ofType<MopidyClient>();
  });

  it('should construct', () => {
    const socketClient = new SocketClient('anyurl', musicClientMock.object);
    expect(socketClient).toBeTruthy();
  });
});
