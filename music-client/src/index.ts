import * as io from 'socket.io-client';

const socket = io('http://localhost:8080'); // address

let playlist = [];

socket.on('client', (_: any, fn: Function) => {
  const client = {
    name: 'music-service',
    version: 1
  };

  fn(client);
});

socket.on('playlist', (data: any[]) => {
  console.log('got ' + data.length + ' items')
  playlist = data;
});

socket.on('queued-track', (data: any) => {
  console.log('got a song')
  playlist.push(data);
  console.log('try playing now');
});
