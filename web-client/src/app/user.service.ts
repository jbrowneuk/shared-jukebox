import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

import { User, WebClientEvents } from 'jukebox-common';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<User>;
  private hasUserInfo: boolean;

  constructor(private socket: SocketService) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.hasUserInfo = false;
    this.socket.subscribe('disconnect', () => {
      this.hasUserInfo = false;
      this.userSubject.next(null);
    });
  }

  public authenticate(name: string): void {
    this.socket.emit(WebClientEvents.ClientSentLogin, { name }, (user: User) => this.onUserAcknowledged(user));
  }

  public currentUser$(): Observable<User> {
    return this.userSubject.asObservable();
  }

  public isAuthenticated(): boolean {
    return this.hasUserInfo;
  }

  private onUserAcknowledged(user: User): void {
    this.userSubject.next(user);
    this.hasUserInfo = true;
  }
}
