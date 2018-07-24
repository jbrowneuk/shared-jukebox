import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;

  constructor() {
    this.socket = socketIo('http://localhost');
    this.socket.on('connect', () => {
      console.log('Connected');
    });
  }

  public subscribe(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
