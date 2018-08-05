import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { User, ServerEvents } from 'jukebox-common';

import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isConnected: boolean;
  private isOutdated: boolean;

  constructor(private socket: SocketService) {
    this.isOutdated = false;
    this.isConnected = false;

    const subscription = socket.connection$.subscribe(
      (isOnline: boolean) => this.isConnected = isOnline,
      (err: any) => this.isConnected = false,
      () => subscription.unsubscribe()
    );
  }

  ngOnInit() {
    this.socket.subscribe(ServerEvents.ClientOutdated, () => {
      this.isOutdated = true;
    });
  }

  ngOnDestroy() {
    this.socket.unsubscribe(ServerEvents.ClientOutdated);
  }

  public get requiresUpdate(): boolean {
    return this.isOutdated;
  }
}
