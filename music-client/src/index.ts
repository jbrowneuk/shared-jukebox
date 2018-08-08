import { SocketClient } from './socket-client';
import { MopidyClient, MopidyEvents } from './mopidy-client';

const mopidyUrl = 'ws://talon.local:6680/mopidy/ws/';
const socketUrl = 'http://localhost:8080';

const mopidyClient = new MopidyClient(mopidyUrl);

function handleMopidyOnline(): void {
  const socketClient = new SocketClient(socketUrl, mopidyClient);
  socketClient.initialize();
}

mopidyClient.on(MopidyEvents.Online, () => handleMopidyOnline());
mopidyClient.initialize();
