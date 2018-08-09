import * as fs from 'fs';

import { SocketClient } from './socket-client';
import { MopidyClient, MopidyEvents } from './mopidy-client';

const raw = fs.readFileSync('./config.json', { encoding: 'utf8' });
const settings = JSON.parse(raw);

const mopidyClient = new MopidyClient(settings.mopidyUrl);

function handleMopidyOnline(): void {
  const socketClient = new SocketClient(settings.serverUrl, mopidyClient);
  socketClient.initialize();
}

mopidyClient.on(MopidyEvents.Online, () => handleMopidyOnline());
mopidyClient.initialize();
