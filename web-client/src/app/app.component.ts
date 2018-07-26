import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../../../shared/models';

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

  private isConnected: boolean;

  constructor(private socket: SocketService, private userService: UserService) {
    this.isConnected = false;
  }

  ngOnInit() {
    this.socket.subscribe('disconnect', () => {
      this.isConnected = false;
    });
  }

  ngOnDestroy() {
    this.socket.unsubscribe('disconnect');
  }

  public get shouldShowLogin(): boolean {
    return !this.isConnected;
  }

  public get shouldShowJukebox(): boolean {
    return this.isConnected;
  }

  public get userInfo$(): Observable<User> {
    return this.userService.currentUser$();
  }

  public onLogin(): void {
    this.isConnected = true;
  }
}
