import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;

  constructor() {
    this.socket = socketIo('http://localhost:8080');
    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('client', (data: any, callback: Function) => {
      const clientData = {
        name: 'blah',
        version: 1
      };

      callback(clientData);
    });
  }

  public subscribe(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  public emit(event: string, data: any, callback?: Function): void {
    this.socket.emit(event, data, callback);
  }
}
