import { IMock, Mock, It, Times } from 'typemoq';

import * as socketClient from './utils/socket-client';

import { SocketService } from './socket.service';
import { ServerEvents } from 'jukebox-common';

describe('SocketService', () => {
  let socket: IMock<SocketIOClient.Socket>;

  beforeEach(() => {
    socket = Mock.ofType<SocketIOClient.Socket>();
    spyOn(socketClient, 'generateSocketClient').and.returnValue(socket.object);
  });

  it('should be created and subscribe to socket connection events', () => {
    const service = new SocketService();
    expect(service).toBeTruthy();

    socket.verify(s => s.on(It.isValue('connect'), It.isAny()), Times.once());
    socket.verify(s => s.on(It.isValue('disconnect'), It.isAny()), Times.once());
  });

  it('should report socket connection status', (done: DoneFn) => {
    const states = [];
    let connectFunc: Function = null;
    let disconnectFunc: Function = null;

    socket.setup(s => s.on(It.isValue('connect'), It.isAny())).callback((_, callback: Function) => {
      connectFunc = callback;
    });

    socket.setup(s => s.on(It.isValue('disconnect'), It.isAny())).callback((_, callback: Function) => {
      disconnectFunc = callback;
    });

    const service = new SocketService();
    service.connection$.subscribe(
      (status: boolean) => {
        states.push(status);

        // Initial state + connected + disconnected
        if (states.length === 3) {
          expect(states).toEqual([false, true, false]);
          done();
        }
      },
      (err: Error) => fail(err),
      () => {}
    );

    connectFunc();
    disconnectFunc();
  });

  it('should send client information when requested', (done: DoneFn) => {
    let requestFunc: Function = null;
    socket.setup(s => s.on(It.isValue(ServerEvents.RequestClientInfo), It.isAny())).callback((_, callback: Function) => {
      requestFunc = callback;
    });

    const service = new SocketService();
    expect(service).toBeTruthy();

    requestFunc(null, (data) => {
      expect(data.name).toBeTruthy();
      expect(data.supportedApiVersion).toBeTruthy();
      done();
    });
  });

  it('should emit to socket', () => {
    const event = 'EVENT';
    const payload = { dollars: 1000000 };

    const service = new SocketService();
    service.emit(event, payload);

    socket.verify(s => s.emit(It.isValue(event), It.isValue(payload), It.isAny()), Times.once());
  });

  it('should add subscriber to socket', () => {
    socket.setup(s => s.on(It.isAny(), It.isAny()));

    const eventName = 'COMPLEX TRIANGULAR RELATIONSHIP BREAK';

    const service = new SocketService();
    service.subscribe(eventName, () => {});

    socket.verify(s => s.on(It.isValue(eventName), It.isAny()), Times.once());
  });

  it('should remove subscriber from socket', () => {
    socket.setup(s => s.off(It.isAny(), It.isAny()));

    const eventName = 'bought it for son as he request';

    const service = new SocketService();
    service.unsubscribe(eventName, () => {});

    socket.verify(s => s.off(It.isValue(eventName), It.isAny()), Times.once());
  });
});
