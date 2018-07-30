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

  private isLoggedIn: boolean;
  private isOutdated: boolean;

  constructor(private socket: SocketService, private userService: UserService) {
    this.isLoggedIn = false;
    this.isOutdated = false;
  }

  ngOnInit() {
    this.socket.subscribe('disconnect', () => {
      this.isLoggedIn = false;
    });

    this.socket.subscribe(ServerEvents.ClientOutdated, () => {
      this.isOutdated = true;
    });
  }

  ngOnDestroy() {
    this.socket.unsubscribe('disconnect');
    this.socket.unsubscribe(ServerEvents.ClientOutdated);
  }

  public get shouldShowLogin(): boolean {
    return !this.isLoggedIn;
  }

  public get shouldShowJukebox(): boolean {
    return this.isLoggedIn;
  }

  public get userInfo$(): Observable<User> {
    return this.userService.currentUser$();
  }

  public get requiresUpdate(): boolean {
    return this.isOutdated;
  }

  public onLogin(): void {
    this.isLoggedIn = true;
  }
}
