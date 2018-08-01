import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { User, ServerEvents } from 'jukebox-common';

import { AnimationSettings } from './app.component.transitions';
import { SocketService } from './socket.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: AnimationSettings
})
export class AppComponent implements OnInit, OnDestroy {

  public isConnected: boolean;
  private isOutdated: boolean;

  constructor(private socket: SocketService, private userService: UserService) {
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

  public get userInfo$(): Observable<User> {
    return this.userService.currentUser$();
  }

  public get requiresUpdate(): boolean {
    return this.isOutdated;
  }
}
