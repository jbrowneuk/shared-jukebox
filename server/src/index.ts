import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';

import { User, TrackData } from '../../shared/models';

const currentlySupportedVersion = 1;

const settings = {
  port: 8080
};

const app = express();
const server = http.createServer(app);
const socketServer = io(server);
const currentPlaylist: TrackData[] = [];

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
app.use(express.static(__dirname + '/static'));

socketServer.on('connection', (socket: io.Socket) => {
  let userInfo: User;
  console.log('Client connected');
  socket.emit('client', undefined, data => {
    console.log('got client data');

    if (!data || !data.version || data.version < currentlySupportedVersion) {
      socket.emit('require-update', currentlySupportedVersion);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('login', (user: User, callback: Function) => {
    userInfo = user;

    if (!userInfo.name || userInfo.name === '') {
      userInfo.name = 'Suspicious carrot';
    }

    if (!userInfo.ulid || userInfo.ulid === '') {
      userInfo.ulid = 'ulid';
    }

    if (callback) {
      callback(userInfo);
    }

    socket.emit('playlist', currentPlaylist);
  });

  socket.on('request', () => {
    let username;
    if (!userInfo) {
      console.log('fake request!');
      username = 'Server test page';
    } else {
      username = userInfo.name;
    }

    const songWrapper: TrackData = { title: 'title', artist: 'artist', album: 'hello world', songId: '12345', requestedBy: username };
    currentPlaylist.push(songWrapper);
    socketServer.emit('queued-track', songWrapper);
  });

  socket.on('query', (data: string, callback: Function) => {
    if (!callback) {
      return;
    }

    console.log('fake query!');
    const songWrapper: TrackData = { title: 'title', artist: 'artist', album: 'hello world', songId: '12345', requestedBy: '' };
    callback([songWrapper]);
  })
});

server.listen(settings.port, () => {
  console.log(`Server listening on port ${settings.port}`);
});
