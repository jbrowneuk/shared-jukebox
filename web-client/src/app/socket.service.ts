import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { ServerEvents, ClientData } from 'jukebox-common';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private connectionSubject: BehaviorSubject<boolean>;
  private socket: SocketIOClient.Socket; // Not sure how this builds without an import :/

  constructor() {
    this.connectionSubject = new BehaviorSubject<boolean>(false);
    this.socket = socketIo();

    this.socket.on('connect', () => this.connectionSubject.next(true));
    this.socket.on('disconnect', () => this.connectionSubject.next(false));

    this.socket.on(ServerEvents.RequestClientInfo, (_, callback: Function) => {
      const clientData: ClientData = {
        name: 'jukebot web client',
        supportedApiVersion: 2
      };

      callback(clientData);
    });
  }

  public get connection$(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  public subscribe(event: string, callback: (data: any) => void): SocketIOClient.Emitter {
    return this.socket.on(event, callback);
  }

  public unsubscribe(event: string, fn?: Function): SocketIOClient.Emitter {
    return this.socket.off(event, fn);
  }

  public emit(event: string, data: any, callback?: Function): SocketIOClient.Socket {
    return this.socket.emit(event, data, callback);
  }
}
