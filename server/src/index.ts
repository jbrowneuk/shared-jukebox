import * as express from 'express';
import * as http from 'http';
import * as io from 'socket.io';

const currentlySupportedVersion = 1;

const settings = {
  port: 8080
};

const app = express();
const server = http.createServer(app);
const socketServer = io(server);
const currentPlaylist = [];

app.use(express.static(__dirname + '/static'));

socketServer.on('connection', (socket: io.Socket) => {
  console.log('Client connected');
  socket.emit('client', undefined, (data) => {
    console.log('got client data');

    if (!data || !data.version || data.version < currentlySupportedVersion) {
      socket.emit('require-update', currentlySupportedVersion);
    }

    socket.emit('playlist', currentPlaylist);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('request', () => {
    console.log('fake request!');

    const songWrapper = { title: 'title', artist: 'artist', songId: '12345' };
    currentPlaylist.push(songWrapper);
    socketServer.emit('queued-track', songWrapper);
  });
});

server.listen(settings.port, () => {
  console.log(`Server listening on port ${settings.port}`);
});
