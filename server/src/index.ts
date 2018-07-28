import * as express from 'express';
import * as http from 'http';
import * as fs from 'fs';

import { SocketServer } from './socket-server';
import { SpotifyWrapper } from './spotify-wrapper';
import { PlaylistWrapper } from './playlist-wrapper';

const app = express();
const server = http.createServer(app);

const raw = fs.readFileSync('./config.json', { encoding: 'utf8' });
const settings = JSON.parse(raw);

const spotifyWrapper = new SpotifyWrapper();
spotifyWrapper.initialize(settings.spotify.clientId, settings.spotify.clientSecret);

const playlist = new PlaylistWrapper();

const socketServer = new SocketServer(server, spotifyWrapper, playlist);
socketServer.initialize();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.static(__dirname + '/static'));

server.listen(settings.port, () => {
  console.log(`Server listening on port ${settings.port}`);
});
