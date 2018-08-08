import * as socketIo from 'socket.io-client';

export function generateSocketClient(): SocketIOClient.Socket {
  return socketIo();
}
