import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

import { User, WebClientEvents } from 'jukebox-common';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject: BehaviorSubject<User>;

  constructor(private socket: SocketService) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.socket.subscribe('disconnect', () => this.userSubject.next(null));
  }

  public authenticate(name: string): void {
    this.socket.emit(WebClientEvents.ClientSentLogin, { name }, (user: User) => this.onUserAcknowledged(user));
  }

  private onUserAcknowledged(user: User): void {
    this.userSubject.next(user);
  }

  public currentUser$(): Observable<User> {
    return this.userSubject.asObservable();
  }
}
