import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

import { ServerEvents } from '../../../shared/constants';
import { ClientData } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: SocketIOClient.Socket; // Not sure how this builds without an import :/

  constructor() {
    this.socket = socketIo('http://localhost:8080');

    this.socket.on(ServerEvents.RequestClientInfo, (_, callback: Function) => {
      const clientData: ClientData = {
        name: 'jukebot web client',
        supportedApiVersion: 1
      };

      callback(clientData);
    });
  }

  public subscribe(event: string, callback: (data: any) => void): SocketIOClient.Emitter {
    return this.socket.on(event, callback);
  }

  public unsubscribe(event: string): SocketIOClient.Emitter {
    return this.socket.off(event);
  }

  public emit(event: string, data: any, callback?: Function): SocketIOClient.Socket {
    return this.socket.emit(event, data, callback);
  }
}
